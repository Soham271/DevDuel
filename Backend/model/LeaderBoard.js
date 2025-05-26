import mongoose  from "mongoose";

const leaderboardSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    trim: true
  },
  contestCode: {
    type: String,
    required: true,
    trim: true
  },
  timeTaken: {
    type: Number,
    required: true,
    min: 0
  },
  testCasesPassed: {
    type: Number,
    required: true,
    min: 0
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
});


const Leaderboard = mongoose.model("Leaderboard", leaderboardSchema);
leaderboardSchema.index({ userId: 1, contestCode: 1 }, { unique: true });

export default Leaderboard;