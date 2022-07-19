import { useAuthStore } from "../core/store/AuthStore";
export default defineNuxtRouteMiddleware(async () => {
  if (process.client) {
  // Re-route to home if the AuthLevel is not None
    if (useAuthStore().hasAuthStorage()) {
      console.log("[Guard] routing, is logged");
      return await navigateTo("/");
    }
  // Allow Not authenticated user
  }
});
