import { AtomList, createNode } from "@milkdown/utils";
import { RemarkPlugin } from "@milkdown/core";
import directive from "remark-directive";
import { expectDomTypeError } from "@milkdown/exception";
import { InputRule } from "prosemirror-inputrules";

const id = "video";

const video = createNode<string>(utils => ({
  id,
  schema: () => ({
    // inline: true,
    group: "block",
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
      runner: (state, node, type) => {
        const attrs = node.attributes as {file: string, type: string};
        state.addNode(type, { file: attrs.file, type: attrs.type });
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
  ]
}));

export const videoPlugin = AtomList.create([video()]);
