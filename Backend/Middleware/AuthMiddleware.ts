import jwt from "jsonwebtoken"
import { Prisma } from "../generated/prisma/client"
import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}


export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.cookies?.Access_Token

    if (!token) {
        return res.status(401).json({ message: "Unauthorised, no Token provided" })
    }

    try {

        const decodedToken = jwt.verify(token, process.env.JWT_Secret)

        if (!decodedToken) {
            return res.status(401).json({ message: "Unauthorised, Invalid Token" })
        }

        const User = prisma.user.findUnique({where: {id:decodedToken.id}})

        if(!User){
            return res.status(401).json({ message: "Unauthorised, User doesn't exist" })
        }

        req.user = User;
        next();

    } catch (error) {
            return res.status(401).json({ message: "Unauthorised, Token failed" })

    }


    console.log("Middleware reached");
}