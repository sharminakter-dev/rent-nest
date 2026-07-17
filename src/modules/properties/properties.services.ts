import type { PropertyWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import type { IPropertyQuery } from "./properties.interface";

const getAllProperties = async (query: IPropertyQuery)=>{

    const sortBy = query.sortBy? query.sortBy : "createdAt";
    const sortOrder = query.sortOrder? query.sortOrder : "desc";

    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;

    const skip = (page-1) * limit;

    const andCondition: PropertyWhereInput[] =  [];

    andCondition.push({
        isAvailable: true
    });

    if(query.searchTerm){
        andCondition.push(
            {
                OR:[
                    {
                        title: {
                            contains: query.searchTerm,
                            mode: "insensitive"
                        }
                    },

                    {
                        location: {
                            contains: query.searchTerm,
                            mode: "insensitive"
                        }
                    },
                    
                    {
                        description: {
                            contains: query.searchTerm,
                            mode: "insensitive"
                        }
                    },
                ]
            }
        )
    }

    if(query.location){
        andCondition.push(
            {
                location: {
                    contains: query.location as string,
                    mode: "insensitive"
                }
            }
        )
    }

    if(query.minRent){
        andCondition.push(
            {
                rent: {
                    gte: Number(query.minRent)
                }
            }
        )
    }

    if(query.maxRent){
        andCondition.push(
            {
                rent: {
                    lte: Number(query.maxRent)
                }
            }
        )
    }

    if(query.bedrooms){
        andCondition.push({
            bedrooms: Number(query.bedrooms)
        })
    }

    if(query.bathrooms){
        andCondition.push({
            bathrooms: Number(query.bathrooms)
        })
    }

    // *search by category
    if(query.type){
        andCondition.push(
            {
                category:{
                    slug: {
                        contains: query.type,
                        mode: "insensitive"
                    }
                }
            }
        )
    }


    const properties = await prisma.property.findMany({

        where:{
            // * filtering and searching
            AND : andCondition
        },
        

        take: limit,
        skip: skip,
        include:{
            landlord: {
                select: {
                    name: true,
                }
            },
            category:{
                select:{
                    slug: true
                }
            },
            reviews: {
                select: {
                    rating: true,
                    comment: true,
                }
            }
        },
        orderBy:{
            [sortBy]: sortOrder,
        },
    });

    const totalPropertyCount = await prisma.property.count({
        where:{
            AND: andCondition
        }
    });

    return {
        properties,
        meta:{
            total: totalPropertyCount,
            page: page,
            limit: limit
        }
    }
};

const getPropertyByID = async (propertyId: string)=>{

    const property = await prisma.property.findUniqueOrThrow({
        where:{
            id: propertyId
        },
        include:{
            landlord:{
                select:{
                    name: true,
                }
            },
            category:{
                select:{
                    slug: true
                }
            },
            reviews: {
                select: {
                    rating: true,
                    comment: true,
                }
            }
        }
    });

    return property;
};

export const propertyServices = {
    getAllProperties,
    getPropertyByID
}