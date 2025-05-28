import express from "express";
import Details from "../model/DetailsScheme.js";

const router = express.Router();

router.get("/:contestCode", async (req, res) => {
  try {
    const { contestCode } = req.params;

    const leaderboardData = await Details.find({ Contest_id: contestCode })
      .sort({ testCasesPassed: -1, timeTaken: 1 })
      .lean();

    res.status(200).json({
      success: true,
      leaderboard: leaderboardData,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

export default router;
