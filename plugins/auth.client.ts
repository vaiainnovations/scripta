import { useAuthStore } from "~~/core/store/AuthStore";
import { useNotificationStore } from "~~/core/store/NotificationStore";
import { useReactionStore } from "~~/core/store/ReactionStore";
import { useReportStore } from "~~/core/store/ReportStore";
import { useShareStore } from "~~/core/store/ShareStore";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      useAuth: () => useAuthStore(),
      useReaction: () => useReactionStore(),
      useReport: () => useReportStore(),
      useNotification: () => useNotificationStore(),
      useShare: () => useShareStore()
    }
  };
});
