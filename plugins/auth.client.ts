import { useAuthStore } from "~~/core/store/AuthStore";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      useAuth: () => useAuthStore()
    }
  };
});
