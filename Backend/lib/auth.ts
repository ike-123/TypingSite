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
                switch (event.type) {
                    case "checkout.session.completed":




                        const session = event.data.object;
                        const metadata = event.data.object.metadata;

                        if (!metadata) {
                            return
                        }

                        // we can check metadata to see if this item is a Key package
                        // or something else (clothing merchandise for example)


                        
                        try {
                            await prisma.purchases.create({
                                data: {
                                    userId: metadata.userId,
                                    stripeSessionId: session.id,
                                    type: PurchaseType.keys,
                                    itemName: metadata.itemName,
                                    pricePaid: Number(metadata.pricePaid),
                                    currency: metadata.currency,
                                    keyPackageId: metadata.keyPackageId,
                                    keysGranted:Number(metadata.keyAmount)
                                    
                                }
                            })

                            //handle fulfilment

                            //add the keys to the users account

                            //make sure you ensure the status is paid and that you check the async checkout.session.complete event


                            await prisma.user.update({
                                where:{ id:metadata.userId },
                                data:{
                                    Keys:{
                                        increment:Number(metadata.keysAmount)
                                    }
                                }

                            })
                        } catch (error:any) {

                            if (error.code === "P2002") {
                                console.log("This sesionID already exists")
                                return;
                            }

                            throw error;

                        }


                        //Save Purchase to database




                        //make sure function is safe to run multiple times
                        //Save transaction to database
                        //Fulfill keys
                        break;

                    default:
                        break;
                }
            }
        })
    ]
});