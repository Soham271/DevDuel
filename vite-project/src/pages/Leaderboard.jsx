import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { func } from "joi";
const LeaderboardTable = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const user = useSelector((state) => state.user.user);
  const location = useLocation();
  const { contestCode } = location.state || {};
  const TOTAL_SCORE = 10;
  const navigate = useNavigate();
  useEffect(() => {
    if (!contestCode) {
      console.error("No contestCode provided for leaderboard");
      return;
    }

    // Fetch initial leaderboard data
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3004/api/v1/leaderboard/${contestCode}`
        );
        const data = response.data.leaderboard.map((entry, index) => ({
          ...entry,
          rank: index + 1,
        }));
        setLeaderboard(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setLeaderboard([]);
      }
    };

    fetchLeaderboard();

    const socket = io("http://localhost:3004", { reconnect: true });
    console.log("Connecting to socket...");

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("joinContest", {
        contestCode,
        userId: user?._id || "anonymous",
      });
    });

    socket.on("leaderboardUpdate", (data) => {
      console.log("Received leaderboard data:", data);
      const updated = data.map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));
      setLeaderboard(updated);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [contestCode, user?._id]);
  function handlehello(e) {
    navigate("/details");
  }
  return (
    <div className="max-w-6xl mx-auto p-6" data-scroll-section>
      <h2 className="text-4xl font-bold mb-8 text-center text-black">
        Leaderboard
      </h2>
      <div className="overflow-x-auto rounded-2xl shadow-xl border border-gray-700 bg-gray-900">
        <table className="min-w-full table-auto border-collapse text-white">
          <thead className="bg-gray-800">
            <tr>
              <th className="border border-gray-700 px-6 py-4 text-lg">Rank</th>
              <th className="border border-gray-700 px-6 py-4 text-lg">Name</th>
              <th className="border border-gray-700 px-6 py-4 text-lg">
                Test Cases Passed
              </th>
              <th className="border border-gray-700 px-6 py-4 text-lg">
                Time Taken (s)
              </th>
              <th className="border border-gray-700 px-6 py-4 text-lg">
                Submitted At
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length > 0 ? (
              leaderboard.map((entry) => (
                <tr
                  key={entry._id}
                  className="bg-gray-950 hover:bg-gray-800 transition"
                >
                  <td className="border border-gray-700 px-6 py-4 text-center text-purple-400 font-bold">
                    {entry.rank}
                  </td>
                  <td className="border border-gray-700 px-6 py-4 text-center">
                    {entry.userFullName}
                  </td>
                  <td className="border border-gray-700 px-6 py-4 text-center">
                    {entry.testCasesPassed}/{TOTAL_SCORE}
                  </td>
                  <td className="border border-gray-700 px-6 py-4 text-center">
                    {entry.timeTaken}
                  </td>
                  <td className="border border-gray-700 px-6 py-4 text-center">
                    {new Date(entry.submittedAt).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="border border-gray-700 px-6 py-4 text-center text-gray-400"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <br />
      <br />
      <button
        onClick={handlehello}
        className="size-16 bg-slate-800 text-rose-50"
      >
        Contest Details
      </button>
    </div>
  );
};

export default LeaderboardTable;
