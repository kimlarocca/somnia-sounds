<script setup>
const props = defineProps({
  active: {
    type: Boolean,
    default: false
  }
})
const { $gsap } = useNuxtApp()
const thisIcon = ref(null)
const stars = ref(null)
let anim = null

onMounted(() => {
  stars.value = thisIcon.value.getElementsByClassName('stars')
  anim = $gsap.to(stars.value, {
    duration: 0.6,
    repeat: -1,
    yoyo: true,
    opacity: 0.4,
    scale: 0.9,
    transformOrigin: '0% 50%',
    ease: 'power1.inOut',
    stagger: 0.3,
    paused: true
  })
})

onUnmounted(() => {
  if (anim) {
    anim.kill()
  }
})

watchEffect(() => {
  if (props.active && stars.value) {
    anim.play()
  } else {
    if (anim) {
      anim.pause()
    }
  }
})
</script>
<template>
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    role="img"
    aria-label="sleep icon"
    class="sleep-icon o-icon"
    :class="{ active: active }"
    ref="thisIcon"
  >
    <path
      d="M16 6.038v-2.038h4v-2c0-1.105-0.895-2-2-2h-6c-1.105 0-2 0.895-2 2v2h4v2.038c-6.712 0.511-12 6.119-12 12.962 0 7.18 5.82 13 13 13s13-5.82 13-13c0-6.843-5.288-12.451-12-12.962zM22.071 26.071c-1.889 1.889-4.4 2.929-7.071 2.929s-5.182-1.040-7.071-2.929c-1.889-1.889-2.929-4.4-2.929-7.071s1.040-5.182 2.929-7.071c1.814-1.814 4.201-2.844 6.754-2.923l-0.677 9.813c-0.058 0.822 0.389 1.181 0.995 1.181s1.053-0.36 0.995-1.181l-0.677-9.813c2.552 0.079 4.94 1.11 6.754 2.923 1.889 1.889 2.929 4.4 2.929 7.071s-1.040 5.182-2.929 7.071z"
    />
  </svg>
</template>

<style lang="scss" scoped>
.sleep-icon {
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
