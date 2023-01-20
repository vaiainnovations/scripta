import { defineStore } from "pinia";
import { useBackendStore } from "./BackendStore";
import { useUserStore } from "./UserStore";
import { registerModuleHMR } from ".";
import { UserReward } from "~~/types/UserReward";

export const useRewardStore = defineStore({
  id: "RewardStore",
  state: () => ({
    rewardsHistory: false as UserReward[] | false
  }),
  actions: {
    /**
     * Load user rewards
     */
    async updateUserRewardsHistory () {
      const { $useDesmosNetwork } = useNuxtApp();
      const updatedRewardsHistory: UserReward[] = [];
      try {
        const rewardsRaw = (await (
          await useBackendStore().fetch(
            `${useBackendStore().apiUrl}foster/user`,
            "POST",
            {}
          )
        ).json()) as [];

        for (const rewardRaw of (rewardsRaw as any)) {
          try {
            const reward: UserReward = {
              amount: [
                {
                  amount: Number(rewardRaw.amount) / 1_000_000,
                  denom: $useDesmosNetwork().coinDenom
                }
              ],
              hash: rewardRaw.hash,
              timestamp: new Date(rewardRaw.timestamp),
              type: rewardRaw.type
            };

            // Parse details if any
            try {
              const details = JSON.parse(rewardRaw.details);
              const fromAddress = details?.fromAddress || ""; // set fromAddress if any

              if (fromAddress) {
                let tipperDtag = "";
                try {
                  const tipperProfile = await useUserStore().getUser(fromAddress);
                  if (tipperProfile) { tipperDtag = tipperProfile.dtag; }
                } catch (e) { /* no profile */ }
                reward.from = {
                  address: fromAddress,
                  dtag: tipperDtag
                };
              }

              if (details.amount) {
                const detailsAmount = (rewardRaw.type === "MsgSend") ? details.amount : details.amount[0];
                if (detailsAmount.denom.toLowerCase() === $useDesmosNetwork().ucoinDenom) {
                  detailsAmount.denom = $useDesmosNetwork().coinDenom;
                  detailsAmount.amount = Number(detailsAmount.amount) / 1000000;
                }
                reward.amount = detailsAmount;
              }
            } catch (e) { /* no details */ }
            updatedRewardsHistory.push(reward);
          } catch (error) {
            console.error(error);
          }
        }
      } catch (e) {
        console.log(e);
      }
      this.rewardsHistory = [...updatedRewardsHistory];
    }
  }
});

// Register the store to enable HMR
registerModuleHMR(useRewardStore);
