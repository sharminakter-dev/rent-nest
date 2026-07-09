import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import type { ICreateUser } from "./auth.interface"
import config from "../../config";

const createUserIntoDB = async(payload: ICreateUser)=>{
    const {name, email, password, phone, address} = payload;

    const isUserExist = await prisma.user.findUnique({
        where: {email}
    });

    if(isUserExist){
        throw new Error("User With This Email Already Exists.");
    }

    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));


    // * create new user
    await prisma.user.create({
        data:{
            name,
            email,
            password: hashedPassword,
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

export const authServices = {
    createUserIntoDB,
}