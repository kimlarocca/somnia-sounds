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
  <div v-if="item" class="card h-full p-ripple">
    <div class="top" v-if="item?.image">
      <img :src="item.image" :alt="item.title" class="w-full" />
    </div>
    <div class="bottom flex flex-column gap-2 justify-content-between">
      <div class="flex flex-column gap-2">
        <h4 class="mb-2">
          {{ item.title }}
        </h4>
        <p v-html="item.tease" class="text-xs mb-3" />
      </div>
      <div class="flex justify-content-between align-items-center">
        <slot name="play" />
        <slot name="favorite" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  max-width: 100%;
  background-color: var(--background2);
  position: relative;
  p {
    // truncate text to 200 charachters and add an ellipsis if it's more
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .top {
    height: 150px;
    overflow: hidden;
    img {
      object-fit: cover;
      height: 100%;
      width: 100%;
    }
  }
  .bottom {
    padding: 1rem;
  }
}
</style>
