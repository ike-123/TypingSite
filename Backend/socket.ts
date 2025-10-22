import { Server } from "socket.io";

// import http from "http";
import * as http from "http"; 

import express from "express";
// import * as express from "express";

import { GameRoom } from "./GameRoom.tsx";
import wordsList from "../src/words.json" with { type: "json" };

const app = express()

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



//GameState

// let players = new Map()
// let status = "waiting"
// let startAt = null;
// let words;

// function getRandomWords(amount){
//     const randomArray = [...wordsList].sort(() => 0.5-Math.random());
//     return randomArray.slice(0,amount)
// }

let rooms = new Map<string,GameRoom>()

io.on("connection",(socket)=>{

    console.log(socket.id)
    const GameRoom = FindRoom();

    console.log(rooms.size);

    GameRoom.addPlayer(socket);

    socket.on("wordDone",(data:WordDoneData)=>{

        GameRoom.HandleWordDone(socket,data);

    })

    socket.on("disconnect",()=>{
        GameRoom.HandleDisconnect(socket);
    })

//     players.set(socket.id,{progressIndex:0,wpm:0,finished:false,finishtime:""})
    

//     io.emit("state", Array.from(players.entries()).map(([id, val]) => ({ id, ...val })));
//     io.emit("status",status)
     
//    console.log("Hey I'M RUNNING")

  
//     if(players.size >= 2 && status === "waiting"){

//         words = getRandomWords(30)
//         status = "countdown"

//         io.emit("status",status)

//         let countdown = 10;

//         const interval = setInterval(() => {
//             io.emit("countdown",countdown)
//             countdown--;

//             if(countdown <= 0){
//                 clearInterval(interval)
//                 status = "running"
//                 startAt = Date.now() + 500

                
//                 io.emit("start",{words,startAt});
//                 io.emit("state", Array.from(players.entries()).map(([id, val]) => ({ id, ...val })));
//                 io.emit("status",status)


//             }

//         }, 1000);
//     }

//     socket.on("wordDone",({ nextIndex, elapsedMs, totalChars })=>{

       
//         socket.join()
//         const TargetPlayer = players.get(socket.id)

//         console.log(nextIndex)

//         if(!TargetPlayer || status != "running") return;

          

//         if(nextIndex === TargetPlayer.progressIndex + 1){

        
//             TargetPlayer.progressIndex = nextIndex;
//             TargetPlayer.wpm =  Math.round((totalChars / 5) / (elapsedMs / 60000));

//             if (TargetPlayer.progressIndex === words.length) {
//                 TargetPlayer.finished = true;
                
//                 const totalSeconds = Math.floor(elapsedMs / 1000)
//                 const minutes = Math.floor(totalSeconds / 60);
//                 const seconds = totalSeconds % 60;

//                 const paddedSeconds = String(seconds).padStart(2,'0')


//                 const totaltime = `${minutes}:${paddedSeconds}`


//                 console.log(totaltime)
//                 TargetPlayer.finishtime = totaltime;
 
//             }

//             io.emit("state", Array.from(players.entries()).map(([id, val]) => ({ id, ...val })));
     

//         }
        
//     })


//     socket.on("disconnect",()=>{

//         console.log("player disconnected")
//         players.delete(socket.id)
       
//         if(players.size === 1){

//             console.log("only 1 player")
//             status = "waiting"
//             io.emit("status",status)
//             io.emit("state", Array.from(players.entries()).map(([id, val]) => ({ id, ...val })));


//         }
//     })
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

export {io,app,server}