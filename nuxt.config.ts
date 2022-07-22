/* eslint-disable @typescript-eslint/no-var-requires */
import { defineNuxtConfig } from "nuxt";
import eslintPlugin from "vite-plugin-eslint";

import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
const path = require("path");

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  tailwindcss: {
    cssPath: "@/assets/css/tailwind.css",
    configPath: "tailwind.config.js",
    exposeConfig: false,
    injectPosition: 0,
    viewer: true
  },
  vite: {
    plugins: [eslintPlugin()],
    resolve: {
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
      alias: {
        "@": path.resolve(__dirname, "/src"),
        process: "process/browser",
        stream: "stream-browserify",
        buffer: "buffer"
      }
    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: "globalThis"
        },
        // Enable esbuild polyfill plugins
        plugins: [
          NodeGlobalsPolyfillPlugin({
            buffer: true
          })
        ]
      }
    }
  },
  alias: {
    "@vue/devtools-api": "@vue/devtools-api"
  },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"]
});
