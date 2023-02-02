import { PostExtended } from "./PostExtended";
declare const KV_POSTS: KVNamespace;

export class PostKv {
  /**
   * Retrieve a Post from the Cloudflare Cache
   * @param id Post id
   * @returns Cached post if the cache hits, false otherwise.
   */
  public static async get (id: string): Promise<PostExtended | false> {
    try {
      const cached = await KV_POSTS.get(id);
      if (cached) {
        return JSON.parse(cached) as PostExtended;
      } else {
        console.warn(`[cache] Post ${id} miss`);
        return false;
      }
    } catch (e) {
      console.warn(`[cache] Post ${id} miss`);
      return false;
    }
  }
}
