"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AuthRouter_js_1 = require("./Routes/AuthRouter.js");
// import cors from 'cors';
var cors = require("cors");
var socket_1 = require("./socket");
var socket_2 = require("./socket");
socket_2.app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true
}));
var port = 3001;
socket_2.app.use('/api', AuthRouter_js_1.default);
socket_1.server.listen(port, function () {
    console.log("Server Started on Port: ", port);
});
