import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// import { PrismaClient } from "@prisma/client";
import { prisma } from "./prisma"

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

import { stripe } from "@better-auth/stripe"
import Stripe from "stripe"


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
            onEvent: async (event) =>{
                switch (event.type) {
                    case "checkout.session.completed":
                        const session = event.data.object;
                        console.log(event.data);
                        console.log("------------------------");
                        console.log(session);
                        break;
                
                    default:
                        break;
                }
            }
        })
    ]
});