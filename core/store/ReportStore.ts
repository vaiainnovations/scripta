import { defineStore } from "pinia";

import Long from "long";
import { PostTarget } from "@desmoslabs/desmjs-types/desmos/reports/v1/models";
import { MsgCreateReportEncodeObject } from "@desmoslabs/desmjs";
import { useDesmosStore } from "./DesmosStore";
import { useAccountStore } from "./AccountStore";
import { registerModuleHMR } from ".";

export const useReportStore = defineStore({
  id: "ReportStore",
  state: () => ({
    registeredReasons: [{
      id: 1,
      title: "General",
      descriptions: "",
      hasText: true
    }, {
      id: 2,
      title: "Violent or extreme content",
      descriptions: "",
      hasText: false
    }, {
      id: 3,
      title: "Bullying or harassment",
      descriptions: "",
      hasText: false
    }, {
      id: 4,
      title: "Terrorism",
      descriptions: "",
      hasText: false
    }, {
      id: 5,
      title: "Offensive",
      descriptions: "",
      hasText: false
    }]
  }),
  actions: {
    addPostReport (postId: Long, reasonsIds: number[], message: string) {
      const { $useTransaction } = useNuxtApp();
      const msgAddReport: MsgCreateReportEncodeObject = {
        typeUrl: "/desmos.reports.v1.MsgCreateReport",
        value: {
          subspaceId: Long.fromNumber(useDesmosStore().subspaceId),
          message,
          reasonsIds,
          reporter: useAccountStore().address,
          target: {
            typeUrl: "/desmos.reports.v1.PostTarget",
            value: PostTarget.encode({
              postId
            }).finish()
          }
        }
      };
      $useTransaction().push(msgAddReport, { scriptaOp: "MsgCreateReport" });
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useReportStore);
