<script setup>
import { useSettingSideBar } from '~/composables/states.ts'
const props = defineProps({
  label: {
    type: String,
    default: '',
    required: true
  },
  link: {
    type: String,
    default: null
  },
  clickable: {
    type: Boolean,
    default: false
  },
  isLink: {
    type: Boolean,
    default: false
  },
  ripple: {
    type: Boolean,
    default: true
  }
})

// fix to make ripple work
import { usePrimeVue } from 'primevue/config'
const $primevue = usePrimeVue()
defineExpose({
  $primevue
})
const settingSideBar = useSettingSideBar()
const emit = defineEmits(['link-click', 'label-click'])

const onClick = () => {
  emit('link-click', props.link)
  if (settingSideBar.value) {
    settingSideBar.value = false
  }
}
</script>

<template>
  <div
    class="s-box relative overflow-hidden"
    :class="[
      { 'is-link': props.link || props.isLink, clickable: props.clickable }
    ]"
  >
    <div
      class="content flex justify-content-between align-items-center"
      v-ripple
      :class="[{ killRipple: !props.ripple }]"
    >
      <nuxt-link @click="onClick" v-if="link" raw :to="link" class="w-full">
        <Button
          :label="label"
          class="w-full text-left"
          text
          aria-label="menu item"
        />
      </nuxt-link>
      <nuxt-link v-else-if="isLink" raw class="w-full">
        <Button
          :label="label"
          class="w-full text-left"
          text
          aria-label="menu item"
        />
      </nuxt-link>
      <div v-else>
        <div
          class="label-holder flex h-full py-3 align-items-center cursor-pointer"
          @click="emit('label-click')"
        >
          <p class="label white-space-nowrap">
            {{ label }}
          </p>
        </div>
      </div>
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.s-box {
  width: 100%;
  height: 50px;
  padding: 0 1.25rem;
  border: 1px solid var(--shade-400);
  border-left: none;
  border-right: none;
  margin-top: -1px;
  &.clickable {
    cursor: pointer;
  }
  &.is-link {
    padding: 0;
    .flexible-link {
      .p-button {
        padding-left: 1.25rem;
        padding-right: 1.25rem;
        color: var(--night);
        font-weight: var(--font-weight-500);
        &:hover {
          background: var(--background3);
        }
      }
    }
  }
  .content {
    width: 100%;
    height: 100%;
    font-size: 0.8125rem;
  }
  .label {
    font-size: 1rem;
    margin-right: 15px;
  }
}
</style>
<style lang="scss">
.s-box {
  .p-button {
    background-color: transparent;
    color: var(--white);
    padding-left: 1.25rem;
  }
  .content {
    &.killRipple {
      .p-ink,
      .p-ink-active {
        display: none !important;
      }
      .label-holder {
        cursor: default !important;
      }
    }
  }
}
</style>
