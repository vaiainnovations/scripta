import { useAuthStore } from "~~/core/store/AuthStore";
export default defineNuxtPlugin(() => {
  console.log("Loaded Client plugins");
  /**
   * Override default `authenticated` guard
   * Ensure user is authenticated, otherwise redirect to auth page
   */
  addRouteMiddleware("authenticated", async (to) => {
    // check if user is authenticated
    if (!useAuthStore().hasAuthStorage()) {
      console.log(`[Guard] ${to.path} not authenticated, re-routing`);
      return await navigateTo("/auth");
    }

    // check if user has an authorized session
    if (!useAuthStore().hasValidAuthAuthorization()) {
      console.log(`[Guard] ${to.path} not valid authorization, re-routing`);
      return await navigateTo("/auth/session");
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
