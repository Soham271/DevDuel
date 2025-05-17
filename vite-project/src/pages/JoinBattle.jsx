import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function JoinBattle() {
  const location = useLocation();
  const navigate = useNavigate();
  const { contestCode } = location.state || {};
  const [contest, setContest] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [error, setError] = useState(null);

  // Fetch contest details
  useEffect(() => {
    if (contestCode) {
      axios
        .get(`http://localhost:3004/api/v1/joinBattle/contest/${contestCode}`)
        .then((res) => {
          setContest(res.data.contest);
          // Calculate duration in seconds
          const duration = res.data.contest.Duration;
          let seconds = 0;
          if (duration === "1hr") {
            seconds = 3600;
          } else {
            seconds = parseInt(duration.replace("min", "")) * 60;
          }
          setTimeLeft(seconds);
        })
        .catch((err) => {
          console.error("Failed to load contest:", err);
          setError("Contest not found or an error occurred.");
        });
    } else {
      setError("No contest code provided.");
    }
  }, [contestCode]);

  // Timer logic
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/contest-ended");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const styles = {
    container: {
      maxWidth: "800px",
      margin: "auto",
      padding: "2rem",
      fontFamily: "Arial, sans-serif",
    },
    heading: {
      fontSize: "1.8rem",
      marginBottom: "1rem",
    },
    info: {
      marginBottom: "0.5rem",
      fontSize: "1.2rem",
    },
    timer: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: timeLeft <= 300 ? "red" : "black",
      marginBottom: "1rem",
    },
    question: {
      marginTop: "2rem",
      border: "1px solid #ccc",
      padding: "1rem",
      borderRadius: "6px",
    },
    error: {
      color: "red",
      fontSize: "1.2rem",
    },
  };

  if (error) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>{error}</p>
      </div>
    );
  }

  if (!contest) {
    return (
      <div style={styles.container}>
        <p>Loading...</p>
      </div>
    );
  }

  const question = contest.Questions[0];

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>{contest.Title}</h1>
      <p style={styles.info}>Contest Code: {contest.Code}</p>
      <p style={styles.info}>Level: {contest.Level}</p>
      <p style={styles.info}>Language: {contest.Language}</p>
      <p style={styles.info}>Duration: {contest.Duration}</p>
      <p style={styles.timer}>Time Left: {formatTime(timeLeft)}</p>
      <h2>Problem</h2>
      {question ? (
        <div style={styles.question}>
          <h3>{question.title}</h3>
          <p>
            <strong>Difficulty:</strong> {question.difficulty}
          </p>
          <p>
            <strong>Description:</strong> {question.description}
          </p>
          <p>
            <strong>Input Format:</strong> {question.inputFormat}
          </p>
          <p>
            <strong>Output Format:</strong> {question.outputFormat}
          </p>
          <p>
            <strong>Sample Input:</strong> {question.sampleInput}
          </p>
          <p>
            <strong>Sample Output:</strong> {question.sampleOutput}
          </p>
        </div>
      ) : (
        <p>No problem available.</p>
      )}
    </div>
  );
}

export default JoinBattle;
