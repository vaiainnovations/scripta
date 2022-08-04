import { PostExtended } from "./PostExtended";
declare const KV_TRENDING_POSTS: KVNamespace;

export class TrendingPostsKv {
  /**
   * Retrieve a Trending Post from the Cloudflare Cache
   * @param id Trending Post id
   * @returns Cached post if the cache hits, false otherwise.
   */
  public static async get (id: string): Promise<PostExtended[] | false> {
    try {
      return JSON.parse(await KV_TRENDING_POSTS.get(id)) as PostExtended[];
    } catch (e) {
      return false;
    }
  }
}
