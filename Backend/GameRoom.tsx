import { Server } from "socket.io";
import { Socket } from "socket.io";
import wordsList from "../src/words.json" with { type: "json" };


type PlayerState = {
    progressIndex: number;
    wpm: number;
    finished: boolean;
    finishtime:string;
}

type WordDoneData = {
    nextIndex: number;
    elapsedMs: number;
    totalChars: number;
}

export class GameRoom {

    io: Server;
    roomId: string;
    players: Map<string | undefined,PlayerState>;
    status: string;
    words: string[];
    startAt: number | null;
    countdownTimer: number;


    
    constructor(io:Server, roomId:string){

        this.io = io;
        this.roomId = roomId;
        this.players = new Map();
        this.status = "waiting";
        this.words = [];
        this.startAt = null;
        this.countdownTimer = 10;
        this.words = this.getRandomWords(10);

    }


    addPlayer(socket: Socket):void {

        //add socket(client) to room
        socket.join(this.roomId);

        //Add newly joined player to the array of players
        this.players.set(socket.id,{progressIndex:0,wpm:0,finished:false,finishtime:""})

        this.io.to(this.roomId).emit("setWords",{"words":this.words});

        // send the updated array of players back to all the clients in room
        this.io.to(this.roomId).emit("state",Array.from(this.players.entries()).map(([id,val]) =>({id,...val})));

        //send status of game to clients in room
        this.io.to(this.roomId).emit("status",this.status);


        if(this.players.size >= 2 && this.status === "waiting"){

            //generate random words
            // this.words = this.getRandomWords(10)
            
            //set status to countdown and send to clients in room
            this.status = "countdown"
            this.io.to(this.roomId).emit("status",this.status)
    

            let countdown = 7;
    
            const interval = setInterval(() => {
                this.io.to(this.roomId).emit("countdown",countdown)
                countdown--;
    
                if(countdown <= 0){
                    clearInterval(interval)
                    this.status = "running"
                    this.startAt = Date.now() + 500
    
                    this.io.to(this.roomId).emit("start",{"words":this.words,"startAt":this.startAt});
                    this.io.to(this.roomId).emit("state", Array.from(this.players.entries()).map(([id, val]) => ({ id, ...val })));
                    this.io.to(this.roomId).emit("status",this.status)
    
    
                }
    
            }, 1000);
        }
    }

    HandleDisconnect(socket: Socket):void {

        this.players.delete(socket.id);

        if(this.status === "countdown"){

            if(this.players.size === 1){

                this.status = "waiting"
            }
        }

        this.io.to(this.roomId).emit("state", Array.from(this.players.entries()).map(([id, val]) => ({ id, ...val })));
        this.io.to(this.roomId).emit("status",this.status)
      
    }

    HandleWordDone(socket:Socket, data:WordDoneData ){
    
        const TargetPlayer = this.players.get(socket.id);

        if(!TargetPlayer || this.status != "running")return;


        //if player has finished
        if(data.nextIndex === TargetPlayer.progressIndex + 1){

            TargetPlayer.progressIndex = data.nextIndex;
            TargetPlayer.wpm =  Math.round((data.totalChars / 5) / (data.elapsedMs / 60000));

            if(TargetPlayer.progressIndex === this.words.length){

                TargetPlayer.finished = true;
                TargetPlayer.finishtime = this.ConvertMillisecondsToMinutesAndSeconds(data.elapsedMs);
            }
        }

        this.io.to(this.roomId).emit("state", Array.from(this.players.entries()).map(([id, val]) => ({ id, ...val })));

    }

    getRandomWords(amount:number){
        const randomArray = [...wordsList].sort(() => 0.5-Math.random());
        return randomArray.slice(0,amount)
    }

    ConvertMillisecondsToMinutesAndSeconds(milliseconds:number):string{
    
        const totalSeconds = Math.floor(milliseconds / 1000)
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const paddedSeconds = String(seconds).padStart(2,'0');

        const totaltime = `${minutes}:${paddedSeconds}`;

        return totaltime;

    }
}
