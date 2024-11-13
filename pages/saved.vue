<script setup>
import { useCurrentUser, useCurrentUserFavorites } from '~/composables/states'
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

const currentUser = useCurrentUser()
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

    <section v-if="currentUser">
      <h1 class="mb-4">Saved</h1>
      <div v-if="favorites?.length > 0" class="grid">
        <div
          class="col col-6 md:col-4 xl:col-3 mb-3"
          v-for="item in favorites"
          :key="item.id"
        >
          <Item :data="item" />
        </div>
      </div>
      <p v-else>You haven't added any saved items yet.</p>
    </section>
    <AccountPromptSideBar v-else />
  </div>
</template>
