import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import type { ICreateUser, ILoginUser } from "./auth.interface"
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";
import { jwtUtils } from "../../utils/jwt";
import { type JwtPayload, type SignOptions } from "jsonwebtoken"

const createUserIntoDB = async(payload: ICreateUser)=>{
    const {name, email, password, role, phone, address} = payload;

    const isUserExist = await prisma.user.findUnique({
        where: {email}
    });

    if(isUserExist){
        throw new Error("User With This Email Already Exists.");
    }

    const allowedRoles:Role[] = [Role.LANDLORD, Role.TENANT];
    
    if(!allowedRoles.includes(role)){
        throw new Error(`Role ${role} is not allowed`);
    }

    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));


    // * create new user
    await prisma.user.create({
        data:{
            name,
            email,
            password: hashedPassword,
            role
        }
    });

    const user = await prisma.user.findUnique({
        where: {
            email
        },
        omit:{
            password: true,
        },
    });

    return user

}

const loginUser = async(payload: ILoginUser)=>{
    const {email, password} = payload;
  

    const user = await prisma.user.findFirstOrThrow({
        where:{
            email: email
        }
    });

    if(user.status === "BANNED"){
        throw new Error("Your Account Is Banned Please Contact Support.");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    

    if(!isPasswordMatch){
        throw new Error("Password Is Incorrect.");
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
    }

    const accessToken = jwtUtils.createToken(
        jwtPayload, 
        config.jwt_access_secret, 
        config.jwt_access_expires_in as SignOptions
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload, 
        config.jwt_refresh_secret, 
        config.jwt_refresh_expires_in as SignOptions
    );

    return {accessToken, refreshToken}

}

const refreshToken = async(refreshToken:string)=>{
    const verifiedToken = jwtUtils.verifyToken(refreshToken, config.jwt_refresh_secret);

    if(!verifiedToken.success){
        throw new Error(verifiedToken.error)
    }

    // console.log(verifiedToken.data)

    const {id} = verifiedToken.data as JwtPayload;

    const user = await prisma.user.findUniqueOrThrow({
        where: {id}
    });

    if(user.status === "BANNED"){
        throw new Error("Your Account Is Banned Please Contact Support.");
    }

    const jwtPayload = {
        id, 
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
    }

    const accessToken = jwtUtils.createToken(
        jwtPayload, 
        config.jwt_access_secret, 
        config.jwt_access_expires_in as SignOptions
    );

    return accessToken;

}

const getMyProfile = async(userId: string)=>{
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        },
        omit: {
            password: true
        },
        include:{
            profile: true
        }
    });

    return user
}

export const authServices = {
    createUserIntoDB,
    loginUser,
    refreshToken,
    getMyProfile
}