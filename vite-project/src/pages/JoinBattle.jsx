import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import MonacoEditor from "@monaco-editor/react";
import problems from "@/json-data/problems";
import {
  PageWrapper, ProblemPanel,
  EditorPanel,
  Title,
  Description,
  FormatText,
  StyledButton,
  OutputBox,
  CustomButtonWrapper
} from "@/components/StyledComponents";
import CustomButton from "@/components/CustomButton";

// Language Map: Monaco → Judge0
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
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [code, setCode] = useState("// Write your code here");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!contestCode) {
      setError("No contest code provided.");
      return;
    }

    axios
      .get(`http://localhost:3004/api/v1/joinBattle/contest/${contestCode}`)
      .then((res) => {
        const contestData = res.data.contest;
        setContest(contestData);

        // Set duration
        const duration = contestData.Duration.includes("hr")
          ? parseInt(contestData.Duration) * 3600
          : parseInt(contestData.Duration.replace("min", "")) * 60;
        setTimeLeft(duration);

        // Filter problems
        const filtered = problems.filter(
          (p) =>
            p.difficulty.toLowerCase() === contestData.Level.toLowerCase()
        );
        setFilteredProblems(filtered);

        // Set language
        const langObj = languageMap[contestData.Language];
        if (langObj) setLanguage(langObj.editorLang);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load contest.");
      });
  }, [contestCode]);

  useEffect(() => {
    if (!timeLeft) return;
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

    const currentProblem = filteredProblems[currentProblemIndex];
    const testCase = currentProblem.testCases?.[0] || { input: "", output: "" };

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

  if (error) return <div>{error}</div>;
  if (!contest || filteredProblems.length === 0)
    return <div>Loading contest or problems...</div>;

  const currentProblem = filteredProblems[currentProblemIndex];

  return (
    <PageWrapper>
      {/* Problem Panel */}
      <ProblemPanel>
        <Title>{currentProblem.title}</Title>
        <Description>{currentProblem.description}</Description>
        <FormatText>
          <b>Input Format:</b> {currentProblem.inputFormat}
          <br />
          <b>Output Format:</b> {currentProblem.outputFormat}
          <br />
          <b>Sample Input:</b> {currentProblem.sampleInput}
          <br />
          <b>Sample Output:</b> {currentProblem.sampleOutput}
        </FormatText>
        <div>
          <CustomButton
            disabled={currentProblemIndex === 0}
            onClick={() => setCurrentProblemIndex(i => i - 1)}
          >
            Prev
          </CustomButton>

          <CustomButton
            disabled={currentProblemIndex === filteredProblems.length - 1}
            onClick={() => setCurrentProblemIndex(i => i + 1)}
          >
            Next
          </CustomButton>
        </div>
        <div style={{ marginTop: "20px", fontWeight: "bold", color: "#555" }}>
          ⏳ Time Left: {formatTime(timeLeft)}
        </div>
      </ProblemPanel>

      {/* Code Editor Panel */}
      <EditorPanel>
        <MonacoEditor
          height="400px"
          language={language}
          value={code}
          onChange={(val) => setCode(val || "")}
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
