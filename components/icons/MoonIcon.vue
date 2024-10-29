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
    class="moon-icon icon"
    :class="{ active: active }"
    viewBox="0 0 117 117"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="sleep icon"
  >
    <path
      d="M61.5219 117C27.599 117 0 89.3693 0 55.4101C0 31.8891 13.079 10.7553 34.1355 0.258482C35.0837 -0.211961 36.2229 -0.0292338 36.9682 0.716903C37.7143 1.46384 37.9069 2.60468 37.4418 3.55158C33.5995 11.3664 31.6526 19.769 31.6526 28.5183C31.6526 59.7631 57.0428 85.1826 88.2495 85.1826C97.0876 85.1826 105.56 83.1878 113.444 79.2612C114.391 78.7896 115.53 78.9723 116.275 79.7184C117.025 80.4666 117.213 81.6074 116.746 82.5527C106.317 103.799 85.1538 117 61.5219 117Z"
    />
  </svg>
</template>

<style lang="scss" scoped>
.moon-icon {
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
