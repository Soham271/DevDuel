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
  OutputBox,
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
  const [runResults, setRunResults] = useState([]);

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
          const elapsed = Math.floor(
            (Date.now() - parseInt(storedStartTime)) / 1000
          );
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
        if (langObj) {
          setLanguage(langObj.editorLang);
        }
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

        if (next === 60 && !oneMinuteLeftShown) {
          toast.warn("⚠️ Only 1 minute left!", {
            position: "top-center",
            autoClose: 3000,
          });
          setOneMinuteLeftShown(true);
        }

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

  const handleRunAllTestCases = async () => {
    setIsRunning(true);
    setOutput("Running test cases...");

    const langEntry = Object.entries(languageMap).find(
      ([, val]) => val.editorLang === language
    );
    const languageId = langEntry?.[1]?.id;

    if (!problem || !code || !languageId) {
      toast.error("Missing code, language or problem.");
      setIsRunning(false);
      return;
    }

    if (!problem.testCases || problem.testCases.length === 0) {
      toast.error("No test cases available.");
      setIsRunning(false);
      return;
    }

    try {
      const results = await Promise.all(
        problem.testCases.map(async (testCase, index) => {
          if (!testCase.input || !testCase.output) {
            return {
              index: index + 1,
              passed: false,
              output: "Missing input/output",
              expected: testCase.output || "undefined",
              input: testCase.input || "undefined",
              status: "Skipped",
            };
          }

          try {
            const { data } = await axios.post(
              "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true",
              {
                source_code: btoa(code),
                language_id: languageId,
                stdin: btoa(testCase.input),
                expected_output: btoa(testCase.output),
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  "X-RapidAPI-Key":
                    "cfe47cc9e9msh5255118aa221a2cp16a358jsnabc9e0ddbcc7",
                  "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                },
              }
            );

            console.log("Judge0 response:", data);

            const passed = data.status.description === "Accepted";
            return {
              index: index + 1,
              passed,
              output: data.stdout
                ? atob(data.stdout)
                : data.stderr
                ? atob(data.stderr)
                : "No output",
              expected: testCase.output,
              input: testCase.input,
              status: data.status.description,
            };
          } catch (err) {
            console.error("Error with test case", index + 1, err);
            return {
              index: index + 1,
              passed: false,
              output: "Error during execution",
              expected: testCase.output,
              input: testCase.input,
              status: "Execution Failed",
            };
          }
        })
      );

      setRunResults(results);

      const allPassed = results.every((r) => r.passed);
      if (allPassed) {
        toast.success("🎉 All test cases passed! Redirecting...");
        setTimeout(() => {
          localStorage.removeItem("contestStartTime");
          localStorage.removeItem("contestDuration");
          localStorage.removeItem("userCode");
          navigate("/contest-ended");
        }, 2000);
      } else {
        toast.info("Some test cases failed.");
      }
    } finally {
      setIsRunning(false);
    }
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
        <div style={{ marginTop: "12px", color: "#222", fontSize: "14px" }}>
          <b>Language Selected:</b> {contest.Language}
        </div>
      </ProblemPanel>

      <EditorPanel>
        <MonacoEditor
          height="400px"
          language={language}
          value={code}
          onChange={(val) => {
            setCode(val || "");
            localStorage.setItem("userCode", val || "");
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            readOnly: false,
          }}
        />
        <div style={{ marginTop: "10px" }}>
          <button
            onClick={handleRunAllTestCases}
            disabled={isRunning}
            style={{
              marginLeft: "10px",
              padding: "8px 12px",
              backgroundColor: "#4caf50",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              opacity: isRunning ? 0.6 : 1,
            }}
          >
            {isRunning ? "Running..." : "Run All Test Cases"}
          </button>
          <OutputBox>{output}</OutputBox>
        </div>

        {runResults.length > 0 && (
          <div className="terminal-output" style={{ marginTop: "20px" }}>
            {runResults.map((res, i) => (
              <div key={i}>
                <strong>Test Case {res.index}:</strong>{" "}
                {res.passed ? "✅ Passed" : "❌ Failed"}
                <br />
                <strong>Input:</strong> {res.input}
                <br />
                <strong>Expected Output:</strong> {res.expected}
                <br />
                <strong>Your Output:</strong> {res.output}
                <br />
                <strong>Status:</strong> {res.status}
                <hr />
              </div>
            ))}
            {runResults.every((r) => r.passed) && (
              <div style={{ color: "green", fontWeight: "bold" }}>
                ✅ All Test Cases Passed!
              </div>
            )}
          </div>
        )}
      </EditorPanel>
    </PageWrapper>
  );
};

export default JoinBattle;
