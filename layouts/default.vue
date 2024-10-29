<script setup lang="ts">
const route = useRoute()
useHead({
  bodyAttrs: {
    class: 'template-default'
  }
})
</script>

<template>
  <div class="page" :class="[`${String(route.name)}`]">
    <div class="top-safe-cover" />
    <!-- <header :class="[{ show: route.name === 'home' }]" class="mb-3"> -->
    <header class="show mb-3">
      <VSmartHeader :hero-buffer="400" :resume-delay="0">
        <TheHeader />
      </VSmartHeader>
    </header>
    <main>
      <div class="content">
        <slot />
      </div>
    </main>
    <BottomMenu />
  </div>
</template>

<style lang="scss">
header {
  .v-smart-header {
    margin-top: var(--header-height) !important;
    transition: margin-top var(--transition-duration) ease;
  }
}
header.show {
  .v-smart-header {
    margin-top: 0 !important;
  }
}
</style>

<style lang="scss" scoped>
.content {
  z-index: 10;
  position: relative;
}
</style>
