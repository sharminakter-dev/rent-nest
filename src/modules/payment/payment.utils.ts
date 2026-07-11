import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import stripe from "../../lib/stripe";

export const handleCheckoutCompleted = async(session: Stripe.Checkout.Session)=>{

    const rentalRequestId = session.metadata?.rentalRequestId;
    const tenantId = session.metadata?.userId;
    const transactionId = session.id;

    if(!tenantId || !rentalRequestId || !transactionId){
        console.log("Webhook : Missing Values For Creating Checkout Session");
        return
    }

    if (session.payment_status !== "paid") {
        console.log("Webhook: session completed but not paid", session.id);
        return;
    }

    const existing = await prisma.payment.findUnique({ where: { transactionId } });

    console.log("existing payment row:", existing); 

    if (existing?.status === "SUCCESS") {
        return; 
    }


    const rentalRequest = await prisma.rentalRequest.findUniqueOrThrow({
        where: { id: rentalRequestId },
        include: { property: true },
    });
    
    await prisma.$transaction(async (tx) => {
        await tx.payment.upsert({
            where: { rentalRequestId },
            update: { status: "SUCCESS", paidAt: new Date(), transactionId },
            create: {
                rentalRequestId,
                tenantId,
                landlordId: rentalRequest.property.landlordId,
                amount: rentalRequest.property.rent,
                status: "SUCCESS",
                paidAt: new Date(),
                transactionId,
            },
        });

        await tx.rentalRequest.update({
            where: { id: rentalRequestId },
            data: { status: "ACTIVE" },
        });

        await tx.property.update({
            where: { id: rentalRequest.propertyId },
            data: { isAvailable: false },
        });
  });
}