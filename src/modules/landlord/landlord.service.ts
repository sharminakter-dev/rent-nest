import type { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma"
import { autoCompleteExpiredRentals } from "../rentals/rentals.utils";
import type { ICreatePropertyPayload, IStatusPayload, IUdateProertyPayload } from "./landlord.interface"

const createProperty = async(landlordId: string, isActive:boolean, payload: ICreatePropertyPayload)=>{
    
    if(!isActive){
        throw new Error("Your Account is Banned. Please Cantact Authority.")
    }

    const {category:categoryData, ...rest} = payload;

    const category = await prisma.category.upsert({
        where: {
            slug: categoryData.slug
        },
        update:{},
        create:{
            ...categoryData
        }
    });


    const property = await prisma.property.create({
        data:{
            ...rest,
            landlordId,
            categoryId: category.id

        }
    });

    return property;
}

const updateProperty = async(propertyId:string, landlordId: string, isActive:boolean, payload: IUdateProertyPayload)=>{

    if(!isActive){
        throw new Error("Your Account is Banned. Please Cantact Authority.")
    }

    const property = await prisma.property.findUniqueOrThrow({
        where: {
            id: propertyId
        }
    });

    if(property.landlordId !== landlordId){
        throw new Error("You Are Not The Owner Of The Property.");
    }

    const updatedProperty =  await prisma.property.update({
        where:{
            id: propertyId
        },
        data: payload,
        include:{
            rentalRequests: true,
            reviews: true,
        }
    });

    return updatedProperty;
}

const deleteProperty = async(propertyId:string, landlordId: string, isActive: boolean)=>{
    if(!isActive){
        throw new Error("Your Account is Banned. Please Cantact Authority.")
    }

    const property = await prisma.property.findUniqueOrThrow({
        where: {
            id: propertyId
        }
    });

    if(property.landlordId !== landlordId){
        throw new Error("You Are Not The Owner Of The Property.");
    }

    // delete Property
    await prisma.property.delete({
        where:{
            id : propertyId
        }
    });

    return null
}

const getRentalRequests = async(landlordId: string, isActive: boolean)=>{

    if(!isActive){
        throw new Error("Your Account is Banned. Please Cantact Authority.")
    }

    await autoCompleteExpiredRentals(landlordId);

    const rentRequests = await prisma.rentalRequest.findMany({
        where: {
            property:{
                landlordId
            }
        },
        include:{
            tenant:{
                select: { id: true, name: true, email: true },
            },
            property:{
                select: {id: true, title: true, rent: true}
            },
            review:{
                select: {comment: true}
            }
        },
        orderBy:{
            createdAt: "desc"
        }
    });

    return rentRequests;

}

const updateRentalStatus = async(rentalReqId: string, landlordId: string, isActive: boolean, payload: IStatusPayload)=>{

    if(!isActive){
        throw new Error("Your Account is Banned. Please Cantact Authority.")
    }

    const rentalTransaction = await prisma.$transaction( async(tx: Prisma.TransactionClient)=>{

        const existingRental = await tx.rentalRequest.findUniqueOrThrow({
            where:{
                id: rentalReqId
            },
            include:{
                property: true
            }
        });

        if(existingRental.property.landlordId !== landlordId){
            throw new Error("You Are Not The Owner Of This Property.");
        }

        if(existingRental.status !== "PENDING"){
            throw new Error(`Cannot Update Status — This Request Is Already ${existingRental.status}.`);
        }

        if(payload.status !== "APPROVED" && payload.status !== "REJECTED"){
            throw new Error("Landlords Can Only Approve Or Reject A Pending Request.");
        }

        await tx.rentalRequest.update({
            where:{
                id: rentalReqId
            },
            data:{
                status: payload.status
            }
        });

        const rental = await tx.rentalRequest.findUniqueOrThrow({
            where:{
                id: rentalReqId,
            },
            include:{
                tenant:{
                    select: { id: true, name: true, email: true },
                },
                property:{
                    select: {id: true, title: true, rent: true}
                }
            }
        });

        return rental;
    });

    return rentalTransaction;

}

const getMyRentalReviews = async(landlordId: string, isActive: boolean)=>{

    if(!isActive){
        throw new Error("Your Account is Banned. Please Cantact Authority.")
    }

    const myReviews = await prisma.review.findMany({
        where:{
            property:{
                landlordId
            }
        },
        include:{
            property:true,
            tenant:{
                select: {id: true, name: true, email: true}
            }
        }
    });

    return myReviews;

}

const getMyProperties  = async(landlordId: string, isActive: boolean)=>{ 
    
    if(!isActive){
        throw new Error("Your Account is Banned. Please Cantact Authority.")
    }

    const myProperties = await prisma.property.findMany({
        where:{
            
            landlordId
        },
        include:{
            category : true,
            landlord:{
                select: {id: true, email: true}
            },
            rentalRequests: true,
            reviews: true,
        }
    });

    return myProperties
}


export const landlordServices = {
    createProperty,
    updateProperty,
    deleteProperty,
    getRentalRequests,
    updateRentalStatus,
    getMyRentalReviews,
    getMyProperties
}