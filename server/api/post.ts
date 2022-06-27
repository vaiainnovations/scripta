import { PostKv } from "@/types/PostKv";

export default defineEventHandler(async () => {
  return await PostKv.get("test");
});
