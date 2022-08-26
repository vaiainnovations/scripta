import { Buffer } from "buffer";
import { defineStore } from "pinia";
import { EncodeObject } from "@cosmjs/proto-signing";
import { MsgGrantEncodeObject } from "@desmoslabs/desmjs";
import { Timestamp } from "cosmjs-types/google/protobuf/timestamp";
import { MsgRevoke } from "cosmjs-types/cosmos/authz/v1beta1/tx";
import { Profile } from "@desmoslabs/desmjs-types/desmos/profiles/v3/models_profile";
import { GenericAuthorization } from "cosmjs-types/cosmos/authz/v1beta1/authz";
import { useDesmosStore } from "./DesmosStore";
import { useBackendStore } from "./BackendStore";
import { registerModuleHMR } from ".";

export interface MsgRevokeEncodeObject extends EncodeObject {
  typeUrl: "/cosmos.authz.v1beta1.MsgRevoke";
  readonly value: MsgRevoke;
}

export const useAccountStore = defineStore({
  id: "AccountStore",
  state: () => ({
    address: "",
    profile: null as Profile,
    balance: 0,
    isNewProfile: false,
    sectionId: 0,
    settings: {
      hasAcceptedPrivacy: true,
      hasAcceptedAdvertisement: false,
      hasAcceptedCookies: false
    },
    authz: {
      DEFAULT_AUTHORIZATIONS: ["/desmos.posts.v2.MsgCreatePost", "/desmos.posts.v2.MsgEditPost", "/desmos.posts.v2.MsgDeletePost"/* , "/desmos.profiles.v3.MsgSaveProfile" */],
      hasAuthz: false,
      grantExpiration: null as Date || null,
      grantGrantee: ""
    }
  }),
  getters: {
  },
  actions: {
    async getUserSection (forceCreateSection = false) {
      try {
        const res = await (await useBackendStore().fetch(`${useBackendStore().apiUrl}user/get/${this.address}`, "POST", {
          "Content-Type": "application/json"
        }, JSON.stringify({
          forceCreateSection
        }))).json() as any; // TODO: wrap response as type/obj
        if (res) {
          this.sectionId = Number(res.sectionId);
          // TODO: store also the other infos
        }
        console.log(res);
      } catch (e) {
        console.log(e);
      }
    },
    async getUserInfo () {
      try {
        const res = await (await useBackendStore().fetch(`${useBackendStore().apiUrl}user/${this.address}`, "GET", {})).json() as any;
        if (res) {
          this.sectionId = Number(res.sectionId);
          this.authz.grantExpiration = (res?.grantExpiration) ? new Date(res?.grantExpiration) : null;
          this.authz.grantGrantee = res?.grantGrantee || "";
          try {
            if (new Date(res?.grantExpiration) > new Date(Date.now())) {
              this.authz.hasAuthz = true;
            }
          } catch (e) {}
        }
      } catch (e) {
        console.log(e);
      }
    },
    async grantAuthorizations () {
      const { $useTransaction } = useNuxtApp();
      const grants = [] as MsgGrantEncodeObject[];

      this.authz.DEFAULT_AUTHORIZATIONS.forEach((authorization) => {
        grants.push({
          typeUrl: "/cosmos.authz.v1beta1.MsgGrant",
          value: {
            grantee: this.authz.grantGrantee,
            granter: useAccountStore().address,
            grant: {
              authorization: {
                typeUrl: "/cosmos.authz.v1beta1.GenericAuthorization",
                value: GenericAuthorization.encode(GenericAuthorization.fromPartial({
                  msg: authorization
                })).finish()
              },
              expiration: Timestamp.fromPartial({
                nanos: 0,
                seconds: (+new Date() / 1000) + 60 * 60 * 24 * 3 // + 1 day
              })
            }
          }
        }
        );
      });
      const signed = await $useTransaction().directSign(grants, "Signed from Scripta", useDesmosStore().defaultFee, 1);
      if (!signed) {
        return false;
      }

      try {
        const res = (await (
          await useBackendStore().fetch(
            `${useBackendStore().apiUrl}authz`,
            "POST",
            {
              "Content-Type": "application/json"
            },
            JSON.stringify({
              grant: Buffer.from(signed).toString("base64")
            })
          )
        ).json()) as any; // TODO: wrap response as type/obj
        console.log(res);
      } catch (e) {
        return false;
      }
      return true;
    },
    async revokeAuthorizations (): Promise<boolean> {
      const { $useTransaction } = useNuxtApp();
      const revokes = [] as MsgRevokeEncodeObject[];
      this.authz.DEFAULT_AUTHORIZATIONS.forEach((revokeType) => {
        revokes.push({
          typeUrl: "/cosmos.authz.v1beta1.MsgRevoke",
          value: {
            granter: useAccountStore().address,
            grantee: useAccountStore().authz.grantGrantee,
            msgTypeUrl: revokeType
          }
        });
      });
      const signed = await $useTransaction().directSign(revokes, "Signed from Scripta", useDesmosStore().defaultFee, 1);

      try {
        (await (
          await useBackendStore().fetch(
            `${useBackendStore().apiUrl}authz/delete`,
            "POST",
            {
              "Content-Type": "application/json"
            },
            JSON.stringify({
              grant: Buffer.from(signed).toString("base64")
            })
          )
        ).json()) as any; // TODO: wrap response as type/obj
      } catch (e) {
        console.log(e);
        return false;
      }
      return true;
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useAccountStore);
