import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      devOptions: {
        enabled: true,
      },
      registerType: "autoUpdate",
      manifest: {
        name: "Sport-Sphere",
        short_name: "Sport sphere",
        icons: [
          {
            src: "/public/favicon.ico",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon",
          },
          {
            src: "/public/favicon-16x16.png",
            type: "image/png",
            sizes: "16x16",
          },
          {
            src: "/public/favicon-32x32.png",
            type: "image/png",
            sizes: "32x32",
          },
          {
            src: "/public/android-chrome-192x192.png",
            type: "image/png",
            sizes: "192x192",
          },
          {
            src: "/public/android-chrome-512x512.png",
            type: "image/png",
            sizes: "512x512",
            purpose: "any maskable",
          },
        ],
        theme_color: "#AAF",
      },
    }),
  ],
});
