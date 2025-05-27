import { io } from "socket.io-client";
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import gsap from "gsap";

// Register GSAP plugins (if needed, though we're using basic animations here)
gsap.registerPlugin();

function Joincontest() {
  const [contestCode, setContestCode] = useState("");
  const [error, setError] = useState("");
  const [contestDetails, setContestDetails] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const headingRef = useRef(null);
  const formRef = useRef(null);
  const detailsRef = useRef(null);

  useEffect(() => {
    // Socket.IO setup
    socketRef.current = io("http://localhost:3004", {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log("User connected:", socketRef.current.id);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    socketRef.current.on("userJoined", (data) => {
      console.log(`User ${data.userId} joined contest ${data.contestCode}`);
      setConnectedUsers((prev) => [...new Set([...prev, data.userId])]);
    });

    socketRef.current.on("userList", (data) => {
      console.log("Updated user list:", data.users);
      setConnectedUsers(data.users);
    });

    if (location.state?.contestCode) {
      setContestCode(location.state.contestCode.toString());
      joinContest(location.state.contestCode);
    }

    // GSAP Animations
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
      }
    );

    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.4,
        ease: "power2.out",
      }
    );

    gsap.fromTo(
      detailsRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.4,
        ease: "power2.out",
      }
    );

    return () => {
      socketRef.current.disconnect();
      console.log("Socket disconnected");
    };
  }, [location.state]);

  const joinContest = async (code) => {
    try {
      const response = await axios.get(
        `http://localhost:3004/api/v1/contenst/contest/${code}`,
        { withCredentials: true }
      );
      setContestDetails(response.data.contest);
      setError("");

      socketRef.current.emit("joinContest", {
        contestCode: code,
        userId: socketRef.current.id,
      });

      navigate("/Join-Battle", {
        state: { contestCode: code, contestDetails: response.data.contest },
      });
    } catch (err) {
      setError("Invalid contest code or contest not found");
      console.error(
        "Error joining contest:",
        err.response?.data || err.message
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contestCode) {
      setError("Please enter a contest code");
      return;
    }
    joinContest(contestCode);
  };

  return (
    <div className="bg-black min-h-screen font-sans text-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 sm:px-6 lg:px-8 py-12">
        <h1
          ref={headingRef}
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-10 text-center tracking-tight"
        >
          Join a <span className="text-teal-500">Code Battle</span>
        </h1>

        {!contestDetails ? (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-gray-900 p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <label className="text-lg sm:text-xl font-medium text-gray-300 mb-3 block">
              Contest Code
            </label>
            <input
              type="text"
              value={contestCode}
              onChange={(e) => setContestCode(e.target.value)}
              placeholder="Enter contest code"
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 placeholder-gray-500"
            />
            {error && (
              <p className="text-red-400 mt-3 text-sm sm:text-base">{error}</p>
            )}
            <button
              type="submit"
              className="mt-6 w-full py-3 bg-teal-500 text-white rounded-lg font-semibold text-base sm:text-lg hover:bg-teal-600 transition-colors duration-300 active:scale-95"
            >
              Join Contest
            </button>
          </form>
        ) : (
          <div
            ref={detailsRef}
            className="w-full max-w-lg bg-gray-900 p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-2xl sm:text-3xl font-semibold mb-5 text-teal-500 tracking-tight">
              Contest: {contestDetails.Title}
            </h2>
            <p className="text-gray-300 mb-3 text-base sm:text-lg">
              <span className="font-medium">Level:</span> {contestDetails.Level}
            </p>
            <p className="text-gray-300 mb-3 text-base sm:text-lg">
              <span className="font-medium">Duration:</span>{" "}
              {contestDetails.Duration}
            </p>
            <p className="text-gray-300 mb-3 text-base sm:text-lg">
              <span className="font-medium">Language:</span>{" "}
              {contestDetails.Language}
            </p>
            <p className="text-gray-300 mb-3 text-base sm:text-lg">
              <span className="font-medium">Code:</span> {contestDetails.Code}
            </p>
            <p className="text-gray-300 mb-5 text-base sm:text-lg">
              <span className="font-medium">Question:</span>{" "}
              {contestDetails.Questions[0]?.title || "N/A"}
            </p>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-200 mb-4">
              Connected Users:
            </h3>
            <ul className="list-disc pl-6 text-gray-300 text-base sm:text-lg">
              {connectedUsers.length > 0 ? (
                connectedUsers.map((userId) => (
                  <li key={userId} className="mb-2">
                    {userId}
                  </li>
                ))
              ) : (
                <li className="text-gray-400">No users connected yet.</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Joincontest;