import express from 'express'
import { register,login } from '../Controllers/AuthController.ts'
import {protectRoute} from "../Middleware/AuthMiddleware"
import {toNodeHandler} from "better-auth/node"
import { auth } from '../lib/Auth.ts'

const router = express.Router()

// router.all('/api/auth/{*any}', toNodeHandler(auth));




// const response = await auth.api.signInEmail({
//     body: {
//         email,
//         password
//     },
//     asResponse: true // returns a response object instead of data
// });

// router.post('/Register',register)

// router.post('/Login',login)



export default router