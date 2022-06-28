import { Miniflare } from "miniflare";
import { PostPreview } from "../types/PostPreview";

let miniflare;

class Simulator {
  static updateMiniflareInstance(buildCommand = "") {
    miniflare = new Miniflare({
      kvPersist: "./.mf/",
      kvNamespaces: ["KV_POSTS", "KV_TRENDING_POSTS"],
      scriptPath: "./.output/server/index.mjs",
      sitePath: ".output/public",
      buildCommand,
      port: 8787,
      watch: true,
      buildWatchPaths: ["./types", "./tests", "./server", "./public", "./pages", "./modules", "./layouts", "./components"]
    });
  }

  // Create and populate local Miniflare KV namespaces & test values
  static async populateKv() {
    // Generate sample Posts
    const posts = await miniflare.getKVNamespace("KV_POSTS");
    const postSample = new PostPreview("Post", "Description of the post", "", "Content of the post");
    for (let i = 0; i < 10; i++) {
      await posts.put(i.toString(), JSON.stringify(postSample));
    }

    // generate sample Trending Posts
    const postsTrending = await miniflare.getKVNamespace("KV_TRENDING_POSTS");
    const postTrendingSample = new PostPreview("Trending Post", "Description of the trending post", "", "Content of the trending post");
    for (let i = 0; i < 10; i++) {
      await postsTrending.put(i.toString(), JSON.stringify(postTrendingSample));
    }
  }

  static async run() {
    miniflare.addEventListener("reload", () => {
      console.log("Worker reloaded!");
    });

    const server = await miniflare.createServer();
    const { HTTPPlugin } = await miniflare.getPlugins();
    server.listen(HTTPPlugin.port, () => {
      console.log(`Listening on :${HTTPPlugin.port}`);
    });
  }
}

Simulator.updateMiniflareInstance("NITRO_PRESET=cloudflare yarn build");
Simulator.populateKv().then(() => {
  console.log("KV Cache rewrite");
  Simulator.run();
});
