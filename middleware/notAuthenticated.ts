import { useAuthStore } from "../core/store/AuthStore";
export default defineNuxtRouteMiddleware(() => {
  if (process.client) {
  // Re-route to home if the AuthLevel is not None
    if (useAuthStore().hasAuthStorage()) {
      console.log("[Guard] routing, is logged");
      return navigateTo("/");
    }
  // Allow Not authenticated user
  }
});
