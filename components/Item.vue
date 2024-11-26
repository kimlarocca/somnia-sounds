<script setup>
import {
  addToFavorites,
  checkIsFavorited,
  prepForPlayer
} from '~/utilities/helpers'
import { useCurrentEpisode, useTogglePlayTrigger } from '~/composables/states'
import { isAlreadyDownloaded } from '~/utilities/file-system'

const props = defineProps({
  data: {
    type: Object,
    default: {}
  }
})

const currentEpisode = useCurrentEpisode()
const isDownloaded = ref(false)
const isFavorited = ref(false)
const togglePlayTrigger = useTogglePlayTrigger()

const cardItem = ref(props.data.sounds ? props.data.sounds : props.data)

isFavorited.value = await checkIsFavorited(cardItem.value.id)

watchEffect(async () => {
  isDownloaded.value = isAlreadyDownloaded(cardItem.value)
  isFavorited.value = await checkIsFavorited(cardItem.value.id)
})

// handle the play button click
const togglePlayHere = item => {
  if (currentEpisode.value?.id !== item.id) {
    currentEpisode.value = prepForPlayer(item)
  }
  togglePlayTrigger.value = !togglePlayTrigger.value
}
</script>

<template>
  <Card :item="cardItem">
    <template #play>
      <PlayButton
        v-if="cardItem.audio"
        :data="cardItem"
        @onClick="togglePlayHere(cardItem)"
        :is-downloaded="isDownloaded"
        class="z-2"
      />
    </template>
    <template #favorite>
      <StarIcon
        class="favorite cursor-pointer"
        :class="{ favorited: isFavorited }"
        @click="addToFavorites(cardItem, isFavorited)"
      />
    </template>
  </Card>
</template>
