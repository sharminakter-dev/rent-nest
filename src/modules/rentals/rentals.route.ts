import { Router } from "express";
import { rentalController } from "./rentals.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", 
    auth(Role.TENANT), 
    rentalController.createRentalReq
);

router.get("/", 
    auth(Role.TENANT), 
    rentalController.getMyRentalReq
);

router.get("/:id", 
    auth(Role.TENANT, Role.ADMIN, Role.LANDLORD), 
    rentalController.getRentalReqById
);

export const rentalRoutes = router;