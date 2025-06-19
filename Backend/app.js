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
import detailsrouter from "./router/details.js";
import Details from "./model/DetailsScheme.js";

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
app.use("/api/v1/code", codeRoutes);
app.use("/api/v1/leaderboard", leaderroute);
app.use("/api/v1/submitCode", submitCodeRoutes(io));
app.use("/api/v1/details", detailsrouter);
dbConnect();

const contestRooms = new Map();
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinContest", async (data) => {
    const { contestCode, userId } = data;

    if (!contestCode || !userId) {
      console.error("Invalid joinContest data:", data);
      socket.emit("error", { message: "Invalid contest code or user ID" });
      return;
    }

    socket.join(contestCode);
    console.log(`User ${userId} joined contest ${contestCode}`);

    if (!contestRooms.has(contestCode)) {
      contestRooms.set(contestCode, new Set());
    }

    contestRooms.get(contestCode).add({ userId, socketId: socket.id });

    try {
      const leaderboardData = await Details.find({ Contest_id: contestCode })
        .sort({ testCasesPassed: -1, timeTaken: 1 })
        .lean();
      socket.emit("leaderboardUpdate", leaderboardData);
    } catch (error) {
      console.error("Error fetching leaderboard for new user:", error);
      socket.emit("leaderboardUpdate", []);
    }

    io.to(contestCode).emit("userJoined", { userId, contestCode });

    // Add defensive check before Array.from
    const users = contestRooms.get(contestCode);
    if (!users) {
      console.error(
        `Contest room ${contestCode} not found after initialization`
      );
      io.to(contestCode).emit("userList", { users: [] });
      return;
    }

    io.to(contestCode).emit("userList", {
      users: Array.from(users).map((user) => user.userId),
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    contestRooms.forEach((users, contestCode) => {
      let userToRemove = null;
      for (const user of users) {
        if (user.socketId === socket.id) {
          userToRemove = user;
          break;
        }
      }

      if (userToRemove) {
        users.delete(userToRemove);
        io.to(contestCode).emit("userList", {
          users: Array.from(users).map((user) => user.userId),
        });
        if (users.size === 0) {
          contestRooms.delete(contestCode);
        }
      }
    });
  });
});

export { app, server };
