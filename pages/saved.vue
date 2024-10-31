<script setup>
import { getFavoritedItems } from '~/utilities/helpers'
definePageMeta({
  layout: 'default',
  layoutTransition: {
    name: 'login'
  }
})

useHead({
  bodyAttrs: {
    class: 'show-header'
  }
})

const favorites = ref(null)
onMounted(async () => {
  await getFavoritedItems()
})
</script>

<template>
  <div>
    <Html lang="en">
      <Head>
        <Title>Somnia Sounds | Saved</Title>
        <Meta name="og:title" content="Somnia Sounds | Saved" />
        <Meta name="twitter:title" content="Somnia Sounds | Saved" />
      </Head>
    </Html>

    <section>
      <h1 class="mb-4">Saved</h1>
      <p class="mb-4">Coming soon!</p>
      <p>{{ favorites }}</p>
    </section>
  </div>
</template>
