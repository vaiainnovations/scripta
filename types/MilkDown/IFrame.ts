import { AtomList, createNode } from "@milkdown/utils";
import { RemarkPlugin } from "@milkdown/core";
import directive from "remark-directive";
import { InputRule } from "prosemirror-inputrules";

const id = "iframe";

const iframe = createNode(() => ({
  id,
  schema: () => ({
    inline: true,
    attrs: {
      src: { default: null }
    },
    group: "inline",
    marks: "",
    parseDOM: [
      {
        tag: "iframe",
        getAttrs: (dom) => {
          if (!(dom instanceof HTMLElement)) {
            throw new TypeError("DOM not an instance");
          }
          return {
            src: dom.getAttribute("src")
          };
        }
      }
    ],
    toDOM: node => ["iframe", { ...node.attrs, class: "iframe" }, 0],
    parseMarkdown: {
      match: node => node.type === "textDirective" && node.name === "iframe",
      runner: (state, node, type) => {
        state.addNode(type, { src: (node.attributes as { src: string }).src });
      }
    },
    toMarkdown: {
      match: node => node.type.name === id,
      runner: (state, node) => {
        state.addNode("textDirective", undefined, undefined, {
          name: "iframe",
          attributes: {
            src: node.attrs.src
          }
        });
      }
    }
  }),
  remarkPlugins: () => [directive as RemarkPlugin],
  inputRules: nodeType => [
    new InputRule(/:iframe\{src="(?<src>[^"]+)?"?\}/, (state, match, start, end) => {
      const [okay, src = ""] = match;
      const { tr } = state;
      if (okay) {
        tr.replaceWith(start, end, nodeType.create({ src }));
      }

      return tr;
    })
  ]
}));

export const iframePlugin = AtomList.create([iframe()]);
