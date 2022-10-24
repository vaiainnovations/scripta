import { useAuthStore } from "~~/core/store/AuthStore";
import { useReactionStore } from "~~/core/store/ReactionStore";
import { useReportStore } from "~~/core/store/ReportStore";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      useAuth: () => useAuthStore(),
      useReaction: () => useReactionStore(),
      useReport: () => useReportStore()
    }
  };
});
