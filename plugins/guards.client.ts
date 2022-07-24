import { useAuthStore } from "~~/core/store/AuthStore";
console.log("Defining Client guards");
export default defineNuxtPlugin(() => {
  /**
   * Override default `authenticated` guard
   * Ensure user is authenticated, otherwise redirect to auth page
   */
  addRouteMiddleware("authenticated", async (to) => {
    if (!useAuthStore().hasAuthStorage()) {
      console.log(`[Guard] ${to.path} not authenticated, re-routing`);
      return await navigateTo("/auth");
    }
  });

  /**
   * Override default `not-authenticated` guard
   * Ensure user is not authenticated, otherwise redirect to home page
   */
  addRouteMiddleware("not-authenticated", async () => {
    if (useAuthStore().hasAuthStorage()) {
      console.log("[Guard] routing, is logged");
      return await navigateTo("/");
    }
  });
});
