import app from "./app.js";

import { fileURLToPath } from "url";
import path from "path";

// Get the current directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Serve the 'indes.html' file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "indes.html"));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
