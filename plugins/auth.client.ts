import { useAuthStore } from "~~/core/store/AuthStore";
import { useNotificationStore } from "~~/core/store/NotificationStore";
import { useReactionStore } from "~~/core/store/ReactionStore";
import { useReportStore } from "~~/core/store/ReportStore";
import { useRewardStore } from "~~/core/store/RewardStore";
import { useShareStore } from "~~/core/store/ShareStore";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      useAuth: () => useAuthStore(),
      useReaction: () => useReactionStore(),
      useReward: () => useRewardStore(),
      useReport: () => useReportStore(),
      useNotification: () => useNotificationStore(),
      useShare: () => useShareStore()
    }
  };
});
