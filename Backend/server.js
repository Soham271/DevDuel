import { app, server } from "./app.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const port = process.env.PORT || 3004;  

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
