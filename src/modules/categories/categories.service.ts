import { prisma } from "../../lib/prisma"

const getAllCategories = async()=>{
    const categories = await prisma.category.findMany();

    const totalCategories = await prisma.category.count();

    return {categories, totalCategories}
}

export const categoryServices = {
    getAllCategories
}