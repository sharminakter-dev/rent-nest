import { prisma } from "../../lib/prisma"
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

    return updateProperty;
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
            }
        }
    });

    return rentRequests;

}

const updateRentalStatus = async(rentalReqId : string, payload: IStatusPayload)=>{

    const rentalTransaction = await prisma.$transaction( async(tx)=>{
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
                id: rentalReqId
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


export const landlordServices = {
    createProperty,
    updateProperty,
    deleteProperty,
    getRentalRequests,
    updateRentalStatus
}