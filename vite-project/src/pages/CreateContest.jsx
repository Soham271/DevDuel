import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateContest() {
  const user = useSelector((state) => state.user.user);

  const [CreateContestData, setCreateContestData] = useState({
    Title: "",
    Level: "",
    Duration: "",
    Language: "",
  });

  const [contestCode, setContestCode] = useState(null);
  const navigate = useNavigate();

  const handleCreateContext = async (e) => {
    e.preventDefault();

    // Generate 8-digit contest code
    const code = Math.floor(10000000 + Math.random() * 90000000);
    setContestCode(code);

    // Add Code to the object being sent to backend
    const dataToSend = {
      ...CreateContestData,
      Code: code,
    };

    try {
      await axios.post(
        "http://localhost:3004/api/v1/user/create-contest",
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // Navigate after successful creation
      navigate("/Join-Battle", { state: { contestCode: code } });
    } catch (err) {
      console.error("Error creating contest:", err);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Create Contest</h1>
      <form onSubmit={handleCreateContext} style={styles.form}>
        <label>Contest Title</label>
        <input
          type="text"
          style={styles.input}
          value={CreateContestData.Title}
          onChange={(e) =>
            setCreateContestData({
              ...CreateContestData,
              Title: e.target.value,
            })
          }
        />

        <label>Difficulty Level</label>
        <select
          style={styles.input}
          value={CreateContestData.Level}
          onChange={(e) =>
            setCreateContestData({
              ...CreateContestData,
              Level: e.target.value,
            })
          }
        >
          <option value="">--Select--</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <label>Time Duration</label>
        <select
          style={styles.input}
          value={CreateContestData.Duration}
          onChange={(e) =>
            setCreateContestData({
              ...CreateContestData,
              Duration: e.target.value,
            })
          }
        >
          <option value="">--Select--</option>
          <option value="5min">5 Minutes</option>
          <option value="10min">10 Minutes</option>
          <option value="20min">20 Minutes</option>
          <option value="30min">30 Minutes</option>
          <option value="40min">40 Minutes</option>
          <option value="50min">50 Minutes</option>
          <option value="1hr">1 Hour</option>
        </select>

        <label>Programming Language</label>
        <select
          style={styles.input}
          value={CreateContestData.Language}
          onChange={(e) =>
            setCreateContestData({
              ...CreateContestData,
              Language: e.target.value,
            })
          }
        >
          <option value="">--Select--</option>
          <option value="C">C</option>
          <option value="C++">C++</option>
          <option value="Java">Java</option>
          <option value="Python">Python</option>
        </select>

        <button type="submit" style={styles.button}>
          Create Contest
        </button>

        {contestCode && (
          <p style={styles.codeDisplay}>Contest Code: {contestCode}</p>
        )}
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "auto",
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },
  heading: {
    fontSize: "1.8rem",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    padding: "10px",
    fontSize: "1rem",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "1rem",
  },
  codeDisplay: {
    marginTop: "1rem",
    fontWeight: "bold",
    fontSize: "1.2rem",
    color: "#333",
  },
};

export default CreateContest;
