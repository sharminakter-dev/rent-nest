import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { categoryServices } from "./categories.service";

const getAllCategories = catchAsync( async(req: Request, res: Response)=>{

    const result = await categoryServices.getAllCategories();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All Categories Retrieved Successfully.",
        data: result.categories,
        meta: {
            total: result.totalCategories
        }
    });
});

export const categoryController = {
    getAllCategories
}