/**
 * Prevent direct access to the route
 */
export default defineNuxtRouteMiddleware((to, from) => {
  if (from.fullPath === to.fullPath) {
    return navigateTo("/");
  }
});
