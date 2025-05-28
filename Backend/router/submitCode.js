import express from "express";
import Details from "../model/DetailsScheme.js";

const router = express.Router();

export default (io) => {
  router.post("/", async (req, res) => {
    const {
      userId,
      userFullName,
      testCasesPassed,
      timeTaken,
      submittedAt,
      Contest_id,
    } = req.body;

    if (
      !userId ||
      !userFullName ||
      !testCasesPassed ||
      !timeTaken ||
      !submittedAt ||
      !Contest_id
    ) {
      return res
        .status(400)
        .json({ error: "All fields are required, including Contest_id" });
    }

    try {
      let userEntry = await Details.findOne({ userId, Contest_id });
      const TOTAL_SCORE = 10;
      if (userEntry) {
        userEntry.userFullName = userFullName;
        userEntry.testCasesPassed = testCasesPassed;
        userEntry.Score = testCasesPassed;
        userEntry.TotalScore = TOTAL_SCORE;
        userEntry.timeTaken = timeTaken;
        userEntry.submittedAt = submittedAt;
        await userEntry.save();
      } else {
        userEntry = new Details({
          userId,
          userFullName,
          testCasesPassed,
          Score: testCasesPassed,
          TotalScore: TOTAL_SCORE,
          timeTaken,
          submittedAt,
          Contest_id,
        });
        await userEntry.save();
      }

      const contestLeaderboard = await Details.find({ Contest_id })
        .sort({ testCasesPassed: -1, timeTaken: 1 })
        .lean();

      io.to(Contest_id).emit("leaderboardUpdate", contestLeaderboard);
      res.status(200).json({ message: "Leaderboard updated!" });
    } catch (error) {
      console.error("Error updating leaderboard:", error);
      res.status(500).json({ error: "Failed to update leaderboard" });
    }
  });

  return router;
};
