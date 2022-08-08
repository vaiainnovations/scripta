import { Ctx } from "@milkdown/core";
import { blockPlugin, block, defaultConfigBuilder } from "@milkdown/plugin-block";

export const customBlock = block.configure(blockPlugin, {
  configBuilder: (ctx:Ctx) => defaultConfigBuilder(ctx).filter(el => el.id !== "task_list" && el.id !== "blockquote")
});
