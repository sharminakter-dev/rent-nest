import { use } from "react";
import type { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getAllUsers = async()=>{

    const users = await prisma.user.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });

    const totalUsers = await prisma.user.count()

    return {users, totalUsers}
};

const updateUserStatus = async(userId: string, status: UserStatus)=>{

    const user = await prisma.user.findUnique({
        where:{id: userId},
    });

    if(!user){
        throw new Error("User Does Not Exists.");
    }

    if(user.status === status){
        throw new Error(`Your Provided Status ${status} is already upto date.`)
    }

    const updatedUser = await prisma.user.update({
        where: {id: userId},
        data: {
            status
        }
    });

    return updatedUser
};

const getAllProperties = async()=>{
    
    const properties = await prisma.property.findMany({
        include:{
            landlord:{
                select:{ name: true, email: true }
            },
            category:{
                select:{slug: true}
            },
            rentalRequests:{
                select:{id: true}
            },
            reviews:{
                select: {rating: true, comment:true}
            }
        },
        orderBy:{
            createdAt: "desc"
        }
    });

    return properties;
};

const getAllRentals = async()=>{

    const rentals = await prisma.rentalRequest.findMany({
        include:{
            property:{
                select:{location: true, isAvailable: true, reviews: true,landlord:{
                    select:{name:true, email: true}
                } }
            }
        }
    });

    return rentals
};

export const adminService = {
    getAllUsers,
    updateUserStatus,
    getAllProperties,
    getAllRentals
}