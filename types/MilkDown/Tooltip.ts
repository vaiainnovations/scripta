import { Ctx, schemaCtx, commandsCtx } from "@milkdown/core";
import { tooltip, tooltipPlugin, createToggleIcon, Item } from "@milkdown/plugin-tooltip";
import type { Icon } from "@milkdown/design-system";
import { EditorView } from "@milkdown/prose/view";
import { NodeType } from "@milkdown/prose/model";
import { isTextSelection } from "./Utilities";

const createNodeIcon = (
  icon: Icon,
  node: NodeType | undefined,
  // disableForMark: NodeType | undefined,
  onClick: string,
  options?: number
): Item => ({
  icon,
  onClick: (ctx: Ctx) => () => ctx.get(commandsCtx).call(onClick, options),
  isHidden: () => (view: EditorView) => !isTextSelection(view.state),
  isActive: () => () => false,
  canAddToDOM: () => (view: EditorView) => !!node && !!view.state.schema.nodes[node.name]
});

const customButtons = (ctx: Ctx) => {
  const marks = ctx.get(schemaCtx).marks;
  const nodes = ctx.get(schemaCtx).nodes;
  return [
    createToggleIcon("bold", "ToggleBold", marks.strong, marks.code_inline),
    createToggleIcon("italic", "ToggleItalic", marks.em, marks.code_inline),
    createToggleIcon("strikeThrough", "ToggleStrikeThrough", marks.strike_through, marks.code_inline),
    createToggleIcon("inlineCode", "ToggleInlineCode", marks.code_inline, marks.link),
    createToggleIcon("link", "ToggleLink", marks.link, marks.code_inline),
    createNodeIcon("h1", nodes.heading, "TurnIntoHeading", 1),
    createNodeIcon("h2", nodes.heading, "TurnIntoHeading", 2),
    createNodeIcon("h3", nodes.heading, "TurnIntoHeading", 3)
  ];
};

export const customTooltip = tooltip
  .configure(tooltipPlugin, {
    bottom: false,
    items: customButtons
  });
