
import { error } from "console";
import { prisma } from "../lib/prisma.ts"
import bcrypt, { hash } from 'bcrypt'
// import jwt from "jsonwebtoken"
import jwt from "jsonwebtoken"
import { env } from "process";
import { request, Request, Response } from "express";
import { registerSchema, loginSchema } from "../validators/loginvalidator.ts";
import { boolean, object } from "zod";
import * as z from "zod";




const register = async (req: Request, res: Response) => {

    console.log(req.body.username);
    console.log(req.body.password)
    const { username, email, password } = req.body;

    //Search for a user with the username or email

    const userExists = await prisma.user.findUnique({ where: { email: email } })

    if (userExists) {
        return res.status(400).json({ error: "Email already exists" })
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await prisma.user.create({
        data: {
            username, email, passwordHash: hashedPassword,
        },
    });

    res.status(201).json({
        status: "success",
        user: {
            id: user.id,
            username,
            email
        }
    })


    //IF user found check to see if password is correct

    //If none exists we return  message saying user already exists 
}




const login = async (req: Request, res: Response) => {

    console.log("hey");

    const result = loginSchema.safeParse(req.body)

    if (!result.success) {


        console.log("wrong");

        // const formatted = result.error?.format();
        // const flatErrors = Object.values(formatted).flat().filter(Boolean).map((err)=>err._errors).flat();

        // console.log(flatErrors);

        return res.status(400).json({ errors: z.treeifyError(result.error) });
    }

    const { email, password } = result.data;

    //Check if user email exists
    const user = await prisma.user.findUnique({ where: { email: email } })

    if (!user) {
        return res.status(401).json({ error: "Invalid Email or Password" })
    }
    else {
        console.log("user exists");
        //what is the difference between compare and comparesync
        const PasswordCorrect = await bcrypt.compare(password, user.passwordHash);

        if (PasswordCorrect) {
            //Generate webtoken


            const payload = { id: user.id }
            const token = jwt.sign(payload, process.env.JWT_Secret, { expiresIn: process.env.JWT_Expires_In });

            res.cookie("Access_Token", token,
                {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 60000 * 15,

                }).status(200).json()

        }
        else {

            return res.status(400).json({ message: "Email or Password is incorrect" })

        }
    }
}




const logout = async (req: Request, res: Response) => {

    const { username, email, password } = req.body;

    //Get the user and update the refresh Token (set it to null I think)

    //Clear Access and Refresh Token cookies

    res.clearCookie("Access_Token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60000 * 15,
    }).status(200).json("user logged out");

}



export { register, login }