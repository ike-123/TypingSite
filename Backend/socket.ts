import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";

// import http from "http";
// import * as http from "http"; 

import express from "express";
// import * as express from "express";

import { GameRoom } from "./GameRoom.ts";
import wordsList from "../src/words.json" with { type: "json" };
import cookieParser from "cookie-parser"
import { map } from "zod";



// const app = express()

// app.use(express.json())
// app.use(cookieParser())
// app.use(express.urlencoded({extended:true}))


// app.use(express.urlencoded({extended:true})) I'm not sure if this needs to be false or true

type WordDoneData = {
    nextIndex: number;
    elapsedMs: number;
    totalChars: number;
}



export function setupSockets(server: HttpServer) {

    const io = new Server(server, {
        cors: {
            origin: "*"
        }
    })

    let rooms = new Map<string, GameRoom>()

    //IN the future instead of just storing a socket as the value for players you could store an object storing both socket and roomid
    //This could mean if you want to make sure a player rejoins the same room even after refreshing you could easily find their roomid
    let players = new Map<string, Socket>()

    let TotalPlayersInServer = 0;


    io.on("connection", (socket) => {

        console.log(socket.id)

        const playerID = socket.handshake.auth.playerID;

        console.log(playerID)

        //Player should always have an ID whether logged in or not so this shouldn't really be called
        if (!playerID) {
            socket.disconnect();
            console.log("No Player Id provided")
            return;
        }

        //If player already exists kick the old socket
        const ExistingSocket = players.get(playerID);

        if (ExistingSocket) {

            console.log("existing player exists disconnect previous");
            //Let user know that they were logged out
            ExistingSocket.emit("force_disconnect", {
                reason: "You were disconnected because you logged in on another tab."
            }); 
            ExistingSocket.disconnect(true);
        }

        players.set(playerID, socket);


        const GameRoom = FindRoom();

        // console.log(rooms.size);

        GameRoom.addPlayer(socket);

        socket.emit("NumberOfPlayers", TotalPlayersInServer);

        socket.on("wordDone", (data: WordDoneData) => {

            GameRoom.HandleWordDone(socket, data);

        })

        socket.on("disconnect", () => {

            //Only delete if the socket disconnecting is still the current socket stored in the map
            if (players.get(playerID) === socket) {
                players.delete(playerID);

            }
            GameRoom.HandleDisconnect(socket);
        })


    })


    function FindRoom() {


        for (let [roomid, room] of rooms.entries()) {

            if ((room.status == "waiting" || room.status == "countdown") && room.players.size < 5) {
                return room;
            }
        }

        //No rooms have been found so make a new one

        const roomid = `Room_${crypto.randomUUID()}`
        const new_room = new GameRoom(io, roomid);
        rooms.set(roomid, new_room);

        return new_room;


    }

    setInterval(CalculateNumberOfPlayers, 3000);

    function CalculateNumberOfPlayers() {

        let Total = 0;

        for (let [roomid, room] of rooms.entries()) {

            Total += room.players.size;
        }

        if (Total === 0) {

            TotalPlayersInServer = 1;
        }
        else {

            TotalPlayersInServer = Total;
        }

        io.emit("NumberOfPlayers", TotalPlayersInServer)

    }

}



// export { io, app, server }