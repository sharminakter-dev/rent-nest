import { prisma } from "../../lib/prisma";
import type { IRentalPayload } from "./rentals.interface";
import { autoCompleteExpiredRentals } from "./rentals.utils";


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

    await autoCompleteExpiredRentals(undefined, tenantId);

    const rentalReqs = await prisma.rentalRequest.findMany({
        where:{
            tenantId
        },
        include:{
            property:{ select:{title: true, isAvailable: true} },
            tenant: { select:{name: true} },
            review:{ select:{rating:true} }
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

    const existing = await prisma.rentalRequest.findUniqueOrThrow({ where: { id: rentalId } });

    if(existing?.status === "ACTIVE"){
        await autoCompleteExpiredRentals();
    }

    const rental = await prisma.rentalRequest.findUniqueOrThrow({
        where:{
            id: rentalId
        },
        include:{
            property:{ select:{ title: true, isAvailable: true} },
            tenant: { select:{name: true} },
            review:{ select:{rating:true} }
        }
    });

    return rental;
};

const deleteRentalReq = async(tenantId: string, rentalId: string)=>{

    const rental = await prisma.rentalRequest.findUnique({
        where: { id: rentalId }
    });

    if(!rental){
        throw new Error("Rental Request Does Not Exist.");
    }

    if(rental.tenantId !== tenantId){
        throw new Error("You Can Only Cancel Your Own Rental Requests.");
    }

    if(rental.status !== "PENDING"){
        throw new Error("Only Pending Requests Can Be Cancelled.");
    }

    const result = await prisma.rentalRequest.delete({
        where: { id: rentalId }
    });

    return result;
};


export const rentalServices = {
    createRentalReq,
    getMyRentalReq,
    getRentalReqById,
    deleteRentalReq
}