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
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    :class="{ active: active }"
    aria-label="download icon"
    class="download-icon o-icon"
    viewBox="0 0 32 32"
  >
    <path
      d="M28 16h-5l-7 7-7-7h-5l-4 8v2h32v-2l-4-8zM0 28h32v2h-32v-2zM18 10v-8h-4v8h-7l9 9 9-9h-7z"
    ></path>
  </svg>
</template>

<style lang="scss" scoped>
.download-icon {
  height: 28px;
  width: 28px;
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
