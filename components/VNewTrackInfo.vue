<script setup>
const props = defineProps({
  description: {
    default: null,
    type: String
  },
  hideDescriptionOnMobile: {
    default: false,
    type: Boolean
  },
  hideTimeOnMobile: {
    default: false,
    type: Boolean
  },
  marquee: {
    default: false,
    type: Boolean
  },
  marqueeDelay: {
    default: '3s',
    type: String
  },
  marqueeLoops: {
    default: '1',
    type: String
  },
  marqueeSpeed: {
    default: 0.1,
    type: Number
  },
  title: {
    default: null,
    type: String
  }
})

const getMarqueeSpeed = computed(() => {
  const length = props.description?.length
  return `${length * props.marqueeSpeed}s`
})
</script>

<template>
  <div class="track-info">
    <div class="track-info-details">
      <div class="overflow-hidden">
        <div class="track-info-title">
          <div v-if="title" v-html="title" />
        </div>
        <div
          v-if="props.description"
          class="track-info-description"
          :class="[
            {
              hideDescriptionOnMobile: props.hideDescriptionOnMobile,
              marquee: props.marquee
            }
          ]"
        >
          <div class="track-info-description" v-html="props.description" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$container-breakpoint-md: useBreakpointOrFallback('md', 768px);
.track-info {
  display: flex;
  gap: 12px;
  width: 100%;
  height: inherit;
  flex: auto;
  align-self: center;
  .track-info-details {
    width: 0;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    line-height: normal;
    * {
      line-height: normal;
    }
    .track-info-title {
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      .title,
      .title div {
        font-weight: var(--persistent-player-title-weight);
        font-size: var(--persistent-player-title-size);
        color: var(--persistent-player-title-color);
        line-height: 1;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        box-sizing: border-box;
      }
    }
    .track-info-description {
      position: relative;
      display: block;
      font-weight: var(--persistent-player-desc-weight);
      font-size: var(--persistent-player-desc-size);
      color: var(--persistent-player-desc-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      * {
        font-weight: var(--persistent-player-desc-weight);
        font-size: var(--persistent-player-desc-size);
        color: var(--persistent-player-desc-color);
      }
      &.hideDescriptionOnMobile {
        @container (max-width: #{$container-breakpoint-md}) {
          display: none;
        }
      }
      &.marquee {
        -webkit-mask-image: linear-gradient(90deg, #000 94%, transparent);
        mask-image: linear-gradient(90deg, #000 94%, transparent);
      }
      .track-info-description-link {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-decoration: none;
        &:hover {
          text-decoration: none;
        }
        .track-info-description-marquee {
          overflow-x: hidden;
          div {
            display: flex;
            flex-wrap: nowrap;
            white-space: nowrap;
            min-width: 100%;
            .news-message {
              display: flex;
              flex-shrink: 0;
              align-items: center;
              animation: slide-left v-bind(getMarqueeSpeed) linear
                v-bind(marqueeLoops);
              animation-delay: v-bind(marqueeDelay);
              @keyframes slide-left {
                from {
                  -webkit-transform: translateX(0);
                  transform: translateX(0);
                }
                to {
                  -webkit-transform: translateX(-100%);
                  transform: translateX(-100%);
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
