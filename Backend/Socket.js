import { Server } from "socket.io";
import http from "http";
import express from "express";
import words from "../src/words.json" assert { type: "json" };

const app = express()

const server = http.createServer(app);

const io = new Server(server,{
   cors:{
    origin: ["http://localhost:5173"]
   }
})



//GameState

let players = new Map()
let status = "waiting"
let startAt = null;

function getRandomWords(amount){
    const randomArray = [...words].sort(() => 0.5-Math.random());
    return randomArray.slice(0,amount)
}

io.on("connection",(socket)=>{

     const player = players.set(socket.id,{progressIndex:0,wpm:0,finished:"false"})
    

     
    
     
  //  console.log(player.get(socket.id))

    if(players.size >= 2 && status === "waiting"){

       let words = getRandomWords(30)
        
        //const words = getrandomwords
        status = "countdown"
        let countdown = 3;

        const interval = setInterval(() => {
            io.emit("countdown",countdown)
            countdown--;

            if(countdown <= 0){
                clearInterval(interval)
                status = "running"
                startAt = Date.now() + 500

                io.emit("start",{words,startAt});
                io.emit("state", Array.from(players.entries()).map(([id, val]) => ({ id, ...val })));

            }

        }, 1000);
    }

    socket.on("wordDone",({ nextIndex, elapsedMs, totalChars })=>{

       

        const TargetPlayer = players.get(socket.id)

        console.log(nextIndex)

        if(!TargetPlayer || status != "running") return;

          


        if(nextIndex === TargetPlayer.progressIndex + 1){
            TargetPlayer.progressIndex = nextIndex;
            TargetPlayer.wpm =  Math.round((totalChars / 5) / (elapsedMs / 60000));

            if (TargetPlayer.progressIndex === words.length) {
                TargetPlayer.finished = true;
            }

            //console.log(Array.from(players.entries()).map(([id, val]) => ({ id, ...val })))
            io.emit("state", Array.from(players.entries()).map(([id, val]) => ({ id, ...val })));
         
            //io.emit("state", "receive" );

        }
        
    })


    socket.on("disconnect",()=>{

        players.delete(socket.id)
        if (players.size === 0) {
           // resetGame();
        }
    })
})


function createRoom(){

}

export {io,app,server}