import { AtomList, createNode } from "@milkdown/utils";
import { RemarkPlugin } from "@milkdown/core";
import directive from "remark-directive";
import { InputRule } from "prosemirror-inputrules";

const id = "video";

const video = createNode(() => ({
  id,
  schema: () => ({
    inline: true,
    group: "inline",
    marks: "",
    attrs: {
      file: { default: null },
      type: { default: null }
    },
    parseDOM: [
      {
        tag: "video",
        getAttrs: (dom) => {
          if (!(dom instanceof HTMLElement)) {
            throw new TypeError("DOM not an instance");
          }
          const sourceElement = dom.querySelector("source");
          return {
            file: sourceElement.getAttribute("src"),
            type: sourceElement.getAttribute("type")
          };
        }
      }
    ],
    toDOM: node => ["video", { controls: "" }, ["source", { src: node.attrs.file, type: node.attrs.type }]],
    parseMarkdown: {
      match: node => node.type === "leafDirective" && node.name === "video",
      runner: (state, node, type) => {
        state.addNode(type, { file: (node.attributes as { file: string }).file, type: (node.attributes as { type: string }).type });
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
    new InputRule(/::video\{(file="(?<file>[^"]+)?")?\W?(type="(?<type>[^"]+)?")?\}/, (state, match, start, end) => {
      const [okay, file = "", type = ""] = match;
      const { tr } = state;
      if (okay) {
        tr.replaceWith(start, end, nodeType.create({ file, type }));
      }

      return tr;
    })
  ]
}));

export const videoPlugin = AtomList.create([video()]);
