import mongoose  from "mongoose";

const leaderboardSchema = new mongoose.Schema({
  userId: String,
  contestCode: String,
  timeTaken: Number,
  testCasesPassed: Number,
  submittedAt: Date,
});

const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);
export default Leaderboard;