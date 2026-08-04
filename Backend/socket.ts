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
import { auth } from "./lib/Auth.ts";
import { GetEquippedAvatar } from "./avatarService.ts";
import { DEFAULT_AVATAR } from "./avatarService.ts";
import { fromNodeHeaders } from "better-auth/node";


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

type PlayerData = {
    Socket: Socket;
    DisplayName: string
}

type AccuracyData = {
    accuracy: number;
}



export function setupSockets(server: HttpServer) {

    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    })

    let rooms = new Map<string, GameRoom>()

    //IN the future instead of just storing a socket as the value for players you could store an object storing both socket and roomid
    //This could mean if you want to make sure a player rejoins the same room even after refreshing you could easily find their roomid
    let players = new Map<string, PlayerData>()

    let TotalPlayersInServer = 0;

    io.use(async (socket, next) => {

        console.log("raw cookie header:", socket.handshake.headers.cookie);
        console.log("middleware reached2")
        try {
            const session = await auth.api.getSession({
                headers: fromNodeHeaders(socket.handshake.headers),
            });

            if (session?.user) {
                // return next(new Error("Unauthorized"));

                // Attach server-verified identity to the socket
                socket.data.playerID = session.user.id;
                socket.data.isGuest = false;
                console.log("exist")
            }

            else {

                console.log("doesn't exist")

                const clientProvidedID = socket.handshake.auth.playerID

                if (!clientProvidedID) {
                    console.log("nothing provided")
                    return next(new Error("No guest ID provided"));
                }

                console.log(`guest_${clientProvidedID}`)

                socket.data.playerID = `guest_${clientProvidedID}`;
                socket.data.isGuest = true;

            }

            const rawName = socket.handshake.auth.DisplayName
            const sanitizedName = String(rawName).slice(0, 20).trim();
            socket.data.DisplayName = sanitizedName

            next();

        } catch (err) {
            console.error("Auth middleware error:", err);
            next(new Error("Authentication failed"));
        }
    });


    io.on("connection", (socket) => {

        console.log("testing")
        console.log(socket.id)

        const playerID = socket.data.playerID;
        const DisplayName = socket.data.DisplayName;
        const isGuest = socket.data.isGuest;


        console.log(DisplayName);
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
            ExistingSocket.Socket.emit("force_disconnect", {
                reason: "You were disconnected because you logged in on another tab."
            });
            ExistingSocket.Socket.disconnect(true);
        }

        players.set(playerID, { Socket: socket, DisplayName: DisplayName });


        const GameRoom = FindRoom();

        // console.log(rooms.size);

        if (isGuest) {
            GameRoom.addPlayer(socket, DisplayName, DEFAULT_AVATAR);
        } else {
            GameRoom.addPlayer(socket, DisplayName, DEFAULT_AVATAR);

            GetEquippedAvatar(playerID)
                .then(( modelUrl ) => {
                    GameRoom.UpdatePlayerAvatar(socket.id, modelUrl);
                })
                .catch((err) => {
                    console.error("Failed to fetch avatar for", playerID, err);
                });
        }

        socket.emit("NumberOfPlayers", TotalPlayersInServer);

        socket.on("wordDone", (data: WordDoneData) => {

            GameRoom.HandleWordDone(socket, data);

        })

        socket.on("accuracy", (data: AccuracyData) => {

            GameRoom.HandleAccuracy(socket, data)
        })

        socket.on("disconnect", () => {

            //Only delete if the socket disconnecting is still the current socket stored in the map
            if (players.get(playerID)?.Socket === socket) {
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
        const new_room = new GameRoom(io, roomid, (closedRoomID) => {
            rooms.delete(closedRoomID)
        });
        rooms.set(roomid, new_room);

        return new_room;


    }

    setInterval(CalculateNumberOfPlayers, 3000);

    function CalculateNumberOfPlayers() {

        // let Total = 0;

        // for (let [roomid, room] of rooms.entries()) {

        //     Total += room.players.size;
        // }

        // if (Total === 0) {

        //     TotalPlayersInServer = 1;
        // }
        // else {

        //     TotalPlayersInServer = Total;
        // }


        io.emit("NumberOfPlayers", players.size)

    }

}



// export { io, app, server }