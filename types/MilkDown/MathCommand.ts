import { createCmdKey, MilkdownPlugin, CommandsReady, commandsCtx, schemaCtx } from "@milkdown/core";
import { setBlockType } from "prosemirror-commands";

export const TurnIntoMathBlock = createCmdKey("TurnIntoMathBlock");

export const mathPlugin: MilkdownPlugin = () => async (ctx) => {
  // wait for command manager ready
  await ctx.wait(CommandsReady);

  const commandManager = ctx.get(commandsCtx);
  const schema = ctx.get(schemaCtx);

  commandManager.create(TurnIntoMathBlock, () => setBlockType(schema.nodes.math_block));
};
