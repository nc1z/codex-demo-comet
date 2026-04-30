import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/codex-demo-comet/" : "/",
  plugins: [react()],
}));
