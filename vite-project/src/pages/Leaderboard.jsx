import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";

const LeaderboardTable = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const socket = io("http://localhost:3004");
    console.log("Connecting to socket...");

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("leaderboardUpdate", (data) => {
      console.log("Received leaderboard data:", data);
      const updated = data.map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));
      setLeaderboard(updated);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Leaderboard</h2>
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Rank</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">
                Test Cases Passed
              </th>
              <th className="border border-gray-300 px-4 py-2">
                Time Taken (s)
              </th>
              <th className="border border-gray-300 px-4 py-2">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length > 0 ? (
              leaderboard.map((entry) => (
                <tr key={entry._id} className="bg-white">
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {entry.rank}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {entry.userFullName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {entry.testCasesPassed}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {entry.timeTaken}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {new Date(entry.submittedAt).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;
