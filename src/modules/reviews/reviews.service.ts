import { prisma } from "../../lib/prisma";
import type { IReviewPayload } from "./reviews.interface";

const createReview = async(userId: string, payload: IReviewPayload)=>{

    const {rentalId, ...rest} = payload;

    const rental = await prisma.rentalRequest.findUnique({
        where:{
            id:rentalId,
            tenantId: userId,
            status: "ACTIVE"
        }
    });

    if(!rental){
        throw new Error("You havent rented This Property.")
    }

    const review = await prisma.review.create({
        data:{
            ...rest,
            tenantId: userId,
            propertyId: rental.propertyId,
            rentalRequestId: rentalId
        }
    });

    return review;

};


export const reviewsServices = {
    createReview
}