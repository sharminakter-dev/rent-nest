import type { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getAllUsers = async()=>{
    const users = await prisma.user.findMany();

    const totalUsers = await prisma.user.count()

    return {users, totalUsers}
};

const updateUserStatus = async(userId: string, status: UserStatus)=>{

    const user = await prisma.user.findUnique({
        where:{id: userId}
    });

    if(!user){
        throw new Error("User Does Not Exists.");
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
    
    const properties = await prisma.property.findMany();

    return properties;
};

const getAllRentals = async()=>{

    const rentals = await prisma.rentalRequest.findMany();

    return rentals
};

export const adminService = {
    getAllUsers,
    updateUserStatus,
    getAllProperties,
    getAllRentals
}