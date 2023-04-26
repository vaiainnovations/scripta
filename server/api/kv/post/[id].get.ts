/**
 * Retrieve a Post from the Cloudflare KV
 * @param id Post id
 * @returns Cached post and `success: true` if the cache hits, `success: false` otherwise.
 */
export default defineEventHandler(async ({ context }) => {
  const postId = context?.params?.id || "";
  try {
    const KV: KVNamespace = context.cloudflare.env.KV_POSTS;
    const post = await KV.get(postId);
    if (post) {
      return {
        success: true,
        post
      };
    }
  } catch (e) {
    console.log(e);
  }

  return {
    success: false
  };
});
