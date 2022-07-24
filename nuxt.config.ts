/* eslint-disable @typescript-eslint/no-var-requires */
import { defineNuxtConfig } from "nuxt";
import eslintPlugin from "vite-plugin-eslint";

import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
const path = require("path");
const mode = process.env.NODE_ENV === "production" ? "production" : "development";

// Use a custom Nitro configuration on production mode for Cloudflare SSR, otherwise use the default
let nitro = {};
if (mode === "production") {
  nitro = {
    entry: null,
    node: false,
    minify: true,
    noExternals: true,
    rollupConfig: {
      output: {
        format: "iife",
        generatedCode: {
          symbols: true
        }
      }
    },
    inlineDynamicImports: true
  };
}

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  nitro,
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
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  experimental: {
    treeshakeClientOnly: true
  }
});
