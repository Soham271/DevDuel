// index.js
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import dbConnect from "./database/dbConnect.js";
import userRoutes from "./router/userrouter.js";
import contestRoutes from "./router/contestrouter.js";
import JoinbattleRoutes from "./router/JoinBattle.js";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import { createServer } from "http";
import codeRoutes from "./router/code.js";
import leaderroute from "./router/leaderboard.js";
import submitCodeRoutes from "./router/submitCode.js";
import detailsrouter from './router/details.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: "./config/config.env" });

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: [process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/contenst", contestRoutes);
app.use("/api/v1/joinBattle", JoinbattleRoutes);
app.use("api/v1/code", codeRoutes);
app.use("/api/v1/leaderboard", leaderroute);
app.use("/api/v1/submitCode", submitCodeRoutes(io));
app.use("/api/v1/details", detailsrouter);
dbConnect();

const contestRooms = new Map();
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinContest", (data) => {
    const { contestCode, userId } = data;
    socket.join(contestCode);
    console.log(`User ${userId} joined contest ${contestCode}`);

    if (!contestRooms.has(contestCode)) {
      contestRooms.set(contestCode, new Set());
    }
    contestRooms.get(contestCode).add(userId);

    io.to(contestCode).emit("userJoined", { userId, contestCode });
    io.to(contestCode).emit("userList", {
      users: Array.from(contestRooms.get(contestCode)),
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    contestRooms.forEach((users, contestCode) => {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        io.to(contestCode).emit("userList", {
          users: Array.from(users),
        });
        if (users.size === 0) {
          contestRooms.delete(contestCode);
        }
      }
    });
  });
});

export { app, server };
