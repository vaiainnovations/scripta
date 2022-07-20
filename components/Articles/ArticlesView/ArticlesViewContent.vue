<template>
  <div class="flex flex-col gap-y-3">
    <p class="text-3xl font-bold text-primary-text lg:text-5xl xl:text-6xl">
      {{ props.title }}
    </p>
    <p class="text-xl font-medium text-primary-text-light lg:text-2xl xl:text-3xl">
      A decentralized censorship-resistant blog platform running on blockchain.
    </p>
    <ArticlesViewUser :user="props.user" />
    <div class="pt-7">
      <p class="text-xl font-medium text-primary-text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dapibus ante vel nisl consequat tincidunt. Vestibulum et diam nisi. Proin a
        justo sit amet libero cursus porttitor. Nam lectus enim, volutpat vitae tellus suscipit, dapibus sollicitudin nibh. Maecenas accumsan, massa
        quis mollis posuere, purus mi scelerisque lorem, id porta felis arcu fermentum ante. Curabitur malesuada maximus metus, in tincidunt mi
        scelerisque a. Sed et finibus dui. Mauris euismod at nisi ut dapibus. Mauris pharetra ligula nec pharetra pharetra. Vestibulum metus nibh,
        malesuada sed facilisis vel, dapibus dignissim nisl. Lorem Ipsum Maecenas sed tortor dapibus, finibus ipsum eu, condimentum lorem. Cras varius
        tincidunt cursus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed ac fringilla turpis, et efficitur
        sem. Donec convallis pellentesque nisi, sit amet accumsan sem tincidunt non. Ut quis nibh justo. Vestibulum nec augue sem. Vivamus tempor sem
        eu nibh volutpat condimentum. Vestibulum ac efficitur nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dapibus ante vel
        nisl consequat tincidunt. Vestibulum et diam nisi. Proin a justo sit amet libero cursus porttitor. Nam lectus enim, volutpat vitae tellus
        suscipit, dapibus sollicitudin nibh. Maecenas accumsan, massa quis mollis posuere, purus mi scelerisque lorem, id porta felis arcu fermentum
        ante. Curabitur malesuada maximus metus, in tincidunt mi scelerisque a. Sed et finibus dui. Mauris euismod at nisi ut dapibus. Mauris pharetra
        ligula nec pharetra pharetra. Vestibulum metus nibh, malesuada sed facilisis vel, dapibus dignissim nisl.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface UserType {
  name: string,
  date: string,
  image: string
}

interface Props {
  title: string
  user: UserType
}

const props = defineProps<Props>();
</script>
