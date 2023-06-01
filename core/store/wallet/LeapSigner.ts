import { AccountData, DirectSignResponse } from "@cosmjs/proto-signing";
import { ChainInfo, Keplr as Leap, Window as LeapWindow } from "@keplr-wallet/types";
import {
  ChainInfo as DesmJSChainInfo,
  DesmosMainnet,
  Signer,
  SignerStatus,
  SigningMode,
  getChainId,
  DesmosGasPriceStep,
  DesmosBech32Config
} from "@desmoslabs/desmjs";
import { SignDoc } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { Algo, AminoSignResponse, StdSignDoc } from "@cosmjs/amino";
import { assert } from "@cosmjs/utils";

export const DesmosBaseFeatures = [
  "stargate",
  "ibc-transfer",
  "cosmwasm",
  "no-legacy-stdTx",
  "ibc-go"
];

export async function setupChainInfo (
  chain: DesmJSChainInfo
): Promise<ChainInfo> {
  return {
    chainName: chain.chainName,
    chainId: await getChainId(chain),
    rpc: chain.rpcUrl,
    rest: chain.restUrl,
    bip44: chain.bip44,
    bech32Config: DesmosBech32Config,
    currencies: chain.currencies,
    feeCurrencies: chain.feeCurrencies.map(currency => ({
      ...currency,
      gasPriceStep: DesmosGasPriceStep
    })),
    stakeCurrency: chain.stakeCurrency,
    features: [...DesmosBaseFeatures]
  };
}

// Add LeapWindow types to the global Window interface
declare global {
  interface Window extends LeapWindow {}
}

export interface LeapSignerOptions {
  signingMode: SigningMode;
  chainInfo: DesmJSChainInfo;
}

/**
 * Signer that use Leap to sign a transaction.
 */
export class LeapSigner extends Signer {
  public readonly signingMode: SigningMode = SigningMode.DIRECT;

  private readonly client: Leap;

  private accountData: AccountData | undefined;

  private chainInfo: DesmJSChainInfo = DesmosMainnet;

  private leapChainInfo: ChainInfo | undefined;

  private readonly onKeystoreChange = () => {
    this.handleKeyStoreChange();
  };

  constructor (leapClient: Leap, options: LeapSignerOptions) {
    super(SignerStatus.NotConnected);
    this.signingMode = options.signingMode;
    this.chainInfo = options.chainInfo;
    this.client = leapClient;
  }

  /**
   * Subscribes to Leap events.
   * @private
   */
  private subscribeToEvents () {
    // Subscribe to the Leap Storage event
    window.addEventListener("leap_keystorechange", this.onKeystoreChange);
  }

  /**
   * Unsubscribes from Leap events.
   * @private
   */
  private unsubscribeFromEvents () {
    // Unsubscribe from the Leap Storage event
    window.removeEventListener("leap_keystorechange", this.onKeystoreChange);
  }

  /**
   * Handle the Leap keystore change event.
   */
  private async handleKeyStoreChange () {
    // disconnect from the current wallet
    await this.disconnect();

    // connect to the new wallet
    await this.connect();
  }

  /**
   * Returns the Leap ChainInfo instance to be used.
   * @private
   */
  private async getChainInfo (): Promise<ChainInfo> {
    if (!this.leapChainInfo) {
      this.leapChainInfo = await setupChainInfo(this.chainInfo);
    }
    return this.leapChainInfo;
  }

  /**
   * Implements Signer.
   */
  async connect (): Promise<void> {
    if (this.status !== SignerStatus.NotConnected && this.accountData) {
      return;
    }
    this.updateStatus(SignerStatus.Connecting);

    // Get the chain info
    const chainInfo = await this.getChainInfo();

    const account = await this.client.getKey(chainInfo.chainId);
    this.accountData = {
      address: account.bech32Address,
      algo: <Algo>account.algo,
      pubkey: account.pubKey
    };

    this.subscribeToEvents();

    // Connect Leap client to the current chainId
    await this.client.enable(chainInfo.chainId);

    this.updateStatus(SignerStatus.Connected);
  }

  /**
   * Implements Signer.
   */
  // eslint-disable-next-line require-await
  async disconnect (): Promise<void> {
    if (this.status !== SignerStatus.Connected) {
      return;
    }

    this.updateStatus(SignerStatus.Disconnecting);
    this.accountData = undefined;
    this.unsubscribeFromEvents();
    this.updateStatus(SignerStatus.NotConnected);
  }

  /**
   * Implements Signer.
   */
  // eslint-disable-next-line require-await
  async getCurrentAccount (): Promise<AccountData | undefined> {
    return this.accountData;
  }

  /**
   * Implements Signer.
   *
   */
  async getAccounts (): Promise<readonly AccountData[]> {
    this.assertConnected();

    // Get the chain info
    const chainInfo = await this.getChainInfo();

    const result = await this.client!.getKey(chainInfo.chainId);
    return [
      {
        address: result.bech32Address,
        algo: <Algo>result.algo,
        pubkey: result.pubKey
      }
    ];
  }

  /**
   * Implements OfflineDirectSigner.
   */
  async signDirect (
    signerAddress: string,
    signDoc: SignDoc
  ): Promise<DirectSignResponse> {
    this.assertConnected();
    assert(this.accountData);
    const chainInfo = await this.getChainInfo();
    return this.client.signDirect(chainInfo.chainId, signerAddress, signDoc);
  }

  /**
   * Implements OfflineDirectSigner.
   */
  async signAmino (
    signerAddress: string,
    signDoc: StdSignDoc
  ): Promise<AminoSignResponse> {
    this.assertConnected();
    assert(this.accountData);
    const chainInfo = await this.getChainInfo();
    return this.client.signAmino(chainInfo.chainId, signerAddress, signDoc);
  }

  /**
   * Prompt a new Leap Chain configuration.
   * @param chainInfo new chain configuration
   */
  public static async setupChainNetwork (chainInfo: ChainInfo): Promise<void> {
    assert(window.leap);
    await window.leap.experimentalSuggestChain(chainInfo);
  }

  /**
   * Switch to the given ChainInfo.
   * @param chainInfo chain configuration
   */
  public async switchChainNetwork (chainInfo: DesmJSChainInfo): Promise<void> {
    assert(window.leap);
    await this.disconnect();

    // Reset the chain info
    this.chainInfo = chainInfo;
    this.leapChainInfo = undefined;

    return this.connect();
  }

  /**
   * Get the current Desmos ChainInfo.
   */
  public getCurrentChainNetwork (): DesmJSChainInfo {
    return this.chainInfo;
  }

  /**
   * Get the current Leap ChainInfo.
   * NOTE: This can be undefined if the client has not connected yet.
   */
  public getCurrentChainInfo (): ChainInfo | undefined {
    return this.leapChainInfo;
  }
}
