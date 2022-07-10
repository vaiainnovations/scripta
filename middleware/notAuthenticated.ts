import { useAuthStore } from "../core/store/AuthStore";
export default defineNuxtRouteMiddleware(() => {
  if (process.client) {
  // Re-route to home if the AuthLevel is not None
    if (useAuthStore().hasAuthStorage()) {
      return navigateTo("/");
    }
  // Allow Not authenticated user
  }
});
