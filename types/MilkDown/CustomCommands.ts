import { setBlockType, wrapIn } from "@milkdown/prose/commands";
import { createCmd, createCmdKey } from "@milkdown/core";
// import { CommandsReady, createCmd, createCmdKey, MilkdownPlugin, commandsCtx, schemaCtx } from "@milkdown/core";
import { mathBlock } from "@milkdown/plugin-math";
import { footnoteDefinition } from "@milkdown/preset-gfm";

export const TurnIntoMathBlock = createCmdKey("TurnIntoMathBlock");
export const TurnIntoFootnoteDef = createCmdKey("TurnIntoFootnoteDef");
// export const TurnIntoFootnote = createCmdKey("TurnIntoFootnote");

export const extendedMathBlock = mathBlock.extend((original) => {
  return {
    ...original,
    commands: nodeType => [
      createCmd(TurnIntoMathBlock, () => setBlockType(nodeType))
    ]
  };
});

export const extendedFootnoteDef = footnoteDefinition.extend((original) => {
  return {
    ...original,
    commands: (nodeType, ctx) => [
      ...original.commands(nodeType, ctx),
      createCmd(TurnIntoFootnoteDef, () => wrapIn(nodeType))
    ]
  };
});

// export const customFootnote: MilkdownPlugin = () => async (ctx) => {
//   await ctx.wait(CommandsReady);
//   const commandManager = ctx.get(commandsCtx);
//   const schema = ctx.get(schemaCtx);

//   commandManager.create(TurnIntoFootnote, () => wrapIn(schema.nodes.footnote_definition));
// };
