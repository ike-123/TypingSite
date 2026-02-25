import express from 'express'
import { register } from '../Controllers/AuthController'
import { protectRoute } from '../Middleware/AuthMiddleware'
const router = express.Router()


router.post('/Register',register)

router.get('/Login',protectRoute,LogIn)
export default router