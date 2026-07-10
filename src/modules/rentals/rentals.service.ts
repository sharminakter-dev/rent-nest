import { prisma } from "../../lib/prisma";
import type { IRentalPayload } from "./rentals.interface";

const createRentalReq =  async(tenantId: string, payload: IRentalPayload)=>{

    const {startDate, ...rest} = payload;

    const startDateISO = new Date(startDate);

    const rental = await prisma.rentalRequest.create({
        data: {
            ...rest,
            startDate: startDateISO,
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