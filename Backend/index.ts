import AuthRouter from "./Routes/AuthRouter";
import cors from 'cors';
// import * as cors from 'cors';

import { server } from "./socket.ts";
import { app } from "./socket.ts";


import { toNodeHandler } from "better-auth/node"
import { auth } from './lib/Auth.ts'
import { NextFunction } from "express";
import { protectRoute } from "./Middleware/AuthMiddleware.ts";
import { prisma } from "./lib/prisma.ts"



app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    // origin: "*",
    credentials: true
}));


const port = 3001

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

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.get("/api/profile", protectRoute, (req, res) => {
    res.json(req.user);
});

app.post("/api/testresult", protectRoute, async (req, res) => {

    try {
        const userId = req.user.id;

        const {
            wpm,
            accuracy,
            correctChars,
            incorrectChars,
            duration,
            config
        } = req.body;

        console.log("wpm " + wpm);
        console.log("Acc " + accuracy);
        console.log("corr " + correctChars);
        console.log("inco " + incorrectChars);
        console.log("dur " + duration);
        console.log("config " + config);



        const testresult = await prisma.typingTest.create({
            data: {
                userId,
                wpm,
                accuracy,
                correctChars,
                incorrectChars,
                duration,
                config
            }
        })

        res.json(testresult);


    } catch (error) {

        res.status(500).json({ error: "Failed to save test" });

    }
});


app.get("/api/averagestats", protectRoute, async (req, res) => {

    try {

        const userid = req.user.id;
        const tests = await prisma.typingTest.findMany({
            where: { userId: userid },
            orderBy: { createdAt: "desc" },
            take: 20,
            select: { wpm: true, accuracy: true }
        })

        if (tests.length === 0) {

            return
        }

        const averageWPM = tests.reduce((sum, t) => sum + t.wpm, 0) / tests.length;
        const averageAccuracy = tests.reduce((sum, t) => sum + t.accuracy, 0) / tests.length;

        const data = {
            averageWPM,
            averageAccuracy
        }
        res.json(data);

    } catch (error) {
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

