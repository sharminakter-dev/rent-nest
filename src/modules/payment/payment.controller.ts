import type { Request, Response } from "express";
import  { catchAsync } from "../../utils/catchAsync";
import http from "http-status"
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

const createPayment = catchAsync( async(req: Request, res: Response)=>{

    const userId = req.user?.id!;
    const isTenant = req.user?.role === "TENANT";
    const {rentalRequestId} = req.body;

    console.log("userId :" , userId)

    const result = await paymentService.createPayment(userId, isTenant, rentalRequestId);

    sendResponse(res, {
        success: true,
        statusCode: http.CREATED,
        message: "Payment Initiated Successfully.",
        data: result
    });
});

const confirmPayment =  catchAsync( async(req: Request, res: Response)=>{
    const event = req.body as Buffer;
    const signature = req.headers['stripe-signature'];

    await paymentService.confirmPayment(event, signature as string);

    sendResponse(res, {
        success: true,
        statusCode: http.OK,
        message: "Payment Confirmed Successfully.",
        data: null
    });
});

const getMyPaymentHistory =  catchAsync( async(req: Request, res: Response)=>{

    const userId = req.user?.id!;

    if(!userId){
        throw new Error("You Are Not Logged In.")
    }

    const result = await paymentService.getMyPaymentHistory(userId as string);

    sendResponse(res, {
        success: true,
        statusCode: http.OK,
        message: "Payment Retrieved Successfully.",
        data: result
    });
});

const getPaymentById =  catchAsync( async(req: Request, res: Response)=>{

    const paymentId = req.params.id;

    const result = await paymentService.getPaymentById(paymentId as string);

    sendResponse(res, {
        success: true,
        statusCode: http.OK,
        message: "Payment Retrieved Successfully.",
        data: result
    });
});

export const paymentController = {
    createPayment,
    confirmPayment,
    getMyPaymentHistory,
    getPaymentById
}