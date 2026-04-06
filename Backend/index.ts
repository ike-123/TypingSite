import AuthRouter from "./Routes/AuthRouter";
import cors from 'cors';
// import * as cors from 'cors';

// import { server } from "./socket.ts";
// import { app } from "./socket.ts";

import { Server } from "socket.io";
import * as http from "http";

import "dotenv/config";


import { toNodeHandler } from "better-auth/node"
import { auth } from './lib/Auth.ts'
import { NextFunction } from "express";
import { protectRoute } from "./Middleware/AuthMiddleware.ts";
import { prisma } from "./lib/prisma.ts"
import { config, length, string } from "zod";
import { setupSockets } from "./socket.ts";

/////
import express from "express";
import cookieParser from "cookie-parser"

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)



const app = express()

app.all('/api/auth/{*any}', toNodeHandler(auth));


app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))


/////


app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    // origin: "*",
    credentials: true
}));


const server = http.createServer(app);

const io = setupSockets(server);


const port = 3001

const keyPackages: any = {
    keys_500: { keys: 500, price: 350 },
    keys_1200: { keys: 500, price: 700 },
}

// app.use('/api/Auth',AuthRouter)

//  async function requireAuth(req: Request, res:Response, next:NextFunction) {
//   const session = await auth.api.getSession({
//     headers: req.headers
//   });

//   if (!session) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }

//   req.user = session.user;
//   next();
// }



app.post("/api/create-checkout-session", protectRoute, async (req, res) => {

    const { packageId } = req.body;

    
    console.log("create session reached")

    // const pack = keyPackages[packageId]

    const pack = await prisma.keyPackage.findUnique({
        where: { id: packageId }
    }
    )

    if (!pack) {
        return res.status(404).json({ error: "Key Package not found" })
    }


    // if (!pack) {
    //     return console.log("no pack");
    //     res.status(400).send("Invalid package");

    // }

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: "gbp",
                    product_data: {
                        name: pack.name
                    },
                    unit_amount: pack.price
                },
                quantity: 1,
            }
        ],
        success_url: "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "http://localhost:5173/cancel",

        metadata: {
            userId: req.user.id,
            itemName: pack.name,
            pricePaid: pack.price,
            currency: "gbp",
            keyPackageId: packageId,
            keysAmount: pack.keysAmount,
        }


        //make sure fulfillment happens when client loads the success page because webhooks can take a while.
        //still ensure duplicate fulfillment isn't possible
    })

    res.json({ url: session.url })

});

app.post("/api/BuyShopItem",protectRoute,async (req,res) =>{

    //get userid 
    //get id of shopitem

    //If user already owns the shopitem then return don't proceed and send a badrequest to the user

    //Check to see if the Users current key amount - shop items key price is greater than 0. If not don't proceed

    //Subtract they the shopitems key price from the user account
    //Add the shop item into the users inventory
    //Create a new shop transaction and save it in the database

    //


    
})


app.get("/api/order", protectRoute, async (req, res) => {


    //WHEN USING FUNCTION TO ALSO FULFILL ORDER MAKE SURE IT IS CHANGED TO A POST REQUEST

    const sessionId = req.query.session_id;

    //make sure sessionId belongs to the user

    if (typeof sessionId !== "string") {

        //Refactor res.status response to use correct code and message type

        return res.status(404).json("Invalid Session")
    }

    const purchase = await prisma.purchases.findUnique({
        where: { stripeSessionId: sessionId }
    })

    if (!purchase) {
        return res.status(404).json("Order doesn't exist")
    }

    if (purchase.userId != req.user.id) {
        return res.status(403).send("Forbidden");
    }

    res.json({
        productName: purchase.itemName,
        productPrice: purchase.pricePaid
    })


})

app.get("/api/profile", protectRoute, (req, res) => {
    res.json(req.user);
});

app.post("/api/testresult", protectRoute, async (req, res) => {


    try {
        const userId = req.user.id;
        // const configs = req.query.configs as string[]

        // console.log(req.query);


        const {
            wpm,
            accuracy,
            correctChars,
            incorrectChars,
            duration,
            mode,
            LengthDurationSetting,
            configs

        } = req.body;


        let NormalizedConfigKey = null;


        if (Array.isArray(configs)) {

            let FilteredConfigs = configs.filter(item => item !== "error")
            NormalizedConfigKey = FilteredConfigs.sort().join("_")
        }




        console.log("wpm " + wpm);
        console.log("Acc " + accuracy);
        console.log("corr " + correctChars);
        console.log("inco " + incorrectChars);
        console.log("dur " + duration);
        console.log("mode " + mode);
        console.log("lengthDur " + LengthDurationSetting);
        console.log("ConfigKey " + NormalizedConfigKey)





        const testresult = await prisma.typingTest.create({
            data: {
                userId,
                wpm,
                accuracy,
                correctChars,
                incorrectChars,
                duration,
                mode,
                lengthDurationSetting: LengthDurationSetting,
                configKey: NormalizedConfigKey
            }
        })

        res.json(testresult);


    } catch (error) {

        res.status(500).json({ error: "Failed to save test" });

    }
});


// app.get("/api/averagestats", protectRoute, async (req, res) => {


//     try {

//         // console.log(req.query.last);

//         //array of strings
//         console.log(req.query.configs);

//         const mode = String(req.query.mode);
//         const lengthDurationSetting = String(req.query.LengthDurationSetting);

//         const configs = req.query.configs


//         let NormalizedConfigKey = null;

//         if (Array.isArray(configs)) {

//             let FilteredConfigs = configs.filter(item => item !== "error")
//             NormalizedConfigKey = FilteredConfigs.sort().join("_")
//         }

//         // const NormalizedConfigKey = configs ? configs.sort().join("_") : null;

//         console.log(NormalizedConfigKey);

//         const last = Number(req.query.last) || 20;

//         //Should I make sure last is a number before using 

//         const userid = req.user.id;
//         const tests = await prisma.typingTest.findMany({
//             where: { userId: userid, mode, lengthDurationSetting, configKey: NormalizedConfigKey },
//             orderBy: { createdAt: "desc" },
//             take: last,
//             select: { wpm: true, accuracy: true }
//         })

//         if (tests.length === 0) {

//             console.log("nothing found");
//             return res.status(404).json({ error: "No data found" })

//         }

//         const averageWPM = tests.reduce((sum, t) => sum + t.wpm, 0) / tests.length;
//         const averageAccuracy = tests.reduce((sum, t) => sum + t.accuracy, 0) / tests.length;

//         const data = {
//             averageWPM,
//             averageAccuracy
//         }
//         res.json(data);

//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ error: "Failed to retrieve averagestats" })
//     }

// });

app.get("/api/averagestats", protectRoute, async (req, res) => {


    try {

        // console.log(req.query.last);

        //array of strings
        console.log(req.query.configs);

        const mode = String(req.query.mode);
        const lengthDurationSetting = String(req.query.LengthDurationSetting);

        let configs = req.query.configs

        if (!configs) {
            configs = [];
        } else if (!Array.isArray(configs)) {
            configs = [configs];
        }

        let NormalizedConfigKey = null;

        if (Array.isArray(configs)) {

            console.log("is array")
            let FilteredConfigs = configs.filter(item => item !== "error")

            if (FilteredConfigs.length > 0) {
                NormalizedConfigKey = FilteredConfigs.sort().join("_")
            }
        }

        // const NormalizedConfigKey = configs ? configs.sort().join("_") : null;

        // console.log(NormalizedConfigKey);

        const valid_Last = Number.isFinite(Number(req.query.last)) && Number(req.query.last) > 0

        console.log("hey");
        console.log(Number(req.query.last));
        console.log(valid_Last);
        console.log("config key = ", NormalizedConfigKey);

        //Should I make sure last is a number before using 

        const userid = req.user.id;
        const tests = await prisma.typingTest.findMany({
            where: { userId: userid, mode, lengthDurationSetting, configKey: NormalizedConfigKey },
            orderBy: { createdAt: "desc" },
            ...(valid_Last ? { take: Number(req.query.last) } : {}),
            select: { wpm: true, accuracy: true }
        })
        console.log(`found ${tests.length} tests`)

        if (tests.length === 0) {

            console.log("nothing found");
            return res.status(404).json({ error: "No data found" })

        }

        const averageWPM = tests.reduce((sum, t) => sum + t.wpm, 0) / tests.length;
        const averageAccuracy = tests.reduce((sum, t) => sum + t.accuracy, 0) / tests.length;

        const data = {
            averageWPM,
            averageAccuracy
        }
        res.json(data);

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to retrieve averagestats" })
    }

});

app.get("/api/PBandHistory", protectRoute, async (req, res) => {


    try {

        const mode = String(req.query.mode);
        const lengthDurationSetting = String(req.query.LengthDurationSetting);

        let configs = req.query.configs

        if (!configs) {
            configs = [];
        } else if (!Array.isArray(configs)) {
            configs = [configs];
        }


        let NormalizedConfigKey = null;

        if (Array.isArray(configs)) {

            console.log("is array")
            let FilteredConfigs = configs.filter(item => item !== "error")

            if (FilteredConfigs.length > 0) {
                NormalizedConfigKey = FilteredConfigs.sort().join("_")
            }
        }

        // const last = Number(req.query.last) || 20;

        const userid = req.user.id;

        //Get the best wpm score 

        //Get all the test results 


        const [PersonalBest, tests] = await Promise.all([

            prisma.typingTest.aggregate({
                where: { userId: userid, mode, lengthDurationSetting, configKey: NormalizedConfigKey },
                _max: { wpm: true },
            }),

            prisma.typingTest.findMany({
                where: { userId: userid, mode, lengthDurationSetting, configKey: NormalizedConfigKey },
                orderBy: { createdAt: "asc" },
                select: { wpm: true, accuracy: true, mode: true, lengthDurationSetting: true, configKey: true, createdAt: true }
            })

        ])


        if (tests.length === 0) {

            console.log("nothing found");
            return res.status(404).json({ error: "No data found" })

        }

        // const averageWPM = tests.reduce((sum, t) => sum + t.wpm, 0) / tests.length;
        // const averageAccuracy = tests.reduce((sum, t) => sum + t.accuracy, 0) / tests.length;

        const data = {
            PersonalBest,
            tests
        }

        res.json(data);

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to retrieve averagestats" })
    }

});


app.get("/api/ExtraTestInfo", protectRoute, async (req, res) => {

    try {
        const userid = req.user.id;

        const results = await prisma.typingTest.aggregate({
            where: { userId: userid },
            _count: { id: true },
            _sum: { duration: true }
        })

        const TestsCompleted = results._count.id
        const TotalTimeSpentTyping = results._sum.duration

        const data = {
            TestsCompleted,
            TotalTimeSpentTyping
        }

        res.json(data);

    } catch (error) {

        res.status(500).json({ error: "Failed to retrieve extra test info" })

    }


});



server.listen(port, '0.0.0.0', () => {

    console.log("Server started on Port: ", port)

})

