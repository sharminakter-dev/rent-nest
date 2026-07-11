import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { paymentController } from "./payment.controller";

const router = Router();

router.post("/create",
    auth(Role.TENANT, Role.LANDLORD, Role.TENANT), 
    paymentController.createPayment
);

router.post("/confirm",
    paymentController.confirmPayment
);

router.get("/",
    auth(Role.TENANT, Role.ADMIN, Role.LANDLORD),
    paymentController.getMyPaymentHistory
);

router.get("/:id",
    auth(Role.TENANT, Role.ADMIN), 
    paymentController.getPaymentById
);

export const paymentRoutes = router;