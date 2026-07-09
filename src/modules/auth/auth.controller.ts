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
        message: "User Created Successfylly",
        data:{
            result
        }
    });
});

export const authController = {
    createUser,
}