import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  root: "src/renderer",
  base: process.env.NODE_ENV === 'production' ? '/rpc-class-finder/' : './',
  build: {
    outDir: "../../dist/renderer",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/renderer/index.html"),
      },
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src/renderer"),
      "@shared": resolve(__dirname, "./src/shared"),
    },
  },
  publicDir: resolve(__dirname, "public"),
});
