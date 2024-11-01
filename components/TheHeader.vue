<script setup>
import { useSettingSideBar } from '~/composables/states.ts'
const config = useRuntimeConfig()
const settingsSideBar = useSettingSideBar()
</script>

<template>
  <div class="the-header">
    <section class="py-0">
      <div class="flex justify-content-between align-items-center">
        <Logo class="mr-3" />
        <Button
          @click="settingsSideBar = true"
          icon="pi pi-bars"
          class="p-button-text"
          severity="secondary"
          aria-label="settings menu"
        />
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.the-header {
  background: var(--header-background);
  backdrop-filter: blur(4px);
  border-bottom: 1px solid var(--shade-400);
  height: var(--header-height);
  display: flex;
  .pi-bars {
    font-size: var(--font-size-7);
  }
  .p-button {
    background-color: transparent;
  }
}
</style>
