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
   <div className="max-w-6xl mx-auto p-6" data-scroll-section>
  <h2 className="text-4xl font-bold mb-8 text-center text-black">Leaderboard</h2>
  <div className="overflow-x-auto rounded-2xl shadow-xl border border-gray-700 bg-gray-900">
    <table className="min-w-full table-auto border-collapse text-white">
      <thead className="bg-gray-800">
        <tr>
          <th className="border border-gray-700 px-6 py-4 text-lg">Rank</th>
          <th className="border border-gray-700 px-6 py-4 text-lg">Name</th>
          <th className="border border-gray-700 px-6 py-4 text-lg">Test Cases Passed</th>
          <th className="border border-gray-700 px-6 py-4 text-lg">Time Taken (s)</th>
          <th className="border border-gray-700 px-6 py-4 text-lg">Submitted At</th>
        </tr>
      </thead>
      <tbody>
        {leaderboard.length > 0 ? (
          leaderboard.map((entry) => (
            <tr key={entry._id} className="bg-gray-950 hover:bg-gray-800 transition">
              <td className="border border-gray-700 px-6 py-4 text-center text-purple-400 font-bold">{entry.rank}</td>
              <td className="border border-gray-700 px-6 py-4 text-center">{entry.userFullName}</td>
              <td className="border border-gray-700 px-6 py-4 text-center">{entry.testCasesPassed}</td>
              <td className="border border-gray-700 px-6 py-4 text-center">{entry.timeTaken}</td>
              <td className="border border-gray-700 px-6 py-4 text-center">{new Date(entry.submittedAt).toLocaleString()}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="border border-gray-700 px-6 py-4 text-center text-gray-400">
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
