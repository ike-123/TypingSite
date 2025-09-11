const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const PORT = 3001;

// Sample words – replace with your JSON if you want
const WORDS = ["hello","world","typing","race","socket","react","javascript","node","express","speed"];
function getRandomWords(n) {
  return [...WORDS].sort(() => Math.random() - 0.5).slice(0, n);
}

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" }, // adjust for your React dev server
});

// ---------- Game state ----------
let players = new Map(); // socketId -> { progressIdx, wpm }
let words = [];
let status = "waiting"; // waiting | countdown | running | finished
let startAt = null;

function resetGame() {
  players.clear();
  words = [];
  status = "waiting";
  startAt = null;
}

// ---------- Socket handlers ----------
io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  // Add player to state
  players.set(socket.id, { progressIdx: 0, wpm: 0, finished: false });

  // If 2 players connected, start countdown
  if (players.size === 2 && status === "waiting") {
    words = getRandomWords(20);
    status = "countdown";
    let countdown = 3;
    const interval = setInterval(() => {
      io.emit("countdown", countdown);
      countdown--;
      if (countdown < 0) {
        clearInterval(interval);
        status = "running";
        startAt = Date.now() + 500; // slight buffer
        io.emit("start", { words, startAt });
      }
    }, 1000);
  }

  // Player finished a word
  socket.on("wordDone", ({ nextIndex, elapsedMs, totalChars }) => {
    const p = players.get(socket.id);
    if (!p || status !== "running") return;
    if (nextIndex === p.progressIdx + 1) {
      p.progressIdx = nextIndex;
      p.wpm = Math.round((totalChars / 5) / (elapsedMs / 60000));
      if (p.progressIdx === words.length) {
        p.finished = true;
      }
      io.emit("state", Array.from(players.entries()).map(([id, val]) => ({ id, ...val })));
    }
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
    players.delete(socket.id);
    if (players.size === 0) {
      resetGame();
    }
  });
});

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
