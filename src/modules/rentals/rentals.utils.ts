import type { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const computeEndDate = (startDate: Date, durationMonths: number) => {
    const end = new Date(startDate);
    end.setMonth(end.getMonth() + durationMonths);
    return end;
};

export const autoCompleteExpiredRentals = async(landlordId?: string, tenantId?: string)=>{

    const now = new Date();

    const candidates = await prisma.rentalRequest.findMany({
        where: {
            status: "ACTIVE",
            ...(tenantId ? { tenantId } : {}),
            ...(landlordId ? { property: { landlordId } } : {}),
        },
        select: { id: true, startDate: true, durationMonths: true, propertyId: true }
    });
    const expired = candidates.filter(
        (r) => computeEndDate(r.startDate, r.durationMonths) <= now
    );

    if(expired.length === 0){
        return { completedCount: 0 };
    }

    const rentalIds = expired.map((r) => r.id);
    const propertyIds = [...new Set(expired.map((r) => r.propertyId))];

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.rentalRequest.updateMany({
            where: { id: { in: rentalIds } },
            data: { status: "COMPLETED" }
        });
         await tx.property.updateMany({
            where: { id: { in: propertyIds } },
            data: { isAvailable: true }
        });
    });

    return { completedCount: expired.length };
};