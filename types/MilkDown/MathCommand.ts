import { setBlockType } from "@milkdown/prose/commands";
import { createCmd, createCmdKey } from "@milkdown/core";
import { mathBlock } from "@milkdown/plugin-math";

export const TurnIntoMathBlock = createCmdKey("TurnIntoMathBlock");

export const extendedMathBlock = mathBlock.extend((original) => {
  return {
    ...original,
    commands: nodeType => [
      createCmd(TurnIntoMathBlock, () => setBlockType(nodeType))
    ]
  };
});
