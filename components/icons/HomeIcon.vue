<script setup>
const props = defineProps({
  active: {
    type: Boolean,
    default: false
  }
})
</script>
<template>
  <svg
    :class="{ active: active }"
    class="home-icon icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    role="img"
    aria-label="home icon"
  >
    <path d="M32 19l-6-6v-9h-4v5l-6-6-16 16v1h4v10h10v-6h4v6h10v-10h4z" />
  </svg>
</template>

<style lang="scss" scoped>
.home-icon {
  path {
    fill: var(--text-color);
  }
  &.active {
    path {
      fill: var(--light-blue);
    }
  }
}
</style>
