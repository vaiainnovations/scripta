import { PostPreview } from "./PostPreview";
declare const KV_TRENDING_POSTS: KVNamespace;

export class TrendingPostsKv {
  /**
   * Retrieve a Trending Post from the Cloudflare Cache
   * @param id Trending Post id
   * @returns Cached post if the cache hits, false otherwise.
   */
  public static async get (id: string): Promise<PostPreview[] | false> {
    try {
      return JSON.parse(await KV_TRENDING_POSTS.get(id)) as PostPreview[];
    } catch (e) {
      return false;
    }
  }
}
