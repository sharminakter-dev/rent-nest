import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { paymentController } from "./payment.controller";

const router = Router();

router.post("/create",
    auth(Role.TENANT), 
    paymentController.createPayment
);

router.post("/confirm",
    auth(Role.TENANT), 
    paymentController.confirmPayment
);

router.get("/",
    auth(Role.TENANT), 
    paymentController.getMyPaymentHistory
);

router.post("/:id",
    auth(Role.TENANT, Role.ADMIN), 
    paymentController.getPaymentById
);

export const paymentRoutes = router;