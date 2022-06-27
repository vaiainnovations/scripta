/* eslint-disable @typescript-eslint/no-var-requires */
const Miniflare = require("miniflare");

// Create and populate local Miniflare KV namespaces & test values
async function populateKv () {
  const mf = new Miniflare.Miniflare({
    kvPersist: "./.mf/",
    kvNamespaces: ["KV_POSTS"],
    scriptPath: "./.output/server/index.mjs"
  });
  const ns = await mf.getKVNamespace("KV_POSTS");
  await ns.put("test", "#Test Post##Description of the post###Content of the post");
}

populateKv();
