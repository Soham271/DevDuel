import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import jsconfigPath from "vite-jsconfig-paths";


export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
