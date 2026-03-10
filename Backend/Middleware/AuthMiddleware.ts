import jwt from "jsonwebtoken"
import { Prisma } from "../generated/prisma/client"
import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/Auth";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}


export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {

    // const token = req.cookies?.Access_Token

    // if (!token) {
    //     return res.status(401).json({ message: "Unauthorised, no Token provided" })
    // }

    // try {

    //     const decodedToken = jwt.verify(token, process.env.JWT_Secret)

    //     if (!decodedToken) {
    //         return res.status(401).json({ message: "Unauthorised, Invalid Token" })
    //     }

    //     const User = prisma.user.findUnique({where: {id:decodedToken.id}})

    //     if(!User){
    //         return res.status(401).json({ message: "Unauthorised, User doesn't exist" })
    //     }

    //     req.user = User;
    //     next();

    // } catch (error) {
    //         return res.status(401).json({ message: "Unauthorised, Token failed" })

    // }



    try {
        const session = await auth.api.getSession({
            headers: req.headers as any
        });

        if (!session) {
            console.log("hello no session found")
            return res.status(401).json({ error: "Not logged in" });
        }


        req.user = session.user;
        next();

    } catch (error) {
        res.status(500).json({ error: "Authentication failed" });
    }




    console.log("Middleware reached");
}