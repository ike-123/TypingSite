import express from "express"
import AuthRouter from "./Routes/AuthRouter"

const app = express()

const port = 3001

app.use('/api',AuthRouter)
app.listen(port,()=>{

    console.log("Server Started on Port: ", port)

})