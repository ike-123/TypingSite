import AuthRouter from "./Routes/AuthRouter";
import cors from 'cors';
// import * as cors from 'cors';

import {server} from "./socket.ts";
import {app} from "./socket.ts";


import {toNodeHandler} from "better-auth/node"
import { auth } from './lib/Auth.ts'
import { NextFunction } from "express";
import { protectRoute } from "./Middleware/AuthMiddleware.ts";




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


server.listen(port,'0.0.0.0',()=>{

    console.log("Server started on Port: ", port)

})

