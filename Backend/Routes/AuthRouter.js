import express from 'express'

const router = express.Router()


router.get('/',(req,res)=>{
    console.log("This is the Auth Router")
})
export default router