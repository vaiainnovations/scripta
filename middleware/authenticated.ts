import { useAuthStore } from "./../core/store/AuthStore";
export default defineNuxtRouteMiddleware((to) => {
  if (process.client) {
    // Re-route to home if the AuthLevel is None
    if (!useAuthStore().hasAuthStorage()) {
      console.log(`[Guard] ${to.path} not authenticated, re-routing`);
      return navigateTo("/auth");
    }
    // Allow authenticated user
  }
});
