/* eslint-disable @typescript-eslint/no-var-requires */
import eslintPlugin from "vite-plugin-eslint";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";
import builtins from "rollup-plugin-node-builtins";
const path = require("path");
const pjson = require("./package.json");
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
  runtimeConfig: {
    public: {
      restApiUrl: process.env.NUXT_REST_API_URL,
      rpcUrl: process.env.NUXT_RPC_URL,
      lcdUrl: process.env.NUXT_LCD_URL,
      subspaceId: process.env.NUXT_SUBSPACE_ID,
      ipfsGateway: process.env.NUXT_IPFS_GATEWAY,
      ipfsGatewayRead: process.env.NUXT_IPFS_GATEWAY_READ,
      chainId: process.env.NUXT_CHAIN_ID,
      web3AuthClientId: process.env.NUXT_WEB3AUTH_CLIENT_ID,
      walletConnectProjectId: process.env.NUXT_WALLETCONNECT_PROJECT_ID,
      gitHash: process.env.NUXT_CURRENT_GIT_SHA,
      version: pjson.version
    }
  },
  alias: {
    "@": path.resolve(__dirname, "/src"),
    process: "process/browser",
    stream: "stream-browserify",
    buffer: "buffer",
    Buffer: "buffer",
    util: "rollup-plugin-node-polyfills/polyfills/util"
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
          rollupNodePolyFill(), builtins()]
      }
    },
    plugins: [eslintPlugin()],
    resolve: {
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
      alias: mode === "production"
        ? {
          "@": path.resolve(__dirname, "/src"),
          util: "rollup-plugin-node-polyfills/polyfills/util",
          sys: "util",
          events: "rollup-plugin-node-polyfills/polyfills/events",
          stream: "rollup-plugin-node-polyfills/polyfills/stream",
          path: "rollup-plugin-node-polyfills/polyfills/path",
          querystring: "rollup-plugin-node-polyfills/polyfills/qs",
          punycode: "rollup-plugin-node-polyfills/polyfills/punycode",
          url: "rollup-plugin-node-polyfills/polyfills/url",
          http: "rollup-plugin-node-polyfills/polyfills/http",
          https: "rollup-plugin-node-polyfills/polyfills/http",
          os: "rollup-plugin-node-polyfills/polyfills/os",
          assert: "rollup-plugin-node-polyfills/polyfills/assert",
          constants: "rollup-plugin-node-polyfills/polyfills/constants",
          _stream_duplex: "rollup-plugin-node-polyfills/polyfills/readable-stream/duplex",
          _stream_passthrough: "rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough",
          _stream_readable: "rollup-plugin-node-polyfills/polyfills/readable-stream/readable",
          _stream_writable: "rollup-plugin-node-polyfills/polyfills/readable-stream/writable",
          _stream_transform: "rollup-plugin-node-polyfills/polyfills/readable-stream/transform",
          timers: "rollup-plugin-node-polyfills/polyfills/timers",
          console: "rollup-plugin-node-polyfills/polyfills/console",
          vm: "rollup-plugin-node-polyfills/polyfills/vm",
          zlib: "rollup-plugin-node-polyfills/polyfills/zlib",
          tty: "rollup-plugin-node-polyfills/polyfills/tty",
          domain: "rollup-plugin-node-polyfills/polyfills/domain",
          buffer: "rollup-plugin-node-polyfills/polyfills/buffer-es6",
          process: "rollup-plugin-node-polyfills/polyfills/process-es6"
        }
        : {
          process: "rollup-plugin-node-polyfills/polyfills/process-es6",
          stream: "stream-browserify",
          util: "util"
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
            process: false,
            buffer: true
          }),
          NodeGlobalsPolyfillPlugin()
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
    "@vue/devtools-api": "@vue/devtools-api",
    util: "util"
  },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@nuxtjs/device"],
  experimental: {
    treeshakeClientOnly: true
  }
});
