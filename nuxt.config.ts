import { defineNuxtConfig } from "nuxt";
import eslintPlugin from "vite-plugin-eslint";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  vite: {
    plugins: [eslintPlugin()]
  },
  alias: {
    "@vue/devtools-api": "@vue/devtools-api"
  },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  css: ["bootstrap-icons/font/bootstrap-icons.css"]
});
