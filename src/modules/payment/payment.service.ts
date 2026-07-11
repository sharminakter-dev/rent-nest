import type Stripe from "stripe";
import { PaymentStatus } from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma"
import stripe from "../../lib/stripe";
import { handleCheckoutCompleted } from "./payment.utils";

const createPayment = async(userId: string, isTenant: boolean, rentalRequestId: string)=>{

    if(!isTenant){
        throw new Error("Only TENANT can create a payment request");
    }

    const paymentData = await prisma.$transaction( async(tx)=>{

        const user = await tx.user.findUniqueOrThrow({
            where:{id: userId},
        });

        const rentalReq = await tx.rentalRequest.findUniqueOrThrow({
            where:{
                id: rentalRequestId
            },
            include:{
                property: true
            }
        });

        if(rentalReq.tenantId != userId){
            throw new Error("This Is Not Your Rental Request.")
        }

        if(rentalReq.status !== "APPROVED"){
            throw new Error(`Cannot pay for a request with status ${rentalReq.status}`);
        }

        const existingPayment = await tx.payment.findFirst({
            where:{
                rentalRequestId,
                status: PaymentStatus.SUCCESS
            }
        });

        if(existingPayment){
            throw new Error('This Rental Has Already Been Paid For');
        }

        return {
            user,
            rentalReq,
        };
    });

    const amount = Math.round(Number(paymentData.rentalReq.property.rent)) * 100;

        const customer = await stripe.customers.create({
            email: paymentData.user.email,
            name: paymentData.user.name,
            metadata: {
                userId: paymentData.user.id
            }
        });

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                            currency: 'bdt',
                            unit_amount: amount,
                            product_data: {
                            name: `Rent — ${paymentData.rentalReq.property.title}`,
                        }
                    },
                    quantity: 1
                }
            ],
            mode:"payment",
            customer:  customer.id,
            currency: 'bdt',
            payment_method_types: ["card"],
            success_url: `${config.app_url}/premium?success=true`,
            cancel_url: `${config.app_url}/payment?success=false`,
            metadata: {
            rentalRequestId: paymentData.rentalReq.id,
            userId,
            propertyId: paymentData.rentalReq.propertyId,
            },
  
        });

        return session.url;
}

const confirmPayment = async(payload: Buffer, signature: string)=>{
    const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        config.stripe_webhook_secret
    );

    switch (event.type) {
        case 'checkout.session.completed':
            await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
            break;

        default:
            // Unexpected event type
            console.log(`Unhandled event type ${event.type}.`);
    }

}

const getMyPaymentHistory = async(userId : string)=>{

    await prisma.user.findUniqueOrThrow({
        where:{
            id: userId
        }
    });

    const payments = await prisma.payment.findMany({
        where: {
            tenantId: userId
        }
    });


    return payments
    
}

const getPaymentById = async(paymentId: string)=>{
    const payment = await prisma.payment.findUniqueOrThrow({
        where: {id: paymentId},
        include:{
            tenant:{
                select:{ name: true, email: true }
            },
            landlord:{
                select:{ name:true, email: true }
            },
            rentalRequest:{
                select:{
                    property:{
                        select:{title:true, location: true, rent: true}
                    }
                }
            }
        }
    });

    return payment
}

export const paymentService = {
    createPayment,
    confirmPayment,
    getMyPaymentHistory,
    getPaymentById
}