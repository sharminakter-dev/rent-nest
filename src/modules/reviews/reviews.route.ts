import { Router, type Request, type Response } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { reviewsController } from "./reviews.controller";

const router = Router();

router.post(
    "/",
    auth(Role.TENANT),
    reviewsController.createReview
)



export const reviewRoutes = router