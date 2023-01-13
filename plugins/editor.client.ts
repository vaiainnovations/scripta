import { defaultValueCtx, editorViewOptionsCtx, Editor, rootCtx } from "@milkdown/core";
import { useEditor } from "@milkdown/vue";
import { gfm, link, image, footnoteDefinition } from "@milkdown/preset-gfm";
import { listenerCtx, listener } from "@milkdown/plugin-listener";
import { upload, uploadPlugin } from "@milkdown/plugin-upload";
import { math, mathBlock } from "@milkdown/plugin-math";
import { history } from "@milkdown/plugin-history";
import { diagram } from "@milkdown/plugin-diagram";
import { emoji } from "@milkdown/plugin-emoji";
import { directiveFallback } from "@ezone-devops/milkdown-plugin-directive-fallback";
import { customBlock } from "~~/types/MilkDown/Block";
import { extendedMathBlock, extendedFootnoteDef } from "~~/types/MilkDown/CustomCommands";

import { customTheme } from "~~/types/MilkDown";
import { customMenu } from "~~/types/MilkDown/Menu";
import { useDraftStore } from "~~/core/store/DraftStore";
import { customUploader } from "~~/types/MilkDown/Uploader";
// import { iframePlugin } from "~~/types/MilkDown/IFrame";
import { videoPlugin } from "~~/types/MilkDown/Video";
import { customTooltip } from "~~/types/MilkDown/Tooltip";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      useMarkDownEditor: (readOnly = false, content = useDraftStore().content) => {
        return useEditor(root =>
          Editor.make()
            .use(
              gfm
                .replace(footnoteDefinition, extendedFootnoteDef())
                .configure(link, {
                  input: {
                    placeholder: "link",
                    buttonText: "Apply"
                  }
                })
                .configure(image, {
                  input: {
                    placeholder: "link",
                    buttonText: "Apply"
                  }
                })
            )
            .use(diagram)
            .use(emoji)
            .use(videoPlugin)
            .use(upload
              .configure(uploadPlugin, {
                uploader: customUploader
              }))
            .use(math
              .replace(mathBlock, extendedMathBlock())
              .configure(extendedMathBlock, { placeholder: { empty: "Insert Math Formula in TeX syntax", error: "Syntax Error" } }))
            .use(customMenu)
            .use(customTooltip)
            .use(customTheme(readOnly))
            .use(listener)
            .use(directiveFallback)
            .use(customBlock)
            .config((ctx) => {
              ctx.set(rootCtx, root);
              ctx.set(defaultValueCtx, content || "");
              ctx.get(listenerCtx).markdownUpdated((_, markdown) => {
                useDraftStore().content = markdown;
              });
              ctx.set(editorViewOptionsCtx, { editable: () => !readOnly });
            })
            .use(history) // cmd+z history
        );
      }
    }
  };
});
