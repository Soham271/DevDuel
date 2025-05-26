import express from "express";
const router = express.Router();

let leaderboardData = [];

export default (io) => {
  router.post("/", (req, res) => {
    const { userId, userFullName, testCasesPassed, timeTaken, submittedAt } =
      req.body;

    const existingIndex = leaderboardData.findIndex(
      (entry) => entry.userId === userId
    );

    if (existingIndex !== -1) {
      leaderboardData[existingIndex] = {
        ...leaderboardData[existingIndex],
        testCasesPassed,
        timeTaken,
        submittedAt,
      };
    } else {
      leaderboardData.push({
        _id: userId,
        userId,
        userFullName,
        testCasesPassed,
        timeTaken,
        submittedAt,
      });
    }

    leaderboardData.sort((a, b) => {
      if (b.testCasesPassed !== a.testCasesPassed) {
        return b.testCasesPassed - a.testCasesPassed;
      }
      return a.timeTaken - b.timeTaken;
    });

    socket.emit("leaderboardUpdate", leaderboardData);

    io.emit("leaderboardUpdate", leaderboardData);
    res.status(200).send("Leaderboard updated!");
  });

  return router;
};

export { leaderboardData };
