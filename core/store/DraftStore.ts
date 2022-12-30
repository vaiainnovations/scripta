import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import Long from "long";
import { useBackendStore } from "./BackendStore";
import { useAccountStore } from "./AccountStore";
import { registerModuleHMR } from ".";
import { TagType } from "~~/types/TagType";

export interface EditorTag {
  id: number;
  content: TagType;
}

export const useDraftStore = defineStore({
  id: "DraftStore",
  state: () => ({
    id: Long.fromNumber(-1),
    externalId: "",
    tags: [] as Array<EditorTag>,
    title: "",
    subtitle: "",
    content: "",
    lastSave: null as Date // as timestamp
  }),
  actions: {
    async saveDraft (): Promise<void> {
      // check if the draft is not empty
      if (!this.title && !this.subtitle && !this.content && !(this.tags.length > 0)) {
        return;
      }
      // generate a new externalId if not set
      if (!this.externalId) {
        this.externalId = uuidv4();
      }

      // save the draft
      const success = await useBackendStore().fetch(`${useBackendStore().apiUrl}posts/${this.externalId}`, "POST", {
        "Content-Type": "application/json"
      }, JSON.stringify({
        draft: true,
        text: this.title,
        subtitle: this.subtitle,
        content: this.content,
        author: useAccountStore().address,
        sectionId: 0,
        entities: {},
        creationDate: new Date(Date.now()),
        lastEditedDate: new Date(Date.now()),
        tags: this.tags.map(tag => tag.content.value)
      })
      );

      // handle the failure
      if (!success) {
        // TODO: handle error
      }

      this.lastSave = new Date(Date.now()); // update with the current timestamp
    },

    async deleteDraft () {
      await useBackendStore().fetch(`${useBackendStore().apiUrl}posts/${this.externalId}`, "POST", {
        "Content-Type": "application/json"
      },
      JSON.stringify({
        draft: true
      })
      );
      useDraftStore().$reset();
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useDraftStore);
