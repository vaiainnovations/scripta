<template>
  <AuthContentCard>
    <AuthDescription>
      <p class="text-2xl font-extrabold">
        Connect
      </p>
      <div>
        <p class="text-lg">
          Click Continue and approve the authorization
        </p>
        <p class="text-sm text-gray">
          Always make sure to scan QR codes from https://scripta.network
        </p>
      </div>
    </AuthDescription>
    <AuthStatusCard>
      <img src="/svg/wallet/keplr/logo.svg" class="object-fill h-32">
      <AuthStatusButton class="bg-[#8C53B2]" @click="connect()">
        Connect
      </AuthStatusButton>
    </AuthStatusCard>
  </AuthContentCard>
</template>

<script setup lang="ts">

import { StdFee } from "@cosmjs/amino";
import { MsgCreatePostEncodeObject } from "@desmoslabs/desmjs";
import { ReplySetting } from "@desmoslabs/desmjs-types/desmos/posts/v1/models";
import Long from "long";
import { useKeplrStore } from "~~/core/store/wallet/KeplrStore";
import { useWalletStore } from "~~/core/store/wallet/WalletStore";

async function connect () {
  await useKeplrStore().connect();
  await testTx();
}

async function testTx () {
  const defaultFee: StdFee = {
    amount: [{
      amount: "8750",
      denom: "udaric"
    }],
    gas: "130000"
  };
  const wallet = useWalletStore().wallet;
  const client = await wallet.client;
  const account = await wallet.signer.getCurrentAccount();
  const postMsg: MsgCreatePostEncodeObject = {
    typeUrl: "/desmos.posts.v1.MsgCreatePost",
    value: {
      author: account.address,
      subspaceId: Long.fromNumber(1),
      externalId: "test-id",
      entities: {
        hashtags: [{
          start: Long.fromNumber(0),
          end: Long.fromNumber(1),
          tag: "hello"
        }],
        mentions: [],
        urls: []
      },
      text: "#Test",
      replySettings: ReplySetting.REPLY_SETTING_EVERYONE,
      conversationId: Long.fromNumber(0),
      sectionId: 0,
      attachments: [],
      referencedPosts: []
    }
  };
  console.log(account.address);
  const broadcastResult = await client.signAndBroadcast(account.address, [postMsg], defaultFee, "Post Test");
  console.log(broadcastResult);
}
</script>
