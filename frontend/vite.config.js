import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Any request the browser makes to /api is forwarded to the Python backend,
// so the frontend only ever talks to one address.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://127.0.0.1:8000",
    },
  },
});
