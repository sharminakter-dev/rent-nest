import { prisma } from "../../lib/prisma"
import type { ICreatePropertyPayload, IUdateProertyPayload } from "./landlord.interface"

const createProperty = async(landlordId: string, payload: ICreatePropertyPayload)=>{
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

const updateProperty = async(propertyId:string, landlordId: string, payload: IUdateProertyPayload)=>{

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

const deleteProperty = async(propertyId:string, landlordId: string)=>{

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

const getRentalRequests = async()=>{
}

const updateRentalStatus = async()=>{
}


export const landlordServices = {
    createProperty,
    updateProperty,
    deleteProperty,
    getRentalRequests,
    updateRentalStatus
}