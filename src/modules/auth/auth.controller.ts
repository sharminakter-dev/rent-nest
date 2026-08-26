import type { Request, Response } from "express"
import { authServices } from "./auth.service";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";

const createUser = catchAsync(async(req: Request, res: Response)=>{
    const payload = req.body;
    
    const result = await authServices.createUserIntoDB(payload);
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully",
        data:{
            result
        }
    });
});

const loginUser = catchAsync( async(req: Request, res: Response)=>{
    const payload = req.body;

    const {accessToken, refreshToken} = await authServices.loginUser(payload);

    // set tokens in cookie
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite:"none",
        maxAge: 1000 * 60 * 60 * 24
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite:"none",
        maxAge: 1000 * 60 * 60 * 24 * 7
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Retrieved Successfully",
        data:{
            accessToken,
            refreshToken
        }
    });
});

const refreshToken = catchAsync( async(req: Request, res: Response)=>{

    const {refreshToken} = req.cookies

    const accessToken = await authServices.refreshToken(refreshToken)

    // set access token in cookie
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Access Token Generated Successfully",
        data:{
            accessToken
        }
    });
});

const getMyProfile = catchAsync( async(req: Request, res: Response)=>{

    const userId = req.user?.id;

    // if(!userId){

    // }
    const result = await authServices.getMyProfile(userId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Retrieved Successfully",
        data:{
            result
        }
    });
});

export const authController = {
    createUser,
    loginUser,
    refreshToken,
    getMyProfile
}