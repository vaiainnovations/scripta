<template>
  <AuthContentCard>
    <AuthDescription>
      <p class="text-2xl font-extrabold">
        Ledger Login
      </p>
      <div>
        <p class="text-lg">
          Login with your Ledger device, and approve the authorization
        </p>
        <p class="text-sm text-gray">
          Always make sure to connect from
          <b><a class="text-green">https://</a>scripta.network</b>
        </p>
      </div>
    </AuthDescription>
    <AuthStatusCard>
      <img
        src="/svg/wallet/ledger/logo.svg"
        class="object-fill h-32"
      >
      <div>
        <ClientOnly>
          <!-- Select App -->
          <span
            v-if="!useNuxtApp().$useLedgerAuth().selectedApp"
          >
            <h3>1. Connect with a Ledger App</h3>
            <div
              v-for="app in useNuxtApp().$useLedgerAuth().supportedLedgerApps"
              :key="app.id"
              class="bg-[#8c53b2c1] hover:bg-[#8C53B2] w-full p-1 px-3 my-2 text-white rounded-xl text-sm cursor-pointer"
              @click="setSelectedLedgerApp(app)"
            >
              <div class="flex px-2">
                <img :src="app.icon" alt="" class="h-7 w-7">
                <h1 class="ml-2 my-auto text-xl select-none">
                  {{ app.name }} app
                </h1>
              </div>
            </div>
          </span>

          <!-- Connect Ledger device  -->
          <span v-if="useNuxtApp().$useLedgerAuth().selectedApp">
            <h3 class="text-center">2. Connect you Ledger to the device</h3>
            <div class="p-1 my-3">
              <img src="/svg/spinner/dots.svg" alt="" class="mx-auto w-12">
            </div>
          </span>
        </ClientOnly>
        <p class="text-xs text-danger mt-2 text-center">
          {{ ledgerError }}
        </p>
      </div>
    </AuthStatusCard>
  </AuthContentCard>
</template>

<script setup lang="ts">
import { LedgerApp } from "~~/core/store/wallet/LedgerStore";

const ledgerError = ref("");

onMounted(() => {
  resetLedger();
});

/**
 * Set Ledger App to use
 */
function setSelectedLedgerApp (app: LedgerApp) {
  resetLedger();
  useNuxtApp().$useLedgerAuth().setSelectedApp(app);
  connectLedger();
}
async function connectLedger () {
  try {
    await useNuxtApp().$useLedgerAuth().connect();
  } catch (e: any) {
    ledgerError.value = e;
    resetLedger();
  }
}

/**
 * Connect Ledger device
 */
/* async function connectLedger () {
  const { $useLedgerAuth } = useNuxtApp();
  ledgerError.value = "";
  const isSupportedWebHID = await TransportWebHID.isSupported();
  if (!isSupportedWebHID) {
    ledgerError.value = "WebHID not supported";
    resetLedger();
    return;
  }

  // Connect to Ledger device
  try {
    $useLedgerAuth().transport = await TransportWebHID.create();
    if (!$useLedgerAuth().transport) {
      ledgerError.value = "Transport not created";
      resetLedger();
      return;
    }

    // Handle device disconnection
    $useLedgerAuth().transport!.on("disconnect", () => {
      ledgerError.value = "Ledger disconnected";
      resetLedger();
    });

    const hdPath = stringToPath($useLedgerAuth().selectedApp!.hdPath);
    const launchpad = new LedgerConnector($useLedgerAuth().transport!, {
      ledgerAppName: $useLedgerAuth().selectedApp?.id,
      minLedgerAppVersion: $useLedgerAuth().selectedApp?.minVersion,
      prefix: "desmos",
      hdPaths: [hdPath]
    });

    try {
      const address = await launchpad.getCosmosAddress();
      const version = await launchpad.getCosmosAppVersion();
      if (address && version) {
        $useLedgerAuth().isConnected = true;
        console.log(address);
      }
    } catch (e) {
      console.log(e);
      ledgerError.value = `Open the ${$useLedgerAuth().selectedApp?.name} app on your Ledger`;
      resetLedger();
      return;
    }
  } catch (e) {
    ledgerError.value = "Ledger is disconnected";
    resetLedger();
  }
} */

function resetLedger () {
  const { $useLedgerAuth } = useNuxtApp();
  $useLedgerAuth().transport?.close().catch(); // Close transport if open
  $useLedgerAuth().transport = null;
  $useLedgerAuth().selectedApp = null;
  $useLedgerAuth().isConnected = false;
}
</script>
