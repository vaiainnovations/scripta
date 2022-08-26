/**
 * Prevent direct access to the route
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  if (from.fullPath === to.fullPath) {
    return await navigateTo("/");
  }
});
