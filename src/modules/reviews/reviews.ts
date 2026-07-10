import { Router, type Request, type Response } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import http from "http-status"

const router = Router();

router.post(
    "/",
    auth(Role.TENANT),

)

const createReview = catchAsync( async(req: Request, res: Response)=>{

    sendResponse(res, {
        success: true,
        statusCode: http.CREATED,
        message: "Reviews Created Successfully.",
        data: {}
    });
});

export const reviewRoutes = router