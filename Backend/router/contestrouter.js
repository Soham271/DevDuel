import express from "express";
import {
  CreateContest,
  GetContestDetails,
} from "../controllers/ContestController.js";

const router = express.Router();

router.post("/create-contest", CreateContest);
router.get("/contest/:code", GetContestDetails);

export default router;
