<template>
  <img
    ref="image"
    :alt="props.alt || ''"
    :src="imageSrc || '/img/author_pic.png'"
    :class="imgClass || ''"
    @load="loaded"
    @error="handleError"
  >
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useConfigStore } from "~~/core/store/ConfigStore";
interface Props {
  imgClass: string;
  imgUrl: string;
  alt?: string;
}

const props = defineProps<Props>();
const image = ref<HTMLElement | null>(null);

// an array of available IPFS gateways
const gateways = [
  "https://cloudflare-ipfs.com/ipfs/",
  "https://dweb.link/ipfs/",
  useConfigStore().ipfsGateway,
  "https://ipfs.io/ipfs/"
];
const currentGatewayIndex = ref(0); // current gateway in use
const imageSrc = ref(""); // image in use with the current gateway
const isLoaded = ref(false); // true if correctly loaded
const isIpfs = ref(false); // true if it's an IPFS iamge

onMounted(() => {
  loadImage(); // first attempt to load the image
});
function loaded () {
  isLoaded.value = true; // fired by the <img /> element
}

function loadImage () {
  const match = props.imgUrl.match(/\/ipfs\/([a-zA-Z0-9]+)/);
  const cid = match ? match[1] : null; // check if the image src has a valid cid
  isIpfs.value = cid === null;
  if (cid === null) { // the image is not loaded from an IPFS source (ex. external link)
    imageSrc.value = props.imgUrl; // keep the original value
    return;
  }
  imageSrc.value = `${gateways[currentGatewayIndex.value]}${cid}`; // update with the current gateway

  // set a timeout representing the maximum wait time to load an image
  setTimeout(() => {
    if (isLoaded.value === false) {
      // if not loaded after the max time, handle the failure with a new gateway
      handleError();
    }
  }, 6500);
}

function handleError () {
  // check if doesn't already tried all the available gateways
  if (currentGatewayIndex.value < gateways.length - 1 && isIpfs) {
    currentGatewayIndex.value += 1; // select the next gateway
    // console.log(`Requesting a fallback IPFS image at ${gateways[currentGatewayIndex.value]}, failed ${props.imgUrl}`);
    loadImage(); // reload the image with the new gateway
  } else {
    imageSrc.value = "/img/author_pic.png"; // no more tries, use a template image
  }
}
</script>
