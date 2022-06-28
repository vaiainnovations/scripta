import { PostPreview } from "./PostPreview";
declare const KV_POSTS: KVNamespace;

export class PostKv {
  /**
   * Retrieve a Post from the Cloudflare Cache
   * @param id Post id
   * @returns Cached post if the cache hits, false otherwise.
   */
  public static async get (id: string): Promise<PostPreview | false> {
    try {
      return JSON.parse(await KV_POSTS.get(id)) as PostPreview;
    } catch (e) {
      console.warn(`[cache] Post ${id} miss`);
      return false;
    }
  }
}
