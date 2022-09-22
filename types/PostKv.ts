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
      return JSON.parse(await KV_POSTS.get(id)) as PostExtended;
    } catch (e) {
      console.warn(`[cache] Post ${id} miss`);
      return false;
    }
  }
}
