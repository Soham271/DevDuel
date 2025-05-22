import { io } from "socket.io-client";
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Heading,
  StyledForm,
  Label,
  Input,
  SubmitButton,
} from "@/components/styled";
import Navbar from "./Navbar";

function Joincontest() {
  const [contestCode, setContestCode] = useState("");
  const [error, setError] = useState("");
  const [contestDetails, setContestDetails] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState([]); // Track users in the room
  const location = useLocation();
  const navigate = useNavigate();
  const socketRef = useRef(null);

  useEffect(() => {
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
      setConnectedUsers((prev) => [...new Set([...prev, data.userId])]); // Add user to list
    });

    socketRef.current.on("userList", (data) => {
      console.log("Updated user list:", data.users);
      setConnectedUsers(data.users); // Update user list
    });

    if (location.state?.contestCode) {
      setContestCode(location.state.contestCode.toString());
      joinContest(location.state.contestCode);
    }

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

      // Join Socket.IO room
      socketRef.current.emit("joinContest", {
        contestCode: code,
        userId: socketRef.current.id,
      });

      // Navigate to Join-Battle with contest details
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
    <Container
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Navbar />
      <Heading>Join Contest</Heading>
      {!contestDetails ? (
        <StyledForm onSubmit={handleSubmit}>
          <Label>Contest Code</Label>
          <Input
            type="text"
            value={contestCode}
            onChange={(e) => setContestCode(e.target.value)}
            placeholder="Enter contest code"
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <SubmitButton
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Join Contest
          </SubmitButton>
        </StyledForm>
      ) : (
        <div>
          <h2>Contest: {contestDetails.Title}</h2>
          <p>Level: {contestDetails.Level}</p>
          <p>Duration: {contestDetails.Duration}</p>
          <p>Language: {contestDetails.Language}</p>
          <p>Code: {contestDetails.Code}</p>
          <p>Question: {contestDetails.Questions[0]?.title}</p>
          <h3>Connected Users:</h3>
          <ul>
            {connectedUsers.map((userId) => (
              <li key={userId}>{userId}</li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
}

export default Joincontest;
