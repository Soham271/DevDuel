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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: "./config/config.env" });

const app = express();

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
dbConnect();

export default app;
