import { catchAsyncErr } from '../middleware/catchasyncErr.js'
import  Leaderboard from '../model/LeaderBoard.js'
export const CreateLeaderboard = catchAsyncErr(async (req, res, next) => {
  const { userId, contestCode, timeTaken, testCasesPassed } = req.body;

  try {
    await Leaderboard.findOneAndUpdate(
      { userId, contestCode },
      {
        timeTaken,
        testCasesPassed,
        submittedAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ message: "Submission recorded successfully (created or updated)" });
  } catch (err) {
    res.status(500).json({ error: "Failed to store leaderboard data" });
  }
});
export const getLeaderboard=catchAsyncErr(async(req,res,next)=>{
  const { contestCode } = req.params;

  try {
    const results = await Leaderboard.find({ contestCode })
      .sort({ testCasesPassed: -1, timeTaken: 1 });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
})