import { defineStore } from "pinia";

import Long from "long";
import { PostTarget } from "@desmoslabs/desmjs-types/desmos/reports/v1/models";
import { MsgCreateReportEncodeObject } from "@desmoslabs/desmjs";
import { registerModuleHMR } from "~~/core/store";
import { useAccountStore } from "~~/core/store/AccountStore";

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
      const { $useTransaction, $useDesmosNetwork } = useNuxtApp();
      const target = {
        typeUrl: "/desmos.reports.v1.PostTarget",
        value: PostTarget.encode({
          postId: Long.fromNumber(postId)
        }).finish()
      };
      const msgAddReport: MsgCreateReportEncodeObject = {
        typeUrl: "/desmos.reports.v1.MsgCreateReport",
        value: {
          subspaceId: Long.fromNumber($useDesmosNetwork().subspaceId),
          message,
          reasonsIds,
          reporter: useAccountStore().address,
          target
        }
      };
      $useTransaction().push(msgAddReport, {
        subspaceId: Long.fromNumber($useDesmosNetwork().subspaceId),
        message,
        reasonsIds,
        reporter: useAccountStore().address,
        postId,
        scriptaOp: "MsgCreateReport"
      });
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useReportStore);
