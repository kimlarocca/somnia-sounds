<script setup lang="ts">
import { getAndSetUserProfile } from '~/utilities/helpers'
useHead({
  bodyAttrs: {
    class:
      'no-bottom-padding hide-bottom-menu background-gradient style-mode-dark'
  }
})

definePageMeta({
  layout: 'default'
})

const user = useSupabaseUser()
watch(
  user,
  async () => {
    if (user.value) {
      await nextTick()
      await getAndSetUserProfile()
      navigateTo('/')
    }
  },
  { immediate: true }
)
</script>
<template>
  <section class="loading-holder">
    <ProgressSpinner />
  </section>
</template>

<style lang="scss" scoped>
.loading-holder {
  display: flex;
  position: absolute;
  height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  width: 100vw;
  left: 0;
  right: 0;
}
</style>
