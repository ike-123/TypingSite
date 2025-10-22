import AuthRouter from "./Routes/AuthRouter.js";
import cors from 'cors';
// import * as cors from 'cors';

import {server} from "./socket";
import {app} from "./socket";


app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true
}));


const port = 3001

app.use('/api',AuthRouter)

server.listen(port,()=>{

    console.log("Server Started on Port: ", port)

})

