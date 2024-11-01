<script setup>
import { checkIsFavorited, addToFavorites } from '~/utilities/helpers'
import {
  useCurrentEpisode,
  useCurrentUser,
  useSleepTimerRunning
} from '~/composables/states'
import useSleepTimer from '~/composables/useSleepTimer'
import { fetchAndStoreMp3, isAlreadyDownloaded } from '~/utilities/file-system'

import StarIcon from '~/components/icons/StarIcon.vue'
import DownloadIcon from '~/components/icons/DownloadIcon.vue'

const emit = defineEmits(['close-panel'])

const currentEpisode = useCurrentEpisode()
const user = useCurrentUser()
const sleepTimerRunning = useSleepTimerRunning()

const { handleSleepTimer } = useSleepTimer()

const isFavorited = ref(false)

watchEffect(async () => {
  isFavorited.value = await checkIsFavorited(
    currentEpisode.value.showSlug || currentEpisode.value.slug
  )
})

// add item to favorites
const handleAddToFavorites = () => {
  // helper func for adding to favorites, also handles account prompt if not logged in
  addToFavorites({
    item: currentEpisode.value,
    isFavorited: isFavorited.value
  })
  if (user.value) {
    isFavorited.value = !isFavorited.value
  }
}

const progress = ref({})

const handleDownload = async () => {
  // update CapacitorJs filesystem
  progress.value[currentEpisode.value.id] = await fetchAndStoreMp3(
    currentEpisode.value
  )
}
</script>

<template>
  <section class="expanded-player flex flex-column gap-3">
    <div class="tools flex justify-content-center">
      <div class="flex gap-2">
        <Button
          text
          severity="secondary"
          rounded
          aria-label="add to favorites"
          @click="handleAddToFavorites"
        >
          <template #icon>
            <StarIcon :class="{ isFavorited, active }"
          /></template>
        </Button>
        <Button
          text
          severity="secondary"
          rounded
          aria-label="download"
          @click="handleDownload"
        >
          <template #icon> <DownloadIcon /></template>
        </Button>
        <DownloadProgress
          v-if="
            progress[currentEpisode.id] || isAlreadyDownloaded(currentEpisode)
          "
          class="flex align-items-center"
          :isDownloaded="isAlreadyDownloaded(currentEpisode)"
          :progress="progress[currentEpisode.id]"
        />
        <SleepTimerButton
          @emit-click="handleSleepTimer"
          :isActive="sleepTimerRunning"
        />
      </div>
    </div>
  </section>
</template>

<style lang="scss">
:root {
  $expandedFooterHeight: 100px;
  .persistent-player {
    .expanded-player {
      padding-bottom: calc(
        $bottomMenuHeight + $expandedFooterHeight + env(safe-area-inset-bottom) +
          2rem
      );
      .expanded-footer {
        background: var(--persistent-player-bg);

        display: block;
        position: fixed;
        //height: 45px;
        bottom: 0;
        left: 0;
        width: 100%;
        transition: bottom var(--transition-duration);
        -webkit-transition: bottom var(--transition-duration);
      }

      .tools {
      }
    }
    &.expanded {
      .expanded-footer {
        bottom: calc($bottomMenuHeight + env(safe-area-inset-bottom));
      }
    }
    .template-blank {
      .expanded-footer {
        bottom: env(safe-area-inset-bottom) !important;
      }
    }
    .header-cast-btn {
      display: none;
    }
  }
}
</style>
