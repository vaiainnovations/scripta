import { AuthLevel, useAuthStore } from "../core/store/AuthStore";
export default defineNuxtRouteMiddleware((from) => {
  if (process.client) {
  // Re-route to home if the AuthLevel is not None
    if (useAuthStore().authLevel !== AuthLevel.None) {
      // ignore redirect if /auth/*
      if (from.path.includes("auth")) {
        return;
      }
      return navigateTo("/");
    }
  // Allow Not authenticated user
  }
});
