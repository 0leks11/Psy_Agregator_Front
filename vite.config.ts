import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), mkcert()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        configure: (proxy) => {
          proxy.on("error", () => {
            // Добавлен _ к err
            // console.log("proxy error", _err);
          });
          proxy.on("proxyReq", () => {
            // console.log("Sending Request...", _req.method, _req.url);
          });
          proxy.on("proxyRes", () => {
            // Добавлен _ к proxyRes
            // console.log("Received Response...", _proxyRes.statusCode, _req.url);
          });
        },
      },
    },
  },
});
