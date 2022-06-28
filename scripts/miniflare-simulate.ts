import { Miniflare } from "miniflare";
import { PostPreview } from "../types/PostPreview";

let miniflare;

class Simulator {
  static updateMiniflareInstance (buildCommand = "") {
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
  static async populateKv () {
    // Generate sample Posts
    const postsKV = await miniflare.getKVNamespace("KV_POSTS");
    const postSample = new PostPreview("Post", "Description of the post", "/img/author_pic.png", "Content of the post");
    for (let i = 0; i < 10; i++) {
      await postsKV.put(i.toString(), JSON.stringify(postSample));
    }

    // generate sample Trending Posts
    const postsTrendingKV = await miniflare.getKVNamespace("KV_TRENDING_POSTS");
    const postTrendingSample = new PostPreview("Trending Post", "Description of the trending post", "/img/author_pic.png", "Content of the trending post");
    const postsTrending = [];
    for (let i = 0; i < 7; i++) {
      postsTrending.push(postTrendingSample);
    }
    await postsTrendingKV.put("1", JSON.stringify(postsTrending));
  }

  static async run () {
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
