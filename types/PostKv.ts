declare const KV_POSTS: KVNamespace;

export class PostKv {
  public static async get(id: string): Promise<string> {
    try {
      const post = await KV_POSTS.get(id);
      return post;
    } catch (e) {
      return "Cache Miss";
    }
  }
}
