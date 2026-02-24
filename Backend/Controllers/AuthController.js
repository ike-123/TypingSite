
import { error } from "console";
import { prisma } from "../lib/prisma"
import bcrypt, { hash } from 'bcrypt'


const register = async (req, res) => {

    const { username, email, password } = req.body;

    //Search for a user with the username or email

    const userExists = await prisma.user.findUnique({ where: { email: email } })

    if (userExists) {
        return res.status(400).json({ error: "Email already exists" })
    }


    const salt = bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await prisma.user.create({
        data: {
            username, email, password: hashedPassword,
        },
    });

    res.status(201).json({
        status: "success",
        user: {
            id:user.id,
            username,
            email
        }
    })


    //IF user found check to see if password is correct

    //If none exists we return  message saying user already exists 
}

export { register }