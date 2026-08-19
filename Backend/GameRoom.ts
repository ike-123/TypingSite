import { Server } from "socket.io";
import { Socket } from "socket.io";
import wordsList from "../src/words.json" with { type: "json" };
import { AvatarResult } from "./avatarService";


type PlayerState = {
    progressIndex: number;
    wpm: number;
    accuracy: number;
    finished: boolean;
    avatarUrl: AvatarResult;
    finishtime: string;
    Disconnected: boolean;
    DisplayName: string;
}

type WordDoneData = {
    nextIndex: number;
    elapsedMs: number;
    totalChars: number;
}

type AccuracyData = {
    accuracy: number;
}

export class GameRoom {

    io: Server;
    roomId: string;
    players: Map<string | undefined, PlayerState>;
    // cachedPlayersArray: Map<string | undefined, PlayerState>;
    status: string;
    words: string[];
    startAt: number | null;
    countdownTimer: number;
    interval: any;
    isShuttingDown: boolean
    private OnRoomDestoryed?: (roomid: string) => void;
    private HasSentNotification = false;





    constructor(io: Server, roomId: string, onRoomDestroyed: (roomId: string) => void) {

        this.io = io;
        this.roomId = roomId;
        this.players = new Map();
        // this.cachedPlayersArray = new Map();
        this.status = "waiting";
        this.words = [];
        this.startAt = null;
        this.countdownTimer = 10;
        this.words = this.getRandomWords(50);
        this.interval = null
        this.OnRoomDestoryed = onRoomDestroyed;
        this.isShuttingDown = false
    }


    addPlayer(socket: Socket, DisplayName: string, avatarUrl: AvatarResult): void {

        //add socket(client) to room
        socket.join(this.roomId);

        //Add newly joined player to the array of players
        this.players.set(socket.id, { progressIndex: 0, wpm: 0, accuracy: 0, finished: false, finishtime: "", Disconnected: false, DisplayName, avatarUrl})

        this.io.to(this.roomId).emit("setWords", { "words": this.words });

        // send the updated array of players back to all the clients in room
        //To further optimise only send Displayname during player connect and disconnect and not on each state message to the client
        this.io.to(this.roomId).emit("state", Array.from(this.players.entries()).map(([id, val]) => ({ id, ...val })));

        //send status of game to clients in room
        this.io.to(this.roomId).emit("status", this.status);


        if (this.players.size >= 2 && this.status === "waiting") {

            //generate random words
            // this.words = this.getRandomWords(10)

            //set status to countdown and send to clients in room

            this.BeginCountDown();

        }
    }

    UpdatePlayerAvatar(socketId: string, avatarUrl: AvatarResult) {

        const player = this.players.get(socketId)

        if (!player) return;

        player.avatarUrl = avatarUrl

        this.io.to(this.roomId).emit("state", Array.from(this.players.entries()).map(([id, val]) => ({ id, ...val })));
    }

    BeginCountDown() {

        this.status = "countdown"
        this.io.to(this.roomId).emit("status", this.status)

        let countdown = 7;

        this.interval = setInterval(() => {
            this.io.to(this.roomId).emit("countdown", countdown)
            countdown--;

            if (countdown <= 0) {
                clearInterval(this.interval)
                this.status = "running"
                this.startAt = Date.now() + 500

                //Created cachedPlayersArray

                // this.cachedPlayersArray = new Map(this.players);

                this.io.to(this.roomId).emit("start", { "words": this.words, "startAt": this.startAt });
                this.io.to(this.roomId).emit("state", Array.from(this.players.entries()).map(([id, val]) => ({ id, ...val })));
                this.io.to(this.roomId).emit("status", this.status)

                this.GameCountdown();
            }

        }, 1000);
    }



    HandleDisconnect(socket: Socket): void {



        if (this.isShuttingDown) return;

        if (this.status === "waiting") {

            this.players.delete(socket.id);


            console.log(socket.id, "has been removed");

            this.io.to(this.roomId).emit("state", Array.from(this.players.entries()).map(([id, val]) => ({ id, ...val })));

        }
        else if (this.status === "countdown") {


            this.players.delete(socket.id);

            console.log(socket.id, "has been removed");


            if (this.players.size === 1) {

                this.status = "waiting"
                clearInterval(this.interval)
                // this.io.to(this.roomId).emit("countdown", null)

            }

            this.io.to(this.roomId).emit("state", Array.from(this.players.entries()).map(([id, val]) => ({ id, ...val })));

        }
        else {

            //match has started

            const Player = this.players.get(socket.id);
            

            //Player should always exist
            if (Player) {
                this.players.set(socket.id, { ...Player, Disconnected: true });
            }
            else {
                console.log("Player doesn't exist")
            }

            this.io.to(this.roomId).emit("state", Array.from(this.players.entries()).map(([id, val]) => ({ id, ...val })));

        }

        this.io.to(this.roomId).emit("status", this.status)

    }

    HandleWordDone(socket: Socket, data: WordDoneData) {

        const TargetPlayer = this.players.get(socket.id);

        if (!TargetPlayer || this.status != "running") return;


        if (data.nextIndex === TargetPlayer.progressIndex + 1) {

            TargetPlayer.progressIndex = data.nextIndex;

            TargetPlayer.wpm = Math.round((data.totalChars / 5) / (data.elapsedMs / 60000));

            console.log("words = ", data.totalChars / 5);
            console.log("time elapsed = ", data.elapsedMs);

            //if player has finished
            if (TargetPlayer.progressIndex === this.words.length) {

                TargetPlayer.finished = true;
                TargetPlayer.finishtime = this.ConvertMillisecondsToMinutesAndSeconds(data.elapsedMs);
                // console.log("accuracy = " + data.accuracy)
                // TargetPlayer.accuracy = data.accuracy

            }
        }

        this.io.to(this.roomId).emit("state", Array.from(this.players.entries()).map(([id, val]) => ({ id, ...val })));

    }


    HandleAccuracy(socket: Socket, data: AccuracyData) {

        const TargetPlayer = this.players.get(socket.id);

        if (!TargetPlayer || this.status != "running") return;

        TargetPlayer.accuracy = data.accuracy;

        // if (data.nextIndex === TargetPlayer.progressIndex + 1) {

        //     TargetPlayer.progressIndex = data.nextIndex;

        //     TargetPlayer.wpm = Math.round((data.totalChars / 5) / (data.elapsedMs / 60000));

        //     console.log("words = ", data.totalChars / 5);
        //     console.log("time elapsed = ", data.elapsedMs);

        //     //if player has finished
        //     if (TargetPlayer.progressIndex === this.words.length) {

        //         TargetPlayer.finished = true;
        //         TargetPlayer.finishtime = this.ConvertMillisecondsToMinutesAndSeconds(data.elapsedMs);
        //         console.log("accuracy = " + data.accuracy)
        //         TargetPlayer.accuracy = data.accuracy

        //     }
        // }

        this.io.to(this.roomId).emit("state", Array.from(this.players.entries()).map(([id, val]) => ({ id, ...val })));

    }

    GameCountdown(): void {


        let timer = 10;
        let TimeToSendCloseNotification = 5;

        this.interval = setInterval(() => {
            this.io.to(this.roomId).emit("GameCountdown", timer)
            timer--;


            if (timer <= TimeToSendCloseNotification && !this.HasSentNotification) {
                //send ServerClosing notification
                this.io.to(this.roomId).emit("ServerCloseNotification", TimeToSendCloseNotification)
                this.HasSentNotification = true;

            }
            if (timer <= 0) {
                clearInterval(this.interval)
                this.status = "end"

                this.io.to(this.roomId).emit("state", Array.from(this.players.entries()).map(([id, val]) => ({ id, ...val })));
                this.io.to(this.roomId).emit("status", this.status)
                this.ShutdownGameRoom();


            }

        }, 1000);
    }


    ShutdownGameRoom(): void {

        if (this.isShuttingDown) return;

        this.isShuttingDown = true;

        //Disconnect each socket in the Room 

        for (const socketId of Array.from(this.players.keys())) {
            if (!socketId) continue;

            const socket = this.io.sockets.sockets.get(socketId);

            if (socket) {
                // Remove socket from a room
                socket.leave(this.roomId)
                //Disconnet socket
                socket?.disconnect(true);

            }
        }

        //Remove players from players Map
        this.players.clear();
        //Delete GameRoom
        this.io.sockets.adapter.rooms.delete(this.roomId)
        //Call callback function in parent to delete this room from it's array of Rooms
        this.OnRoomDestoryed?.(this.roomId)
    }

    getRandomWords(amount: number) {
        const randomArray = [...wordsList].sort(() => 0.5 - Math.random());
        return randomArray.slice(0, amount)
    }

    ConvertMillisecondsToMinutesAndSeconds(milliseconds: number): string {

        const totalSeconds = Math.floor(milliseconds / 1000)
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const paddedSeconds = String(seconds).padStart(2, '0');

        const totaltime = `${minutes}:${paddedSeconds}`;

        return totaltime;

    }
}
