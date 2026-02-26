import express from 'express'
import { register,login } from '../Controllers/AuthController.ts'
import {protectRoute} from "../Middleware/AuthMiddleware"

const router = express.Router()


router.post('/Register',register)

router.post('/Login',login)

export default router