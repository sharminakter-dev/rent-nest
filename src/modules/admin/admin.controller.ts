import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import http from "http-status";
import { adminService } from "./admin.service";

const getAllUsers = catchAsync( async(req: Request, res: Response)=>{

    const {users, totalUsers} = await adminService.getAllUsers();

    sendResponse(res, {
        success: true,
        statusCode: http.OK,
        message: "Users Retrieved Successfully.",
        data: users,
        meta: {
            total: totalUsers
        }
    });
});

const updateUserStatus = catchAsync( async(req: Request, res: Response)=>{

    const userId = req.params.id;
    const {status} = req.body;

    const result = await adminService.updateUserStatus(userId as string, status);

    sendResponse(res, {
        success: true,
        statusCode: http.OK,
        message: "Users Status Updated Successfully.",
        data: result
    });
});

const getAllProperties = catchAsync( async(req: Request, res: Response)=>{

    const result = await adminService.getAllProperties();

    sendResponse(res, {
        success: true,
        statusCode: http.OK,
        message: "Properties Retrieved Successfully.",
        data: result
    });
});

const getAllRentals = catchAsync( async(req: Request, res: Response)=>{

    const result = await adminService.getAllRentals();

    sendResponse(res, {
        success: true,
        statusCode: http.OK,
        message: "Rentals Retrieved Successfully.",
        data: result
    });
});

export const adminController = {
    getAllUsers,
    updateUserStatus,
    getAllProperties,
    getAllRentals
}