// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// ---------- Config ----------
const PORT = 3001;
const MAX_ROOM = 5;
const COUNTDOWN_SECS = 3;
const LOBBY_TIMEOUT_MS = 15_000; // start even if room not full
const HEARTBEAT_RATE_MS = 200;   // throttle server broadcasts

// Replace with your own corpus or reuse your words.json
const WORDS = require("./words.json"); // ["alpha","beta",...]
function getRandomWords(n, seed = Date.now()) {
  // Deterministic shuffle (simple LCG)
  let s = seed % 2147483647;
  const pick = [];
  for (let i = 0; i < WORDS.length; i++) {
    s = (s * 48271) % 2147483647;
    pick.push({ w: WORDS[i], r: s });
  }
  pick.sort((a, b) => a.r - b.r);
  return pick.slice(0, n).map(p => p.w);
}

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: ["http://localhost:5173","http://localhost:3000"], credentials: true }
});

// ---------- In-memory rooms ----------
/** @type {Map<string, Room>} */
const rooms = new Map();

function createRoom() {
  const id = Math.random().toString(36).slice(2, 8);
  const words = getRandomWords(30);
  const room = {
    id,
    players: new Map(),
    status: "lobby",
    words,
    createdAt: Date.now(),
    countdownSecs: COUNTDOWN_SECS
  };
  rooms.set(id, room);

  // Lobby auto-start timer
  setTimeout(() => {
    const r = rooms.get(id);
    if (!r || r.status !== "lobby") return;
    if (r.players.size >= 2) startCountdown(r);
  }, LOBBY_TIMEOUT_MS);

  return room;
}

function findRoomNeedingPlayer() {
  for (const r of rooms.values()) {
    if (r.status === "lobby" && r.players.size < MAX_ROOM) return r;
  }
  return null;
}

function startCountdown(room) {
  if (!room || room.status !== "lobby") return;
  room.status = "countdown";
  room.countdownSecs = COUNTDOWN_SECS;
  io.to(room.id).emit("room:update", publicRoom(room));
  const interval = setInterval(() => {
    const r = rooms.get(room.id);
    if (!r) return clearInterval(interval);
    r.countdownSecs -= 1;
    if (r.countdownSecs <= 0) {
      clearInterval(interval);
      startRace(r);
    } else {
      io.to(r.id).emit("room:update", publicRoom(r));
    }
  }, 1000);
}

function startRace(room) {
  room.status = "running";
  room.startAt = Date.now() + 800; // slight buffer for network jitter
  io.to(room.id).emit("race:start", { startAt: room.startAt, words: room.words });
}

function endRaceIfDone(room) {
  if (!room || room.status !== "running") return;
  const allDone = Array.from(room.players.values()).every(p => p.finished);
  if (allDone) {
    room.status = "finished";
    io.to(room.id).emit("race:finished", publicRoom(room));
  }
}

function publicRoom(room) {
  return {
    id: room.id,
    status: room.status,
    countdownSecs: room.countdownSecs,
    startAt: room.startAt,
    players: Array.from(room.players.values()).map(p => ({
      id: p.id,
      name: p.name || `P${p.id.slice(-4)}`,
      progressIdx: p.progressIdx,
      wpm: p.wpm,
      finished: p.finished
    }))
  };
}

// ---------- Socket handlers ----------
io.on("connection", (socket) => {
  let roomId = null;

  // Quick-join matchmaking
  socket.on("room:join", ({ name }) => {
    let room = findRoomNeedingPlayer() || createRoom();
    if (room.players.size >= MAX_ROOM) {
      room = createRoom();
    }

    roomId = room.id;
    socket.join(roomId);

    room.players.set(socket.id, {
      id: socket.id,
      name: (name || "").slice(0, 20),
      progressIdx: 0,
      wpm: 0,
      finished: false
    });

    socket.emit("room:joined", { roomId: room.id, words: room.words, status: room.status });
    io.to(roomId).emit("room:update", publicRoom(room));

    // If room fills, start countdown
    if (room.status === "lobby" && room.players.size >= 2 && room.players.size === MAX_ROOM) {
      startCountdown(room);
    }
  });

  // Player signals ready (optional if you want explicit readiness)
  socket.on("room:ready", () => {
    const room = rooms.get(roomId);
    if (!room || room.status !== "lobby") return;
    if (room.players.size >= 2) startCountdown(room);
  });

  // Client reports completion of a word (authoritative check)
  socket.on("race:wordDone", ({ nextIndex, elapsedMs, totalChars }) => {
    const room = rooms.get(roomId);
    if (!room || room.status !== "running") return;
    const player = room.players.get(socket.id);
    if (!player) return;

    // Minimal sanity checks
    if (typeof nextIndex !== "number") return;
    // Only allow +1 step forward
    if (nextIndex === player.progressIdx + 1 && nextIndex <= room.words.length) {
      player.progressIdx = nextIndex;
      // Basic WPM calc: gross WPM = (chars/5)/(elapsed minutes)
      if (typeof elapsedMs === "number" && typeof totalChars === "number" && elapsedMs > 0) {
        const minutes = elapsedMs / 60000;
        player.wpm = Math.round((totalChars / 5) / minutes);
      }
      if (player.progressIdx === room.words.length) {
        player.finished = true;
        endRaceIfDone(room);
      }
    }
  });

  // Heartbeat (throttled broadcast of everyone’s progress)
  const hb = setInterval(() => {
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room) return;
    io.to(roomId).emit("room:update", publicRoom(room));
  }, HEARTBEAT_RATE_MS);

  socket.on("disconnect", () => {
    clearInterval(hb);
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room) return;
    room.players.delete(socket.id);
    io.to(roomId).emit("room:update", publicRoom(room));
    // Clean up empty rooms
    if (room.players.size === 0) rooms.delete(roomId);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
