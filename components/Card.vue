<script setup>
// TEMP fix to make ripple work
import { usePrimeVue } from 'primevue/config'

const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})

const $primevue = usePrimeVue()
defineExpose({
  $primevue
})
</script>

<template>
  <div v-if="item" class="card-large mb-4 p-ripple">
    <div class="top" v-if="item?.image">
      <img :src="item.image" alt="item.title" />
    </div>
    <div class="bottom flex flex-column gap-2 justify-content-between">
      <div class="flex flex-column gap-2">
        <h4 class="mb-2">
          {{ item.title }}
        </h4>
        <p v-html="item.tease" class="mb-3" />
      </div>
      <div class="flex justify-content-between align-items-center">
        <slot name="play" />
        <slot name="favorite" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.card-large {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  max-width: 248px;
  background-color: var(--background2);
  position: relative;
  .bottom {
    padding: 1rem;
    height: 100%;
  }
}
</style>
