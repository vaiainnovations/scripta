import { AuthLevel, useAuthStore } from "./../core/store/AuthStore";
export default defineNuxtRouteMiddleware(() => {
  if (process.client) {
    // Re-route to home if the AuthLevel is None
    if (useAuthStore().authLevel === AuthLevel.None) {
      return navigateTo("/auth");
    }
    // Allow authenticated user
  }
});
