import type { Request, Response } from "express";
import  { catchAsync } from "../../utils/catchAsync";
import http from "http-status"
import { sendResponse } from "../../utils/sendResponse";

const createPayment = catchAsync( async(req: Request, res: Response)=>{

    sendResponse(res, {
        success: true,
        statusCode: http.CREATED,
        message: "Payment Created Successfully.",
        data: {}
    });
});

const confirmPayment =  catchAsync( async(req: Request, res: Response)=>{

    sendResponse(res, {
        success: true,
        statusCode: http.OK,
        message: "Payment Retrieved Successfully.",
        data: {}
    });
});

const getMyPaymentHistory =  catchAsync( async(req: Request, res: Response)=>{

    sendResponse(res, {
        success: true,
        statusCode: http.OK,
        message: "Payment Retrieved Successfully.",
        data: {}
    });
});

const getPaymentById =  catchAsync( async(req: Request, res: Response)=>{

    sendResponse(res, {
        success: true,
        statusCode: http.OK,
        message: "Payment Retrieved Successfully.",
        data: {}
    });
});

export const paymentController = {
    createPayment,
    confirmPayment,
    getMyPaymentHistory,
    getPaymentById
}