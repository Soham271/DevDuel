import React, { useEffect, useState } from "react";
import axios from "axios";

const LeaderBoard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const contestCode = localStorage.getItem("lastContestCode");
    if (!contestCode) return;

    axios
      .get(`http://localhost:3004/api/v1/leaderboard/${contestCode}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to fetch leaderboard", err));
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>🏆 Leaderboard</h1>
      <table style={{ margin: "0 auto", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>User</th>
            <th>Test Cases Passed</th>
            <th>Time Taken (s)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, idx) => (
            <tr key={idx}>
              <td>{entry.userId}</td>
              <td>{entry.testCasesPassed}</td>
              <td>{entry.timeTaken}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderBoard;
