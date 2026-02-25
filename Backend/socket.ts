import { Server } from "socket.io";

// import http from "http";
import * as http from "http"; 

import express from "express";
// import * as express from "express";

import { GameRoom } from "./GameRoom.tsx";
import wordsList from "../src/words.json" with { type: "json" };
import cookieParser from "cookie-parser"



const app = express()

app.use(express.json())
app.use(cookieParser())


// app.use(express.urlencoded({extended:true})) I'm not sure if this needs to be false or true




const server = http.createServer(app as http.RequestListener);

const io = new Server(server,{
   cors:{
    origin: "*"
   }
})

type WordDoneData = {
    nextIndex: number;
    elapsedMs: number;
    totalChars: number;
}


let rooms = new Map<string,GameRoom>()
let TotalPlayersInServer = 0;

io.on("connection",(socket)=>{

    console.log(socket.id)
    const GameRoom = FindRoom();

    console.log(rooms.size);

    GameRoom.addPlayer(socket);

    socket.emit("NumberOfPlayers",TotalPlayersInServer);

    socket.on("wordDone",(data:WordDoneData)=>{

        GameRoom.HandleWordDone(socket,data);

    })

    socket.on("disconnect",()=>{
        GameRoom.HandleDisconnect(socket);
    })


})


function FindRoom(){


    for(let [roomid,room] of rooms.entries()){

        if((room.status == "waiting" || room.status == "countdown") && room.players.size < 5){
            return room;
        }
    }
    
    //No rooms have been found so make a new one

    const roomid = `Room_${crypto.randomUUID()}`
    const new_room = new GameRoom(io,roomid);
    rooms.set(roomid,new_room);
    
    return new_room;

    
}

setInterval(CalculateNumberOfPlayers, 3000);

function CalculateNumberOfPlayers(){

    let Total = 0;

    for(let [roomid,room] of rooms.entries()){

        Total += room.players.size;
    }

    if(Total === 0){

        TotalPlayersInServer = 1;
    }
    else{

        TotalPlayersInServer = Total;
    }

    io.emit("NumberOfPlayers",TotalPlayersInServer)

}

export {io,app,server}