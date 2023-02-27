
import { SupportedSigner } from "./SupportedSigner";

export interface StoreAuthAccount {
    address: string,
    signer: SupportedSigner,
    authorization: string,
    accountNumber: number,
  }

interface StoredAuthData {
  version: number, // version of the auth storage
  accounts: StoreAuthAccount[], // list of the stored auth accounts
  sessionIndex: number, // index of the current session auth account
}

export class AuthStorage {
  static STORAGE_KEY = "auth"; // key of the auth storage
  static STORAGE_VERSION = 3; // version of the auth storage

  /**
   * Migrate the auth storage to the latest version
   */
  public static migrate () {
    const authStorage = AuthStorage.getStoredAuthData();
    switch (authStorage.version) {
    case 2:
      // version 2->3 differ only by the replacement of the `signer` field with `sessionIndex`
      localStorage.removeItem(AuthStorage.STORAGE_KEY); // remove the old storage
      authStorage.version = 3; // update the version
      authStorage.sessionIndex = -1; // set the default session index
      if (authStorage.accounts.length > 0) { // if there are accounts
        const v2signer = authStorage.signer || ""; // get the signer of the v2 storage
        if (v2signer !== "") { // if the signer is not empty
          authStorage.sessionIndex = authStorage.accounts.findIndex(account => account.signer === v2signer); // search the index of the account with the same signer
        }
      }
      delete authStorage.signer; // delete the old signer field
      AuthStorage.setStoredAuthData(authStorage);
      break;

    default:
      break;
    }
  }

  /**
  * Recover StoredAuthData from the localStorage or create a new one
  * @returns StoredAuthData
  */
  private static getStoredAuthData (): StoredAuthData {
    let authStorage: StoredAuthData = { version: AuthStorage.STORAGE_VERSION, accounts: [], sessionIndex: -1 }; // prepare a new auth storage
    const rawStorage = localStorage.getItem(AuthStorage.STORAGE_KEY);
    if (!rawStorage || rawStorage === null) {
      AuthStorage.setStoredAuthData(authStorage);
    }
    try {
      const parsedStorage = JSON.parse(rawStorage!); // if the storage exists and is valid, we use it
      if (parsedStorage !== null) { // ensure that the parsed storage is not null
        authStorage = parsedStorage;
      }
    } catch (error) {
      // If the storage is corrupted, we store the new one
      AuthStorage.setStoredAuthData(authStorage);
    }
    return authStorage;
  }

  /**
  * Store the new StoredAuthData in the localStorage
  * @param storedAuthData AuthData to store
  */
  private static setStoredAuthData (storedAuthData: StoredAuthData): void {
    localStorage.setItem(AuthStorage.STORAGE_KEY, JSON.stringify(storedAuthData)); // store the new auth storage
  }

  /**
  * Set the active account
  * @param index index of the account to set as active
  */
  public static setActiveAccount (index: number): void {
    const storedAuthData = AuthStorage.getStoredAuthData(); // get the stored auth data
    if (storedAuthData.accounts.length >= index) { // check if the index is valid
      storedAuthData.sessionIndex = index; // set the index of the current session auth account
      AuthStorage.setStoredAuthData(storedAuthData); // store the new auth storage
    } else {
      console.error("Invalid account index");
    }
  }

  /**
  * Store locally auth Account data
  * @param value StoreAuthAccount to store
  */
  public static setAccount (value: StoreAuthAccount): void {
    const storedAuthData = AuthStorage.getStoredAuthData();
    let index = 0;
    const oldIndex = storedAuthData.accounts.findIndex(account => account.address === value.address); // search the index of the account in storage
    if (oldIndex >= 0) {
      index = oldIndex;
      // if the account is already stored, we update it
      storedAuthData.accounts[index] = value;
    } else {
      // if the account is not stored, we add it
      storedAuthData.accounts.push(value);
      index = storedAuthData.accounts.length - 1;
    }
    storedAuthData.sessionIndex = index; // set the index of the current session auth account
    AuthStorage.setStoredAuthData(storedAuthData); // store the new auth storage
  }

  /**
  * Retrieve locally stored StoreAuthAccount by address
  * @param address - address of the account to retrieve
  */
  public static getByAddress (address: string): StoreAuthAccount | null {
    const storedAuthData = AuthStorage.getStoredAuthData();
    return storedAuthData.accounts.find(account => account.address === address) || null;
  }

  /**
  * Retrieve locally stored StoreAuthAccount by index
  * @param index - index of the account to retrieve
  */
  private static getByIndex (index: number): StoreAuthAccount | null {
    const storedAuthData = AuthStorage.getStoredAuthData();
    return storedAuthData.accounts[index] || null;
  }

  /**
  * Retrieve locally stored StoreAuthAccount by session index
  */
  public static getBySessionIndex (): StoreAuthAccount | null {
    const storedAuthData = AuthStorage.getStoredAuthData();

    // if the session index is < 0 it is a new empty storage, we return null
    if (storedAuthData.sessionIndex < 0) {
      return null;
    }
    const value = AuthStorage.getByIndex(storedAuthData.sessionIndex);
    if (!value) {
      // if the session index is not valid, we delete the session index and return null
      storedAuthData.sessionIndex = -1;
      AuthStorage.setStoredAuthData(storedAuthData);
    }
    return value;
  }

  /**
  * Delete an account from the storage by string
  * @param address - address of the account to delete
  */
  public static deleteByAddress (address: string): void {
    const storedAuthData = AuthStorage.getStoredAuthData();
    const index = storedAuthData.accounts.findIndex(account => account.address === address);
    if (index >= 0) {
      storedAuthData.accounts.splice(index, 1);
      AuthStorage.setStoredAuthData(storedAuthData); // store the new auth storage
    }
  }

  /**
  * Delete an account from the storage by index
  * @param index - index of the account to delete
  */
  private static deleteByIndex (index: number): void {
    const storedAuthData = AuthStorage.getStoredAuthData();
    storedAuthData.accounts.splice(index, 1);
    AuthStorage.setStoredAuthData(storedAuthData); // store the new auth storage
  }

  public static deleteBySessionIndex (): void {
    const storedAuthData = AuthStorage.getStoredAuthData();
    AuthStorage.deleteByIndex(storedAuthData.sessionIndex);
  }
}
