<template>
  <AuthContentCard>
    <AuthDescription>
      <p class="text-2xl font-extrabold">
        Open and Scan.
      </p>
      <div>
        <p class="text-lg">
          Open your Desmos mobile App, and scan the QR code.
        </p>
        <p class="text-sm text-gray">
          Always make sure to scan QR codes from
          <b><a class="text-green">https://</a>scripta.network</b>
        </p>
      </div>
    </AuthDescription>
    <AuthStatusCard>
      <QrcodeVue :value="wcUrl" :size="200" background="#FCF4E8" level="L" />
    </AuthStatusCard>
  </AuthContentCard>
</template>

<script setup lang="ts">
import QrcodeVue from "qrcode.vue";
import { SigningMode } from "@desmoslabs/desmjs";
import { WalletConnect, WalletConnectSigner } from "@desmoslabs/desmjs-walletconnect";

// Create and initializer the WalletConnect signer
const signer = new WalletConnectSigner(new WalletConnect({
  bridge: "https://bridge.walletconnect.org"
}), {
  signingMode: SigningMode.AMINO
});
await signer.connect();
const wcUrl = ref(getWalletConnectUrl(signer));

/**
 * Generate WalletConnect socket URL to display as QR code.
 * @param signer WalletConnect signer
 * @return WalletConnect socket URL
 */
function getWalletConnectUrl (signer: WalletConnectSigner): string {
  const wc = (signer as any).client;
  const key = (wc.key as Int32Array).toString();
  return `wc:${wc.handshakeTopic}@1?bridge=${encodeURIComponent(wc.bridge)}&key=${key}`;
}
</script>
