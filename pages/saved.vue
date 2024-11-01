<script setup>
import { useCurrentUserFavorites } from '~/composables/states'
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

const favorites = useCurrentUserFavorites()

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
      <div class="grid">
        <div
          class="col col-6 md:col-4 xl:col-3 mb-3"
          v-for="item in favorites"
          :key="item.id"
        >
          <Item :data="item" />
        </div>
      </div>
    </section>
  </div>
</template>
