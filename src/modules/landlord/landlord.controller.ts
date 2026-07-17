import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"
import { landlordServices } from "./landlord.service";

const createProperty = catchAsync( async(req: Request, res: Response)=>{

    const landlordId = req.user?.id!;
    const payload = req.body;
    const isActive = req.user?.status === "ACTIVE";

    const result = await landlordServices.createProperty(landlordId, isActive, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Property Created Successfully.",
        data:result,
    })
});

const updateProperty = catchAsync( async(req: Request, res: Response)=>{

    const propertyId = req.params.id;
    const landlordId = req.user?.id;
    const payload = req.body;

    const isActive = req.user?.status === "ACTIVE";

    const result = await landlordServices.updateProperty(propertyId as string, landlordId as string, isActive, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property Updated Successfully.",
        data:result,
    })
});

const deleteProperty = catchAsync( async(req: Request, res: Response)=>{

    const propertyId = req.params.id;
    const landlordId = req.user?.id!;
    const isActive = req.user?.status === "ACTIVE";

    await landlordServices.deleteProperty(propertyId as string, landlordId, isActive)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property Deleted Successfully.",
        data:null,
    })
});

const getRentalRequests = catchAsync( async(req: Request, res: Response)=>{

    const landlordId = req.user?.id!;
    const isActive = req.user?.status === "ACTIVE";


    const result = await landlordServices.getRentalRequests(landlordId, isActive);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental Requests Retrieved Successfully.",
        data:result,
    })
});

const updateRentalStatus = catchAsync( async(req: Request, res: Response)=>{

    const rentalReqId = req.params.id;
    const payload = req.body

    const result = await landlordServices.updateRentalStatus(rentalReqId as string, payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Rental Requests Status Updated Successfully.",
        data:result,
    })
});

const getMyRentalReviews = catchAsync( async(req: Request, res: Response)=>{

    const landlordId = req.user?.id!;
    const isActive = req.user?.status === "ACTIVE";

    const result = await landlordServices.getMyRentalReviews(landlordId as string, isActive);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Reviews Retrieved Successfully.",
        data:result,
    })
});

export const landlordController = {
    createProperty,
    updateProperty,
    deleteProperty,
    getRentalRequests,
    updateRentalStatus,
    getMyRentalReviews
}