import express from "express";
import {
  CreateContest,
  GetContestDetails,
} from "../controllers/ContestController.js";
import CreateContestModel from "../model/contestModel.js";

const router = express.Router();

router.post("/create-contest", CreateContest);
router.get("/contest/:code", GetContestDetails);

// ✅ Get all currently running contests
router.get("/running", async (req, res) => {
  try {
    const contests = await CreateContestModel.find({ isRunning: true });
    res.json({ contests });
  } catch (error) {
    console.error("Error fetching running contests:", error);
    res.status(500).json({ error: "Failed to fetch running contests" });
  }
});

export default router;
