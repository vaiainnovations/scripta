/**
 * Retrieve a Trendings from the Cloudflare KV
 * @returns Cached trendings and `success: true` if the cache hits, `success: false` otherwise.
 */
export default defineEventHandler(async ({ context }) => {
  try {
    const KV: KVNamespace = context.cloudflare.env.KV_TRENDINGS;
    const trendings = await KV.get("1");
    return {
      success: true,
      trendings
    };
  } catch (e) {
    console.log(e);
  }

  return {
    success: false
  };
});
