<script setup>
import { useCurrentEpisode, useTogglePlayTrigger } from '~/composables/states'
import { saveRecentlyPlayed, prepForPlayer } from '~/utilities/helpers'

const currentEpisode = useCurrentEpisode()
const togglePlayTrigger = useTogglePlayTrigger()

definePageMeta({
  layout: 'default',
  layoutTransition: {
    name: 'login'
  }
})

useHead({
  bodyAttrs: {
    class: 'show-header'
  }
})

const items = ref([
  {
    id: 1,
    estimatedDuration: 30,
    title: 'Fur Elise',
    tease: 'Fall asleep with this soothing piano music by Beethoven.',
    image: 'https://placehold.co/248',
    audio: 'https://www.kimlarocca.com/fur-elise.mp3'
  }
])

// handle the play button click
const togglePlayHere = item => {
  if (currentEpisode.value?.id !== item.id) {
    currentEpisode.value = prepForPlayer(item)
    saveRecentlyPlayed(item)
  }
  togglePlayTrigger.value = !togglePlayTrigger.value
}
</script>

<template>
  <div>
    <Html lang="en">
      <Head>
        <Title>Somnia Sounds | Sounds</Title>
        <Meta name="og:title" content="Somnia Sounds | Sounds" />
        <Meta name="twitter:title" content="Somnia Sounds | Sounds" />
      </Head>
    </Html>

    <section>
      <h1 class="mb-5">infinite soundscapes</h1>
      <p class="mb-5">current episode: {{ currentEpisode }}</p>
      <Card v-for="item in items" :key="item.id" :item="item">
        <template #play>
          <PlayButton
            v-if="item.audio"
            :data="item"
            @onClick="togglePlayHere(item)"
            class="z-2"
          />
        </template>
        <template #favorite>
          <StarIcon class="favorite" />
        </template>
      </Card>
    </section>
  </div>
</template>
