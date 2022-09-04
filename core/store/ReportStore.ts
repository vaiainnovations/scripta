import { defineStore } from "pinia";
/* import { useBackendStore } from "./BackendStore"; */

import Long from "long";
/* import { PostTarget } from "@desmoslabs/desmjs-types/desmos/reports/v1/models"; */
import { MsgCreateReport } from "@desmoslabs/desmjs-types/desmos/reports/v1/msgs";
import { PostTarget } from "@desmoslabs/desmjs-types/desmos/reports/v1/models";
import { EncodeObject } from "@desmoslabs/desmjs";
import { useDesmosStore } from "./DesmosStore";
import { useAccountStore } from "./AccountStore";
import { registerModuleHMR } from ".";

export interface MsgCreateReportEncodeObject extends EncodeObject {
  readonly typeUrl: "/desmos.reports.v1.MsgCreateReport";
  readonly value: MsgCreateReport;
}

export const useReportStore = defineStore({
  id: "ReportStore",
  state: () => ({
  }),
  actions: {
    addPostReport (postId: Long, reasonsIds: number[]) {
      console.log(postId, reasonsIds);
      const { $useTransaction } = useNuxtApp();
      const msgAddReport: MsgCreateReportEncodeObject = {
        typeUrl: "/desmos.reports.v1.MsgCreateReport",
        value: {
          subspaceId: Long.fromNumber(useDesmosStore().subspaceId),
          message: "",
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
      $useTransaction().push(msgAddReport, {
      });
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useReportStore);
