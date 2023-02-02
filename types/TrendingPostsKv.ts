import { PostExtended } from "./PostExtended";
declare const KV_TRENDING_POSTS: KVNamespace;

export class TrendingPostsKv {
  /**
   * Retrieve a Trending Post from the Cloudflare Cache
   * @param id Trending Post id
   * @returns Cached post if the cache hits
   */
  public static async get (id: string): Promise<PostExtended[]> {
    try {
      const cached = await KV_TRENDING_POSTS.get(id);
      if (cached) {
        return JSON.parse(cached) as PostExtended[];
      } else {
        console.warn(`[cache] Trendings ${id} miss`);
        return [];
      }
    } catch (e) {
      console.warn(`[cache] Trendings ${id} miss`);
      return [];
    }
  }
}
