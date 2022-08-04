/* eslint-disable @typescript-eslint/no-var-requires */
import { defineNuxtConfig } from "nuxt";
import eslintPlugin from "vite-plugin-eslint";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import inject from "@rollup/plugin-inject";
const path = require("path");
const mode = process.env.NODE_ENV === "production" ? "production" : "development";

// Use a custom Nitro configuration on production mode for Cloudflare SSR, otherwise use the default
let nitro = {};
if (mode === "production") {
  nitro = {
    rollupConfig: {
      output: {
        generatedCode: {
          symbols: true
        }
      }
    }
  };
}

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  alias: {
    "@": path.resolve(__dirname, "/src"),
    process: "process/browser",
    stream: "stream-browserify",
    buffer: "buffer",
    Buffer: "buffer"
  },
  nitro,
  tailwindcss: {
    cssPath: "@/assets/css/tailwind.css",
    configPath: "tailwind.config.js",
    exposeConfig: false,
    injectPosition: 0,
    viewer: true
  },
  vite: {
    build: {
      rollupOptions: {
        plugins: [
          inject({ Buffer: ["buffer", "Buffer"] })]
      }
    },
    plugins: [eslintPlugin()],
    resolve: {
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
      alias: {
        "@": path.resolve(__dirname, "/src"),
        process: "process/browser",
        stream: "stream-browserify"
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
            process: true,
            buffer: true
          })
        ]
      }
    },
    esbuild: {
      define: {
        global: "globalThis"
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
