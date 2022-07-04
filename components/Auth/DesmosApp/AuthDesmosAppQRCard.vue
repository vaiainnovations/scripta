<template>
  <AuthContentCard>
    <AuthDescription>
      <p class="text-2xl font-extrabold">Open and Scan.</p>
      <div>
        <p class="text-lg">
          Open your Desmos mobile App, and scan the QR code.
        </p>
        <p class="text-sm text-gray">
          Always make sure to scan QR codes from https://scripta.network
        </p>
      </div>
    </AuthDescription>
    <AuthStatusCard>
      <QrcodeVue :value="wcUrl" :size="200" background="#FCF4E8" level="L" />
      <AuthStatusButton class="bg-[#FFA756]">
        Connect
      </AuthStatusButton>
    </AuthStatusCard>
  </AuthContentCard>
</template>

<script setup lang="ts">
import QrcodeVue from "qrcode.vue";
import { SigningMode } from "@desmoslabs/desmjs";
import { WalletConnect, WalletConnectSigner } from "@desmoslabs/desmjs-walletconnect";

const signer = new WalletConnectSigner(new WalletConnect({
  bridge: "https://2F.walletconnect.org"
}), {
  signingMode: SigningMode.AMINO
});
await signer.connect();
const wcUrl = ref(getWalletConnectUrl(signer));

function getWalletConnectUrl (signer: WalletConnectSigner): string {
  const wc = (signer as any).client;
  const key = (wc.key as Int32Array).toString();
  return `wc:${wc.handshakeTopic}@1?bridge=${encodeURIComponent(wc.bridge)}&key=${key}`;
}
</script>
