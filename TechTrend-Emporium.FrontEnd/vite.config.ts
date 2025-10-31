import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwind from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwind()],
  server: {
    // Proxy /api requests to the backend to avoid CORS during development
    proxy: {
      "/api": {
        target: "https://localhost:7101",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@App": path.resolve(__dirname, "src/App"),
      "@atoms": path.resolve(__dirname, "src/components/atoms"),
      "@molecules": path.resolve(__dirname, "src/components/molecules"),
      "@organisms": path.resolve(__dirname, "src/components/organisms"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@templates": path.resolve(__dirname, "src/templates")
    }
  }
});
