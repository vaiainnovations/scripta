import { AuthLevel, useAuthStore } from "~~/core/store/AuthStore";
export default defineNuxtPlugin(() => {
  /**
   * Override default `authenticated` guard
   * Ensure user is authenticated, otherwise redirect to auth page
   */
  addRouteMiddleware("authenticated", async (to) => {
    useAuthStore().initOfflineSession(); // Ensure auth store is initialized and auth level is set

    if (useAuthStore().authLevel === AuthLevel.None) {
      console.log(`[Guard] ${to.path} not authenticated (no auth storage), re-routing`);
      return await navigateTo("/auth");
    }
  });

  /**
   * Override default `not-authenticated` guard
   * Ensure user is not authenticated, otherwise redirect to home page
   */
  addRouteMiddleware("not-authenticated", async (to) => {
    useAuthStore().initOfflineSession(); // Ensure auth store is initialized and auth level is set

    if (useAuthStore().authLevel >= AuthLevel.Session) {
      console.log(`[Guard] ${to.path} authenticated, re-routing`);
      return await navigateTo("/");
    }
  });
});
