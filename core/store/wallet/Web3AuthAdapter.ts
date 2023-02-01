import { Buffer } from "buffer";
import { ModalConfig, Web3Auth } from "@web3auth/modal";
import {
  Observer,
  PrivateKey,
  PrivateKeyProvider,
  PrivateKeyProviderStatus,
  PrivateKeyType
} from "@desmoslabs/desmjs";
import { fromHex } from "@cosmjs/encoding";
import { ADAPTER_EVENTS, WALLET_ADAPTERS, WALLET_ADAPTER_TYPE } from "@web3auth/base";
import { LOGIN_MODAL_EVENTS } from "@web3auth/ui";

/**
 * Options used during the logout.
 * See https://web3auth.io/docs/sdk/web/modal/usage#web3authlogout for more details.
 */
interface Web3AuthLogoutOptions {
  cleanup: boolean;
}

/**
 * Web3Auth options.
 */
export interface Web3AuthPrivateKeyProviderOptions {
  /**
   * Configurations passed to web3auth when initializing the modal.
   * See https://web3auth.io/docs/sdk/web/modal/whitelabel#modalconfig for more details.
   */
  modalConfig?: Record<WALLET_ADAPTER_TYPE, ModalConfig>;
  /**
   * Options passed to the web3auth.logout method.
   * See https://web3auth.io/docs/sdk/web/modal/usage#web3authlogout for more details.
   */
  logoutOptions?: Web3AuthLogoutOptions;
}

/**
 * Class capable of providing a private key received through web3auth.
 */
export class Web3AuthPrivateKeyProvider extends PrivateKeyProvider {
  private readonly we3auth: Web3Auth;

  private readonly modalConfig?: Record<WALLET_ADAPTER_TYPE, ModalConfig>;

  private readonly logoutOptions?: Web3AuthLogoutOptions;

  private subscribeToEvents = (web3auth: Web3Auth) => {
    web3auth.on(ADAPTER_EVENTS.DISCONNECTED, () => {
      this.updateStatus(PrivateKeyProviderStatus.Disconnecting);
      this.updateStatus(PrivateKeyProviderStatus.NotConnected);
    });
    web3auth.on(LOGIN_MODAL_EVENTS.MODAL_VISIBILITY, (visibility: boolean) => {
      // Handle login cancel from user when close the popup
      if (
        !visibility &&
        this.we3auth.status !== "connected" &&
        this.status === PrivateKeyProviderStatus.Connecting
      ) {
        this.updateStatus(PrivateKeyProviderStatus.NotConnected);
      }
    });
    web3auth.on(ADAPTER_EVENTS.ERRORED, (error) => {
      // eslint-disable-next-line no-console
      console.error("ADAPTER_EVENTS.ERRORED", error);
    });
  };

  constructor (web3auth: Web3Auth, options?: Web3AuthPrivateKeyProviderOptions) {
    super();
    this.we3auth = web3auth;
    this.modalConfig = options?.modalConfig;
    this.subscribeToEvents(this.we3auth);
    this.logoutOptions = options?.logoutOptions;
  }

  async getPrivateKey (): Promise<PrivateKey> {
    const hexEncodedPrivateKey = (await this.we3auth.provider!.request({
      method: "private_key"
    })) as string;

    return {
      type: PrivateKeyType.Secp256k1,
      key: fromHex(hexEncodedPrivateKey)
    };
  }

  async connect (): Promise<void> {
    this.updateStatus(PrivateKeyProviderStatus.Connecting);
    // user has already connected to web3auth
    if (this.hasStorage()) {
      try {
        // the user may be already connected to web3auth, so we can just initialize the sdk
        await this.we3auth.init();
        const user = await this.we3auth.getUserInfo(); // check if the user connected with a valid session by retrieving the user info
        if (!user) {
          // user is not connected, so we need to logout
          await this.disconnect();
          return;
        }
        return;
      } catch (e) {
        // user is not connected, so we need to logout
        await this.disconnect();
        return;
      }
    } else {
      await this.we3auth.initModal({
        modalConfig: this.modalConfig
      });
    }

    const eventEmitter = await this.we3auth.connect();

    if (eventEmitter === null) {
      this.updateStatus(PrivateKeyProviderStatus.NotConnected);
      throw new Error("error while connecting to web3auth");
    }

    this.updateStatus(PrivateKeyProviderStatus.Connected);
  }

  addStatusListener (observer: Observer<PrivateKeyProviderStatus>): void {
    /*  */
  }

  async disconnect (): Promise<void> {
    this.updateStatus(PrivateKeyProviderStatus.Disconnecting);

    try {
      await this.we3auth.logout(this.logoutOptions);
      localStorage.removeItem("openlogin_store");
    } catch (e) {
      this.updateStatus(PrivateKeyProviderStatus.NotConnected);
      throw e;
    }

    this.updateStatus(PrivateKeyProviderStatus.NotConnected);
  }

  hasStorage (): boolean {
    try {
      const store = localStorage.getItem("openlogin_store");
      if (store) {
        try {
          const decoded = JSON.parse(store);
          const sessionId = decoded.sessionId;

          // this is fast way to check if the token is expired
          const idToken = JSON.parse(Buffer.from(decoded.idToken.split(".")[1], "base64").toString());
          const exp = idToken.exp;
          const now = (Math.floor(+new Date() / 1000));
          if (now < exp && sessionId) {
            return true;
          }
        } catch (e) { }
      }
    } catch (e) { }
    return false;
  }
}
