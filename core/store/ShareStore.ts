import { defineStore } from "pinia";
import { registerModuleHMR } from ".";

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
     */
    async share (url: string, fallbackUrl: string, title?: string, text?: string): Promise<void> {
      // Attempt to use the Web Share API
      try {
        await window.navigator.share({
          title,
          text,
          url
        });
      } catch (e) {
        window.open(fallbackUrl, "_blank");
      }
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useShareStore);
