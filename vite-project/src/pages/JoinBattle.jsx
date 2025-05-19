import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import MonacoEditor from "@monaco-editor/react";
import problems from "@/json-data/problems";
import {
  PageWrapper,
  ProblemPanel,
  EditorPanel,
  Title,
  Description,
  FormatText,
  OutputBox
} from "@/components/StyledComponents";
import CustomButton from "@/components/CustomButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const languageMap = {
  C: { id: 50, editorLang: "c" },
  "C++": { id: 54, editorLang: "cpp" },
  Java: { id: 62, editorLang: "java" },
  Python: { id: 71, editorLang: "python" },
  JavaScript: { id: 63, editorLang: "javascript" },
};

const JoinBattle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { contestCode } = location.state || {};

  const [contest, setContest] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState(() => {
    return localStorage.getItem("userCode") || "// Write your code here";
  });
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);
  const [oneMinuteLeftShown, setOneMinuteLeftShown] = useState(false);

  useEffect(() => {
    if (!contestCode) {
      setError("No contest code provided.");
      return;
    }

    const hasShownToast = sessionStorage.getItem("contestToastShown");

    if (!hasShownToast) {
      toast.success("Contest Started, All the best!", {
        position: "top-center",
        autoClose: 2500,
      });
      sessionStorage.setItem("contestToastShown", "true");
    }

    axios
      .get(`http://localhost:3004/api/v1/joinBattle/contest/${contestCode}`)
      .then((res) => {
        const contestData = res.data.contest;
        setContest(contestData);

        const duration = contestData.Duration.includes("hr")
          ? parseInt(contestData.Duration) * 3600
          : parseInt(contestData.Duration.replace("min", "")) * 60;

        const storedStartTime = localStorage.getItem("contestStartTime");
        const storedDuration = localStorage.getItem("contestDuration");

        if (storedStartTime && storedDuration) {
          const elapsed = Math.floor((Date.now() - parseInt(storedStartTime)) / 1000);
          const remaining = parseInt(storedDuration) - elapsed;
          setTimeLeft(Math.max(remaining, 0));
        } else {
          const now = Date.now();
          localStorage.setItem("contestStartTime", now.toString());
          localStorage.setItem("contestDuration", duration.toString());
          setTimeLeft(duration);
        }

        const filtered = problems.filter(
          (p) => p.difficulty.toLowerCase() === contestData.Level.toLowerCase()
        );
        if (filtered.length > 0) setProblem(filtered[0]);

        const langObj = languageMap[contestData.Language];
        if (langObj) setLanguage(langObj.editorLang);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load contest.");
      });
  }, [contestCode]);

  useEffect(() => {
    if (!timeLeft && timeLeft !== 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;

        // Show 1-minute warning
        if (next === 60 && !oneMinuteLeftShown) {
          toast.warn("⚠️ Only 1 minute left!", {
            position: "top-center",
            autoClose: 3000,
          });
          setOneMinuteLeftShown(true);
        }

        // Contest end
        if (next <= 0) {
          clearInterval(timer);
          localStorage.removeItem("contestStartTime");
          localStorage.removeItem("contestDuration");
          localStorage.removeItem("userCode");
          navigate("/contest-ended");
          return 0;
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate, oneMinuteLeftShown]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const secsR = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${secsR
      .toString()
      .padStart(2, "0")}`;
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput("Running...");

    const langEntry = Object.entries(languageMap).find(
      ([, val]) => val.editorLang === language
    );
    const language_id = langEntry?.[1]?.id;
    if (!language_id) {
      setOutput("Unsupported language selected.");
      setIsRunning(false);
      return;
    }

    const testCase = problem?.testCases?.[0] || { input: "", output: "" };

    try {
      const { data } = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
        {
          source_code: code,
          language_id,
          stdin: testCase.input,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": "46aa234c9dmsh883ebe8a023ae11p1ee065jsn0b4eb6176b52",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      const resultOutput =
        data.stdout || data.stderr || data.compile_output || "No output";
      setOutput(resultOutput);
    } catch (err) {
      console.error(err);
      setOutput("Error executing code.");
    }

    setIsRunning(false);
  };

  const handleCopyCode = () => {
    if (contestCode) {
      navigator.clipboard.writeText(contestCode.toString());
      toast.info("Contest code copied!");
    }
  };

  if (error) return <div>{error}</div>;
  if (!contest || !problem) return <div>Loading contest or problem...</div>;

  return (
    <PageWrapper>
      <ToastContainer />

      {/* Problem Panel */}
      <ProblemPanel>
        <Title>{problem.title}</Title>
        <Description>{problem.description}</Description>
        <FormatText>
          <b>Input Format:</b> {problem.inputFormat}
          <br />
          <b>Output Format:</b> {problem.outputFormat}
          <br />
          <b>Sample Input:</b> {problem.sampleInput}
          <br />
          <b>Sample Output:</b> {problem.sampleOutput}
        </FormatText>

        <div style={{ marginTop: "20px", fontWeight: "bold", color: "#555" }}>
          ⏳ Time Left: {formatTime(timeLeft)}
        </div>

        <div style={{ marginTop: "12px" }}>
          <span
            onClick={handleCopyCode}
            style={{
              display: "inline-block",
              padding: "6px 12px",
              backgroundColor: "#f2f2f2",
              borderRadius: "10px",
              border: "1px solid #ccc",
              fontWeight: 500,
              cursor: "pointer",
              userSelect: "none",
            }}
            title="Click to copy"
          >
            📋 Contest Code: {contestCode}
          </span>
        </div>
      </ProblemPanel>

      {/* Code Editor Panel */}
      <EditorPanel>
        <MonacoEditor
          height="400px"
          language={language}
          value={code}
          onChange={(val) => {
            setCode(val || "");
            localStorage.setItem("userCode", val || "");
          }}
          options={{ minimap: { enabled: false }, fontSize: 14 }}
        />
        <div style={{ marginTop: "10px" }}>
          <CustomButton onClick={runCode} disabled={isRunning}>
            {isRunning ? "Running..." : "Run Code"}
          </CustomButton>
          <OutputBox>{output}</OutputBox>
        </div>
      </EditorPanel>
    </PageWrapper>
  );
};

export default JoinBattle;
