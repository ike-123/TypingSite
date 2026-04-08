import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// import { PrismaClient } from "@prisma/client";
import { prisma } from "./prisma"

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

import { stripe } from "@better-auth/stripe"
import Stripe from "stripe"
import { KeyTransactionType, PurchaseType } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";


const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover", // Latest API version as of Stripe SDK v20.0.0
})

// const connectionString = `${process.env.DATABASE_URL}`;
// const adapter = new PrismaPg({ connectionString });

// const prisma = new PrismaClient({ adapter })




export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: ["http://localhost:5173"],
    baseURL: process.env.BETTER_AUTH_URL,
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string

        }
    },
    plugins: [
        stripe({
            stripeClient,
            stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
            createCustomerOnSignUp: true,
            onEvent: async (event) => {

                const session = event.data.object as Stripe.Checkout.Session;


                switch (event.type) {
                    case "checkout.session.completed":

                        // we can check metadata to see if this item is a Key package
                        // or something else (clothing merchandise for example)

                        await FulfillCheckout_Keys(session);

                        break;

                    case "checkout.session.async_payment_succeeded":

                        await FulfillCheckout_Keys(session);

                        break;

                    case "checkout.session.async_payment_failed":
                        //Send email or notification that payment has failed

                        break
                }
            }
        })
    ]
});


async function FulfillCheckout_Keys(session: any) {

    //ensure that we don't already have a purchase with the same StripeSessionId
    //StripeSessionId is a unique value and so an error will occur if we create another item with the same Id

    const metadata = session.metadata;

    if (!metadata.userId || !metadata.keyPackageId) {


        //This is confusing because we want to send an error but we don't want to strip to retry
        // as this the metadata won't magically appear
        console.error("Missing metadata on session:", session.id, metadata);
        return;
    }

    try {

        //Ensure the status is paid and that you check the async checkout.session.complete event
        //I think we should check if payment is unpaid first before creating a purchase object because If the purchase later fails in the async event
        //we will have a purchase item in the database that corresponds to a failed failed payment

        console.log("session amount_subtotal = ", session.amount_subtotal);
        console.log("session amount_total = ", session.amount_total);


        if (session.payment_status === "paid") {



            const pack = await prisma.keyPackage.findUnique({
                where: { id: metadata.keyPackageId }
            })

            if (!pack) {

                throw new Error("Invalid package");
            }

            await prisma.$transaction(async (tx) => {

                const payment = await tx.payment.create({
                    data: {
                        userId: metadata.userId,
                        stripeSessionId: session.id,
                        type: PurchaseType.keys,
                        itemName: pack.name,
                        pricePaid: session.amount_total,//maybe find the price from the session //AMOUNT TOTAL
                        currency: session.currency, //USE SESSION.CURRENCY
                        keyPackageId: pack.id,
                    }
                })


                //handle fulfilment logic

                //add the keys to the users account
                const user = await tx.user.update({
                    where: { id: metadata.userId },
                    data: {
                        Keys: {
                            increment: pack.keysAmount
                        }
                    }

                })


                //create a key transaction 
                await tx.keyTransactions.create({
                    data: {
                        userId: metadata.userId,
                        type: KeyTransactionType.earn,
                        keyamount: pack.keysAmount,
                        paymentId: payment.id,
                        newKeyAmount: user.Keys
                    }
                })


                //If any fails, Prisma rolls back all the previous database actions

                //3 scenarios

                //duplicate payment (stripeSessionId) then P2002 error will run and we acknowlege the request preventing retrires
                //Payment is succesfful then we send a 200 response showing we have acknowldged the request
                //Prisma transaction fails for some other reason. (Database is down) we throw an error which will make webhook retry later

            })




        }
        //Better Auth will send a 200 web response after as we don't want to retry

        // return;
        //Apparently Better auth should automatically send a status code of 200 back to stripe??

    } catch (error: any) {

        if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
            console.log("This sesionID already exists")
            //return nothing which will return a 200 response back to stripe which will tell stripe 
            //we have acknowledged and we don't need you to resend this event again.
            return;
        }

        // Unexpected error — rethrow so Stripe retries the webhook
        throw error;

    }

    //Save Purchase to database


    //make sure function is safe to run multiple times
    //Save transaction to database
    //Fulfill keys
}