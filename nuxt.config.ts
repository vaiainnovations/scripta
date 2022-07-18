import { defineNuxtConfig } from "nuxt";
import eslintPlugin from "vite-plugin-eslint";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  tailwindcss: {
    cssPath: "@/assets/css/main.css",
    configPath: "tailwind.config.js",
    exposeConfig: false,
    config: {},
    injectPosition: 0,
    viewer: true
  },
  vite: {
    plugins: [eslintPlugin()]
  },
  alias: {
    "@vue/devtools-api": "@vue/devtools-api"
  },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"]
});
