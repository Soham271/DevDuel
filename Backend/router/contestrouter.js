import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { CreateContest } from "../controllers/ContestController.js";

const router = express.Router();
router.post("/create-contest", CreateContest);
export default router;
