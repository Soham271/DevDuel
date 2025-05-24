
const router = express.Router();
import axios from "axios";
import express from "express";


router.post("/run", async (req, res) => {
  const { source_code, language_id, stdin } = req.body;

  try {
    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
      {
        source_code,
        language_id,
        stdin,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    const result = response.data;
    res.json({
      output: result.stdout || result.stderr || result.compile_output || "No output",
    });
  } catch (err) {
    console.error("Judge0 error:", err);
    res.status(500).json({ error: "Failed to execute code" });
  }
});

export default router