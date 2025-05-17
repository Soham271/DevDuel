import express from "express";
import { GetContestDetails } from "../controllers/ContestController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.get("/contest/:code", GetContestDetails);

export default router;
