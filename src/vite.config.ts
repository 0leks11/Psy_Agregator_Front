import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        configure: (proxy, _options) => {
          proxy.on("error", (_err, _req, _res) => {
            // console.log("proxy error", _err);
          });
          proxy.on("proxyReq", (_proxyReq, _req, _res) => {
            // console.log("Sending Request...", _req.method, _req.url);
          });
          proxy.on("proxyRes", (_proxyRes, _req, _res) => {
            // console.log("Received Response...", _proxyRes.statusCode, _req.url);
          });
        },
      },
    },
  },
});
