import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { rentalServices } from "./rentals.service";
import { sendResponse } from "../../utils/sendResponse";
import http from "http-status"

const createRentalReq = catchAsync( async(req: Request, res: Response)=>{
    const tenantId = req.user?.id!;
    const payload = req.body;

    const result = await rentalServices.createRentalReq(tenantId, payload);

    sendResponse(res, {
        success: true,
        statusCode: http.CREATED,
        message: "Rental Request Created Successfully.",
        data: result
    });

});

const getMyRentalReq = catchAsync( async(req: Request, res: Response)=>{

    const tenantId = req.user?.id!;

    const result = await rentalServices.getMyRentalReq(tenantId);

    sendResponse(res, {
        success: true,
        statusCode: http.OK,
        message: "Rental Request Retrieved Successfully.",
        data: result.rentalReqs,
        meta:{
            total: result.totalRentCount
        }
    });

});

const getRentalReqById = catchAsync( async(req: Request, res: Response)=>{

    const rentalId = req.params.id

    const result = await rentalServices.getRentalReqById(rentalId as string);

    sendResponse(res, {
        success: true,
        statusCode: http.OK,
        message: "Rental Request Retrieved Successfully.",
        data: result
    });
});

export const rentalController = {
    createRentalReq,
    getMyRentalReq,
    getRentalReqById
}