import { defineStore } from "pinia";
import { registerModuleHMR } from "~~/core/store";

export const useShareStore = defineStore({
  id: "ShareStore",
  state: () => ({
  }),
  actions: {
    /**
     * Share a link, using the Web Share API if available.
     * @param url url to share
     * @param fallbackUrl url to share as fallback
     * @param title title of the share
     * @param text text of the share
     * @param copyValue value to copy to clipboard
     */
    async share (url: string, fallbackUrl: string, title?: string, text?: string, copyValue?: string): Promise<void> {
      // Attempt to use the Web Share API
      try {
        await window.navigator.share({
          title,
          text,
          url
        });
      } catch (e) {
        if (fallbackUrl) {
          window.open(fallbackUrl, "_blank");
        } else if (copyValue) {
          navigator.clipboard.writeText(copyValue);
          useNuxtApp().$useNotification().push("Copied Share Link", "", 4, "");
        }
      }
    },
    /**
     * Copy a value to the clipboard
     * @param value content to copy
     * @param title title of the success notification
     */
    copy (value:string, title = "Copied Share Link") {
      navigator.clipboard.writeText(value);
      useNuxtApp().$useNotification().push(title, "", 4, "");
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useShareStore);
