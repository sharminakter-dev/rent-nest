import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { landlordController } from "./landlord.controller";

const router = Router();

router.post(
    "/properties", 
    auth(Role.LANDLORD),
    landlordController.createProperty
);

router.put(
    "/properties/:id", 
    auth(Role.LANDLORD),
    landlordController.updateProperty
);

router.delete(
    "/properties/:id", 
    auth(Role.LANDLORD),
    landlordController.deleteProperty
);


router.get(
    "/requests", 
    auth(Role.LANDLORD),
    landlordController.getRentalRequests
);


router.patch(
    "/requests/:id", 
    auth(Role.LANDLORD),
    landlordController.updateRentalStatus
);

router.get(
    "/reviews", 
    auth(Role.LANDLORD),
    landlordController.getMyRentalReviews
);

export const landlordRoutes = router;