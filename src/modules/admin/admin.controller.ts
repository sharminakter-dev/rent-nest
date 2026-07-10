import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import http from "http-status";

const getAllUsers = catchAsync( async(req: Request, res: Response)=>{

    sendResponse(res, {
        success: true,
        statusCode: http.OK,
        message: "Users Retrieved Successfully.",
        data: {}
    });
});

const updateUserStatus = catchAsync( async(req: Request, res: Response)=>{

    sendResponse(res, {
        success: true,
        statusCode: http.OK,
        message: "Users Status Updated Successfully.",
        data: {}
    });
});

const getAllProperties = catchAsync( async(req: Request, res: Response)=>{

    sendResponse(res, {
        success: true,
        statusCode: http.OK,
        message: "Properties Retrieved Successfully.",
        data: {}
    });
});

const getAllRentals = catchAsync( async(req: Request, res: Response)=>{

    sendResponse(res, {
        success: true,
        statusCode: http.OK,
        message: "Users Retrieved Successfully.",
        data: {}
    });
});

export const userController = {
    getAllUsers,
    updateUserStatus,
    getAllProperties,
    getAllRentals
}