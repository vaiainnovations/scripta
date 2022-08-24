import { useAuthStore } from "~~/core/store/AuthStore";
import { useWalletStore } from "~~/core/store/wallet/WalletStore";
export default defineNuxtPlugin(() => {
  /**
   * Override default `authenticated` guard
   * Ensure user is authenticated, otherwise redirect to auth page
   */
  addRouteMiddleware("authenticated", async (to) => {
    // check if user is authenticated
    const authStorage = useAuthStore().getAuthStorage();
    if (!authStorage) {
      console.log(`[Guard] ${to.path} not authenticated (no auth storage), re-routing`);
      return await navigateTo("/auth");
    }

    // check if the user has already a connected address (if first page load, the address is not set yet)
    // Note: call useWalletStore().retrieveCurrentWallet every time is slow!
    let address = "";
    try {
      address = (await useWalletStore().wallet.signer.getCurrentAccount()).address;
    } catch (e) {
      // signer not connected, not already connected
    }

    // connect to the wallet if the user is not connected
    if (!address) {
      await useWalletStore().retrieveCurrentWallet(authStorage.signer);
      address = (await useWalletStore().wallet.signer.getCurrentAccount()).address;
    }

    // check if the user is authenticated
    const storedAuthAccount = useAuthStore().getAuthStorageAccount(address);
    if (!storedAuthAccount) {
      return await navigateTo("/auth/session");
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
      const authStorage = useAuthStore().getAuthStorage();

      // check if the user has already a connected address (if first page load, the address is not set yet)
      // Note: call useWalletStore().retrieveCurrentWallet every time is slow!
      let address = "";
      try {
        address = (await useWalletStore().wallet.signer.getCurrentAccount()).address;
      } catch (e) {
      // signer not connected, not already connected
      }

      // connect to the wallet if the user is not connected
      if (!address) {
        await useWalletStore().retrieveCurrentWallet(authStorage.signer);
        address = (await useWalletStore().wallet.signer.getCurrentAccount()).address;
      }

      // check if the user is authenticated
      const storedAuthAccount = useAuthStore().getAuthStorageAccount(address);

      if (storedAuthAccount) {
        return await navigateTo("/");
      }
      console.log("[Guard] routing, is logged");
    }
  });
});
