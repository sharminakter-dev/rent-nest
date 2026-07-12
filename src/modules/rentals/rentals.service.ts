import { prisma } from "../../lib/prisma";
import type { IRentalPayload } from "./rentals.interface";

const createRentalReq =  async(tenantId: string, payload: IRentalPayload)=>{

    const {startDate, ...rest} = payload;

    const startDateISO = new Date(startDate);

    const {propertyId} = payload;

    const property = await prisma.property.findUnique({
        where: {id: propertyId}
    });

    if(!property){
        throw new Error("Property Does Not Exist To Request For Rental");
    }

    if(!property.isAvailable){
        throw new Error("Property Is Not Available for Rent.")
    }

    const existRental = await prisma.rentalRequest.findFirst({
        where:{
            tenantId,
            propertyId
        }
    });

    if(existRental){
        throw new Error("You Have Already Requested For This Property.");
    }

    const rental = await prisma.rentalRequest.create({
        data: {
            ...rest,
            startDate: startDateISO,
            status: "PENDING",
            tenantId,
        }
    });

    return rental

};

const getMyRentalReq =  async(tenantId: string)=>{
    const rentalReqs = await prisma.rentalRequest.findMany({
        where:{
            tenantId
        },
        include:{
            property:{
                select:{
                    title: true,
                    isAvailable: true
                }
            },
            tenant: {
                select:{
                    name: true
                }
            },
            review:{
                select:{
                    rating:true
                }
            }
        }
    });

    const totalRentCount = await prisma.rentalRequest.count({
        where:{
            tenantId
        }
    });

    return {rentalReqs, totalRentCount};
};

const getRentalReqById =  async(rentalId : string)=>{

    const rental = await prisma.rentalRequest.findUniqueOrThrow({
        where:{
            id: rentalId
        },
        include:{
            property:{
                select:{
                    title: true,
                    isAvailable: true
                }
            },
            tenant: {
                select:{
                    name: true
                }
            },
            review:{
                select:{
                    rating:true
                }
            }
        }
    });

    return rental;
};

export const rentalServices = {
    createRentalReq,
    getMyRentalReq,
    getRentalReqById
}