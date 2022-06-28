import { TrendingPostKv } from "~~/types/TrendingPostKv";

export default defineEventHandler(async () => {
  return await TrendingPostKv.get("1");
});
