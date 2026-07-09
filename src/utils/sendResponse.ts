import type { Response } from "express";

type TMetaData = {
    page: number,
    limit: number,
    total: number
}

type TResponseData <T> = {
    success: boolean,
    statusCode: number,
    message: string,
    data?: T,
    meta?: TMetaData
}

export const sendResponse = <T>(res: Response, data:TResponseData<T>)=>{
    res.status(data.statusCode).json({
        success: true,
        statusCode: data.statusCode,
        message: "User Created Successfylly",
        data: data.data,
        meta: data.meta
    });
}