import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import http from "http-status";
import { reviewsServices } from "./reviews.service";

const createReview = catchAsync( async(req: Request, res: Response)=>{

    const userId = req.user?.id!;
    const payload = req.body;

    const result = await reviewsServices.createReview(userId, payload);

    sendResponse(res, {
        success: true,
        statusCode: http.CREATED,
        message: "Reviews Created Successfully.",
        data: result
    });
});

export const reviewsController = {createReview}

