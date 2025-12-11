import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],

  publicDir: "public",

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        sw: resolve(__dirname, "firebase-messaging-sw.js")
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === "sw") return "firebase-messaging-sw.js";
          return "assets/[name]-[hash].js";
        }
      }
    }
  }
});
