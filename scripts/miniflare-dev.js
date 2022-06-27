/* eslint-disable @typescript-eslint/no-var-requires */
const Miniflare = require("miniflare");

// Create and populate local Miniflare KV namespaces & test values
async function dev () {
  /* Dist
    const mf = new Miniflare.Miniflare({
    kvPersist: "./.mf/",
    kvNamespaces: ["KV_TEST", "KV_POSTS"],
    scriptPath: "./.output/server/index.mjs",
    buildCommand: "NITRO_PRESET=cloudflare yarn dev",
    port: 8787,
    sitePath: ".output/public",
    liveReload: true
  }); */
  const mf = new Miniflare.Miniflare({
    kvPersist: "./.mf/",
    kvNamespaces: ["KV_POSTS"],
    scriptPath: "./.output/server/index.mjs",
    sitePath: ".output/public",
    buildCommand: "NITRO_PRESET=cloudflare yarn build",
    port: 8787,
    watch: true,
    buildWatchPaths: ["./types", "./tests", "./server", "./public", "./pages", "./modules", "./layouts", "./components"]
  });

  mf.addEventListener("reload", () => {
    console.log("Worker reloaded!");
  });

  const server = await mf.createServer();
  const { HTTPPlugin } = await mf.getPlugins();
  server.listen(HTTPPlugin.port, () => {
    console.log(`Listening on :${HTTPPlugin.port}`);
  });
}

dev();
