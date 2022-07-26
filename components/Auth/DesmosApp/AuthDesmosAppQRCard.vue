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
import { WalletConnectSigner } from "@desmoslabs/desmjs-walletconnect";
import QrcodeVue from "qrcode.vue";

const { $useWalletConnect, $useWallet } = useNuxtApp();
// Create and initializer the WalletConnect signer without QR modal
const signer = await $useWalletConnect().connect();

const wcUrl = ref(getWalletConnectUrl(signer));
await $useWallet().connect(signer, "walletconnect");

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
