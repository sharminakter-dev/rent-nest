import type { NextFunction, Request, Response } from "express"
import { catchAsync } from "../utils/catchAsync"
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { type JwtPayload } from "jsonwebtoken"
import type { Role, UserStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

declare global {
    namespace Express{
        interface Request{
            user?:{
                id: string,
                name: string,
                email: string,
                role: Role,
                status: UserStatus
            }
        }
    }
}

export const auth = (...requiredRole: Role[])=>{
    return catchAsync( async(req: Request, res: Response, next: NextFunction)=>{

        const accessToken = req.cookies.accessToken? 
            req.cookies.accessToken : 
            req.headers.authorization?.startsWith("Bearer")?
                req.headers.authorization?.split(" ")[1]:
                req.headers.authorization;
        
        if(!accessToken){
            throw new Error("You Are Not Logged In.");
        }

        const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret);
        
        if(!verifiedToken.success){
            throw new Error(verifiedToken.error);
        }

        const {id, name, email, role, status} = verifiedToken.data as JwtPayload;

        if(requiredRole.length && !requiredRole.includes(role)){
            throw new Error("You Dont have the permission");
        }

        const user = await prisma.user.findUniqueOrThrow({
            where:{
                id,
                name,
                email
            }
        })

        if(user.status === "BANNED"){
            throw new Error("Your Account Has Been Blocked. Please Contact Support."); 
        }

        req.user = {
            id,
            name, 
            email,
            role,
            status
        }

        next();
    });
}