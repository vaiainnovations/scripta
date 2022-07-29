import { Miniflare } from "miniflare";
import { PostExtended } from "../types/PostExtended";

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
    const postSample: PostExtended = {
      external_id: "8a7b7cad-896f-4289-adf0-c49ec1556da2",
      text: "This is a sample Title",
      subtitle: "A subtitle for this sample post",
      content: "This is the *content* of the sample post",
      author: "desmos16c60y8t8vra27zjg2arlcd58dck9cwn7p6fwtd",
      attachments: [],
      tags: ["tag1", "tag2"],
      creation_date: new Date(Date.now()).toString(),
      sectionId: 32,
      entities: [],
      image: "/img/author_pic.png",
      last_edited_date: new Date(Date.now()).toString()

    };
    for (let i = 0; i < 10; i++) {
      await postsKV.put(i.toString(), JSON.stringify(postSample));
    }

    // generate sample Trending Posts
    const postsTrendingKV = await miniflare.getKVNamespace("KV_TRENDING_POSTS");
    const postTrendingSample = postSample;
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
