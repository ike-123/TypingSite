import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// import { PrismaClient } from "@prisma/client";
import { prisma } from "./prisma"

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

import { stripe } from "@better-auth/stripe"
import Stripe from "stripe"
import { PurchaseType } from "@prisma/client";


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

                        FulfillCheckout_Keys(session);

                        break;

                    case "checkout.session.async_payment_succeeded":

                        FulfillCheckout_Keys(session);

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

    if (!metadata) {


        //This is confusing because we want to send an error but we don't want to strip to retry
        // as this the metadata won't magically appear
        return;
    }

    try {

        //Ensure the status is paid and that you check the async checkout.session.complete event
        //I think we should check if payment is unpaid first before creating a purchase object because If the purchase later fails in the async event
        //we will have a purchase item in the database that corresponds to a failed failed payment


        if (session.payment_status !== "unpaid") {

            await prisma.purchases.create({
                data: {
                    userId: metadata.userId,
                    stripeSessionId: session.id,
                    type: PurchaseType.keys,
                    itemName: metadata.itemName,
                    pricePaid: Number(metadata.pricePaid),
                    currency: metadata.currency,
                    keyPackageId: metadata.keyPackageId,
                    keysGranted: Number(metadata.keyAmount)
                }
            })

            //handle fulfilment logic

            //add the keys to the users account

            await prisma.user.update({
                where: { id: metadata.userId },
                data: {
                    Keys: {
                        increment: Number(metadata.keysAmount)
                    }
                }

            })
        }
        //Better Auth will send a 200 web response after as we don't want to retry

        // return;
        //Apparently Better auth should automatically send a status code of 200 back to stripe??

    } catch (error: any) {

        if (error.code === "P2002") {
            console.log("This sesionID already exists")
            //return nothing which will return a 200 response back to stripe which will tell stripe 
            //we have acknowledged and we don't need you to resend this event again.
            return;
        }

        throw error;

    }

    //Save Purchase to database


    //make sure function is safe to run multiple times
    //Save transaction to database
    //Fulfill keys
}