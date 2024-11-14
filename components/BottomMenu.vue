<script setup>
import MoonIcon from './icons/MoonIcon.vue'
import SoundsIcon from './icons/SoundsIcon.vue'
import StarIcon from './icons/StarIcon.vue'
import ExploreIcon from './icons/ExploreIcon.vue'

const route = useRoute()
const options = ref([
  { icon: markRaw(MoonIcon), value: 'Home', slug: '/' },
  { icon: markRaw(SoundsIcon), value: 'Sounds', slug: '/sounds' },
  { icon: markRaw(ExploreIcon), value: 'Discover', slug: '/discover' },
  { icon: markRaw(StarIcon), value: 'Saved', slug: '/saved' }
])
</script>

<template>
  <div class="bottom-menu">
    <div class="buttons-holder">
      <template v-for="item in options" :key="item.slug">
        <nuxt-link :to="item.slug" class="link w-full" prefetch>
          <Button class="w-full" :aria-label="`${item.value} menu button`">
            <div class="item">
              <component
                :is="item.icon"
                :active="
                  route.name === item.value.toLowerCase() ||
                  (route.name === 'index' && item.value === 'Home')
                "
              >
              </component>
              {{ item.value }}
            </div>
          </Button>
        </nuxt-link>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
@keyframes liftBottomMenu {
  0%,
  66% {
    transform: translateY(
      calc(var(--bottom-menu-height) + env(safe-area-inset-bottom))
    );
  }
  100% {
    transform: translateY(0);
  }
}
.bottom-menu {
  background-color: var(--black);
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1001;
  width: 100vw;
  padding-bottom: env(safe-area-inset-bottom);
  animation: liftBottomMenu 1.5s ease-out;
  .buttons-holder {
    height: var(--bottom-menu-height);
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .link {
      text-decoration: none;
      .p-button {
        border-radius: 0 !important;
        background-color: rgba(0, 0, 0, 0);
        color: #ffffff;
        border-color: rgba(0, 0, 0, 0);
        border: none;
        text-align: center;
        box-shadow: none;
        flex-grow: 1;
        justify-content: center;
        text-decoration: none;
        .icon {
          flex: none;
          width: 25px;
          height: 25px;
          margin-bottom: 8px;
        }
        .item {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 12px;
          line-height: 15px;
          font-weight: var(--font-weight-300);
          font-family: var(--font-family-header);
          text-decoration: none;
        }
      }
    }
  }
}
</style>
