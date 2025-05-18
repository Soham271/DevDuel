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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: "./config/config.env" });

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      process.env.PORTFOLIO_URL,
      process.env.DASHBOARD_URL,
      "http://localhost:3000",
      "http://localhost:5173", // Add Vite dev server port
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: [
      process.env.PORTFOLIO_URL,
      process.env.DASHBOARD_URL,
      "http://localhost:3000",
      "http://localhost:5173",
    ],
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

dbConnect();

// Store users in each contest room
const contestRooms = new Map(); // Map<contestCode, Set<userId>>

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinContest", (data) => {
    const { contestCode, userId } = data;
    socket.join(contestCode);
    console.log(`User ${userId} joined contest ${contestCode}`);

    // Update room user list
    if (!contestRooms.has(contestCode)) {
      contestRooms.set(contestCode, new Set());
    }
    contestRooms.get(contestCode).add(userId);

    // Broadcast user joined and updated user list
    io.to(contestCode).emit("userJoined", { userId, contestCode });
    io.to(contestCode).emit("userList", {
      users: Array.from(contestRooms.get(contestCode)),
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Remove user from all contest rooms
    contestRooms.forEach((users, contestCode) => {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        // Broadcast updated user list
        io.to(contestCode).emit("userList", {
          users: Array.from(users),
        });
        // Clean up empty rooms
        if (users.size === 0) {
          contestRooms.delete(contestCode);
        }
      }
    });
  });
});

export { app, server };