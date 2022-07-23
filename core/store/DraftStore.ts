import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { registerModuleHMR } from ".";
import { TagType } from "~~/types/TagType";

export interface EditorTag {
  id: number;
  content: TagType;
}

export const useDraftStore = defineStore({
  id: "DraftStore",
  state: () => ({
    externalId: "",
    tags: [] as Array<EditorTag>,
    title: "",
    subtitle: "",
    content: "",
    lastSave: 0 // as timestamp
  }),
  actions: {
    async saveDraft (): Promise<void> {
      // check if the draft is not empty
      if (!(this.tags.length > 0) || !this.title || !this.subtitle || !this.content) {
        return;
      }

      // generate a new externalId if it is not set
      if (!this.externalId) {
        this.externalId = uuidv4();
      }

      // save the draft
      const success = await fetch(""); // TODO: implement call

      // handle the failure
      if (!success) {
        // TODO: handle error
      }

      this.lastSave = +new Date(); // update with the current timestamp
    },

    async loadDraft (): Promise<void> {
      // load the draft
      await fetch(""); // TODO: implement call
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useDraftStore);
