import { mathBlock } from "@milkdown/plugin-math";
import { AtomList, createPlugin } from "@milkdown/utils";
import remarkMath from "remark-math";

// By default the Milkdown math plugin is injected with the inline Math options
// Create a custom version without it
const nodes = AtomList.create([mathBlock()/* no mathInline() here */]);
const remarkPlugin = createPlugin(() => {
  return {
    remarkPlugins: () => [remarkMath]
  };
});
export const math = AtomList.create([remarkPlugin(), ...nodes]);
