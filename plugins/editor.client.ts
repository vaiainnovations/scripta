import { defaultValueCtx, editorViewOptionsCtx, Editor, rootCtx } from "@milkdown/core";
import { useEditor } from "@milkdown/vue";
import { gfm, link, image } from "@milkdown/preset-gfm";
import { listenerCtx, listener } from "@milkdown/plugin-listener";
import { tooltip, tooltipPlugin } from "@milkdown/plugin-tooltip";
import { upload, uploadPlugin } from "@milkdown/plugin-upload";
import { math, mathBlock } from "@milkdown/plugin-math";
import { diagram } from "@milkdown/plugin-diagram";
import { emoji } from "@milkdown/plugin-emoji";
// import { directiveFallback } from "@ezone-devops/milkdown-plugin-directive-fallback";
import { extendedMathBlock } from "~~/types/MilkDown/MathCommand";
// import { block } from "@milkdown/plugin-block";

import { customTheme } from "~~/types/MilkDown";

import { customMenu } from "~~/types/MilkDown/Menu";
import { useDraftStore } from "~~/core/store/DraftStore";
import { customUploader } from "~~/types/MilkDown/Uploader";
// import { iframePlugin } from "~~/types/MilkDown/IFrame";
import { videoPlugin } from "~~/types/MilkDown/Video";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      useMarkDownEditor: (readOnly = false, content = useDraftStore().content) => {
        return useEditor(root =>
          Editor.make()
            // .use(iframePlugin)
            // .use(directiveFallback)
            .use(
              gfm
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

            .use(upload.configure(uploadPlugin, {
              uploader: customUploader
            }))
            .use(math
              .replace(mathBlock, extendedMathBlock())
              .configure(extendedMathBlock, { placeholder: { empty: "Insert Math Formula in TeX syntax", error: "Syntax Error" } }))
            // .use(block)
            .use(customMenu)
            .use(
              tooltip.configure(tooltipPlugin, {
                bottom: false
              })
            )
            .use(customTheme(readOnly))
            .use(listener)
            .config((ctx) => {
              ctx.set(rootCtx, root);
              ctx.set(defaultValueCtx, content);
              ctx.get(listenerCtx).markdownUpdated((_, markdown) => {
                useDraftStore().content = markdown;
              });
              ctx.set(editorViewOptionsCtx, { editable: () => !readOnly });
            })
        );
      }
    }
  };
});
