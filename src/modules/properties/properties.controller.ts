import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"
import { propertyServices } from "./properties.services";

const getAllProperties = catchAsync( async(req: Request, res: Response)=>{

    const query = req.query;

    const {properties, meta} = await propertyServices.getAllProperties(query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Properties Retrieved Successfully.",
        data: properties,
        meta: meta
    });
});

const getPropertyByID = catchAsync( async(req: Request, res: Response)=>{

    const {id} = req.params;

    const result = await propertyServices.getPropertyByID(id as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property Retrieved Successfully.",
        data: result,

    });
});

export const propertyController = {
    getAllProperties,
    getPropertyByID
}