<template>
  <AuthContentCard>
    <AuthDescription>
      <p class="text-2xl font-extrabold">
        Open and Scan.
      </p>
      <div>
        <p class="text-lg">
          Open your WalletConnect App, and scan the QR code.
        </p>
        <p class="text-sm text-gray">
          Always make sure to scan QR codes from https://scripta.network
        </p>
      </div>
    </AuthDescription>
    <AuthStatusCard>
      <img
        class="object-fill h-44"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/QR_icon.svg/240px-QR_icon.svg.png"
      >
      <AuthStatusButton class="bg-[#177AFD]" @click="connect()">
        Connect
      </AuthStatusButton>
    </AuthStatusCard>
  </AuthContentCard>
</template>

<script setup lang="ts">
import { SigningMode } from "@desmoslabs/desmjs";
import { WalletConnect, WalletConnectSigner } from "@desmoslabs/desmjs-walletconnect";
import QRCodeModal from "@walletconnect/qrcode-modal";

async function connect () {
  const signer = new WalletConnectSigner(new WalletConnect({
    bridge: "https://bridge.walletconnect.org",
    qrcodeModal: QRCodeModal
  }), {
    signingMode: SigningMode.AMINO
  });
  await signer.connect();
}
</script>
