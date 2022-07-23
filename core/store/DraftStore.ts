import { defineStore } from "pinia";
import { registerModuleHMR } from ".";
import { TagType } from "~~/types/TagType";

export interface EditorTag {
    id: number;
    content: TagType;
}

export const useDraftStore = defineStore({
  id: "DraftStore",
  state: () => ({
    tags: [] as Array<EditorTag>,
    title: "asddas",
    subtitle: "asddas",
    content: ""
  }),
  getters: {

  },
  actions: {
  }
});

// Register the store to enable HMR
registerModuleHMR(useDraftStore);
