import AuthRouter from "./Routes/AuthRouter";
import cors from 'cors';
// import * as cors from 'cors';

import {server} from "./socket.ts";
import {app} from "./socket.ts";


app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    // origin: "*",
    credentials: true
}));


const port = 3001

app.use('/api/Auth',AuthRouter)

server.listen(port,'0.0.0.0',()=>{

    console.log("Server started on Port: ", port)

})

