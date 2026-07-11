import { prisma } from "../../lib/prisma";
import type { IReviewPayload } from "./reviews.interface";

const createReview = async(userId: string, payload: IReviewPayload)=>{

    const {propertyId} = payload;
    
    const property = await prisma.property.findUnique({
        where: {
            id: propertyId
        }
    });

    if(!propertyId){
        throw new Error("Property Does Not Exist.")
    }

    const rental = await prisma.rentalRequest.findFirst({
        where:{
            tenantId: userId,
            status: "ACTIVE"
        }
    });

    if(!rental){
        throw new Error("You havent rented This Property.")
    }

    const review = await prisma.review.create({
        data:{
            ...payload,
            tenantId: userId,
            rentalRequestId: rental.id
        }
    });

    return review;

};


export const reviewsServices = {
    createReview
}