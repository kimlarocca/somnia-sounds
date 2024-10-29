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
    class="star-icon icon"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    role="img"
    aria-label="star icon"
  >
    <path
      d="M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798z"
    />
  </svg>
</template>

<style lang="scss" scoped>
.star-icon {
  path {
    fill: var(--text-color);
  }
  &.favorite {
    width: 24px;
    height: 24px;
  }
  &.active {
    path {
      fill: var(--light-blue);
    }
  }
  &.favorited {
    path {
      fill: var(--orange);
    }
  }
}
</style>
