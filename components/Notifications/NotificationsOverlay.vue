<script lang="ts" setup>
const { $useNotification } = useNuxtApp();
</script>

<template>
  <span v-if="$useNotification">
    <div>
      <span v-if="$useTransaction && ($useTransaction().queue.length>0)">
        <NotificationsWrapper :id="-1">
          <div v-if="$useTransaction().status==='waiting'">
            <TransactionsQueueOverlayWaiting />
          </div>
          <div v-if="$useTransaction().status==='connecting_wallet'">
            <TransactionsQueueOverlayConnectingWallet />
          </div>
          <div v-if="$useTransaction().status==='signing'">
            <TransactionsQueueOverlaySigning />
          </div>
          <div v-if="$useTransaction().status==='pending'">
            <TransactionsQueueOverlayPending />
          </div>
          <div v-if="$useTransaction().status==='success'">
            <TransactionsQueueOverlaySuccess />
          </div>
          <div v-if="$useTransaction().status==='failed'">
            <TransactionsQueueOverlayFailed />
          </div>
        </NotificationsWrapper>
      </span>
      <div
        v-for="notification in $useNotification().queue"
        :key="notification.id"
      >
        <NotificationsWrapper :id="notification.id">
          <div>
            <div class="flex flex-row gap-x-1 w-36">
              <img
                v-if="notification.icon"
                :src="notification.icon"
                class="h-5 w-5 object-contain my-auto"
              >
              <p v-if="notification.title" class="text-base font-medium">
                {{ notification.title }}
              </p>
            </div>
            <p v-if="notification.body" class="text-gray text-xs">
              {{ notification.body }}
            </p>
          </div>
        </NotificationsWrapper>
      </div>
    </div>
  </span>
</template>
