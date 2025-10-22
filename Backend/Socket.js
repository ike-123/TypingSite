"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = exports.io = void 0;
var socket_io_1 = require("socket.io");
// import http from "http";
var http = require("http");
// import express from "express";
var express = require("express");
var GameRoom_tsx_1 = require("./GameRoom.tsx");
var app = express();
exports.app = app;
var server = http.createServer(app);
exports.server = server;
var io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
});
exports.io = io;
//GameState
// let players = new Map()
// let status = "waiting"
// let startAt = null;
// let words;
// function getRandomWords(amount){
//     const randomArray = [...wordsList].sort(() => 0.5-Math.random());
//     return randomArray.slice(0,amount)
// }
io.on("connection", function (socket) {
    var GameRoom = FindRoom();
    GameRoom.addPlayer(socket);
    socket.on("wordDone", function (data) {
        GameRoom.HandleWordDone(socket, data);
    });
    socket.on("disconnect", function () {
        GameRoom.HandleDisconnect(socket);
    });
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
});
function FindRoom() {
    var rooms = new Map();
    for (var _i = 0, _a = rooms.entries(); _i < _a.length; _i++) {
        var _b = _a[_i], roomid_1 = _b[0], room = _b[1];
        if (room.status == "waiting" && room.players.size < 5) {
            return room;
        }
    }
    //No rooms have been found so make a new one
    var roomid = "Room_".concat(crypto.randomUUID());
    var new_room = new GameRoom_tsx_1.GameRoom(io, roomid);
    rooms.set(roomid, new_room);
    return new_room;
}
