import { AtomList, createNode } from "@milkdown/utils";
import { commandsCtx, ThemeInputChipType, createCmd, createCmdKey, RemarkPlugin } from "@milkdown/core";
import directive from "remark-directive";
import { expectDomTypeError } from "@milkdown/exception";

import { InputRule } from "prosemirror-inputrules";
import { findSelectedNodeOfType } from "@milkdown/prose";
import { EditorView } from "@milkdown/prose/view";
import { Plugin, PluginKey } from "@milkdown/prose/state";

export const ModifyVideo = createCmdKey<string>("ModifyVideo");
export const InsertVideo = createCmdKey<string>("InsertVideo");
const id = "video";
export type VideoOptions = {
  input: {
    placeholder: string,
    buttonText?: string
  }
};

const key = new PluginKey("MILKDOWN_VIDEO_INPUT");

const video = createNode<string, VideoOptions>((utils, options) => ({
  id,
  schema: () => ({
    // inline: true,
    group: "block",
    marks: "",
    selectable: true,
    defining: true,
    isolating: true,
    attrs: {
      file: { default: null },
      type: { default: null }
    },
    parseDOM: [
      {
        tag: "video",
        getAttrs: (dom) => {
          if (!(dom instanceof HTMLElement)) {
            throw expectDomTypeError(dom);
          }
          const sourceElement = dom.querySelector("source");
          return {
            file: sourceElement.getAttribute("src"),
            type: sourceElement.getAttribute("type")
          };
        }
      }
    ],
    toDOM: node => [
      "video",
      {
        controls: "",
        class: utils.getClassName(node.attrs, "video-container")
      },
      [
        "source",
        { src: node.attrs.file, type: node.attrs.type },
        0
      ]
    ],
    parseMarkdown: {
      match: node => node.type === "leafDirective" || node.name === "video",
      runner: (state, node, nodeType) => {
        const attrs = node.attributes as {file: string, type: string};
        state.addNode(nodeType, { file: attrs.file, type: attrs.type });
      }
    },
    toMarkdown: {
      match: node => node.type.name === id,
      runner: (state, node) => {
        state.addNode("leafDirective", undefined, undefined, {
          name: "video",
          attributes: {
            file: node.attrs.file,
            type: node.attrs.type
          }
        });
      }
    }
  }),
  remarkPlugins: () => [directive as RemarkPlugin],
  inputRules: nodeType => [
    new InputRule(/::video\{(?:file="(?<file>[^"]+)?")?\s*(?:type="(?<type>[^"]+)?")?\}/, (state, match, start, end) => {
      const [okay, file = "", type = ""] = match;
      const { tr } = state;
      if (okay) {
        tr.replaceWith(start, end, nodeType.create({ file, type }));
      }

      return tr;
    })
  ],
  commands: nodeType => [
    createCmd(InsertVideo, (file = "", type = "video/mp4") => (state, dispatch) => {
      if (!dispatch) { return true; }
      const { tr } = state;
      const node = nodeType.create({ file, type });
      if (!node) {
        return true;
      }
      const _tr = tr.replaceSelectionWith(node);
      dispatch(_tr.scrollIntoView());
      return true;
    }),
    createCmd(ModifyVideo, (file = "", type = "video/mp4") => (state, dispatch) => {
      const node = findSelectedNodeOfType(state.selection, nodeType);
      if (!node) { return false; }

      const { tr } = state;
      dispatch?.(
        tr.setNodeMarkup(node.pos, undefined, { ...node.node.attrs, loading: true, file, type }).scrollIntoView()
      );

      return true;
    })
  ],
  prosePlugins: (nodeType, ctx) => {
    return [
      new Plugin({
        key,
        view: (editorView) => {
          const inputChipRenderer = utils.themeManager.get<ThemeInputChipType>("input-chip", {
            placeholder: options?.input?.placeholder ?? "Input Video Link",
            buttonText: options?.input?.buttonText,
            onUpdate: (value) => {
              ctx.get(commandsCtx).call(ModifyVideo, value);
            }
          });
          if (!inputChipRenderer) { return {}; }
          const shouldDisplay = (view: EditorView) => {
            return Boolean(
              view.hasFocus() && nodeType && findSelectedNodeOfType(view.state.selection, nodeType)
            );
          };
          const getCurrentLink = (view: EditorView) => {
            const result = findSelectedNodeOfType(view.state.selection, nodeType);
            if (!result) { return; }

            const value = result.node.attrs.file;
            return value;
          };
          const renderByView = (view: EditorView) => {
            if (!view.editable) {
              return;
            }
            const display = shouldDisplay(view);
            if (display) {
              inputChipRenderer.show(view);
              inputChipRenderer.update(getCurrentLink(view));
            } else {
              inputChipRenderer.hide();
            }
          };
          inputChipRenderer.init(editorView);
          renderByView(editorView);

          return {
            update: (view, prevState) => {
              const isEqualSelection =
                            prevState?.doc.eq(view.state.doc) && prevState.selection.eq(view.state.selection);
              if (isEqualSelection) { return; }

              renderByView(view);
            },
            destroy: () => {
              inputChipRenderer.destroy();
            }
          };
        }
      })
    ];
  }
}));

export const videoPlugin = AtomList.create([video()]);
