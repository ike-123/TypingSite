import express from 'express'
import { register } from '../Controllers/AuthController'
const router = express.Router()


router.post('/Register', register)

router.get('/Login', (req,res)={
    
})
export default router