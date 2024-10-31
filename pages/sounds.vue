<script setup>
import { useCurrentEpisode, useTogglePlayTrigger } from '~/composables/states'
import { prepForPlayer } from '~/utilities/helpers'

const currentEpisode = useCurrentEpisode()
const searchFieldValue = ref('')
const showSearchBar = ref(false)
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
  },
  {
    id: 2,
    estimatedDuration: 60,
    title: 'Fur Elise 2',
    tease: '222 Fall asleep with this soothing piano music by Beethoven.',
    image: 'https://placehold.co/350',
    audio: 'https://www.kimlarocca.com/fur-elise.mp3'
  }
])

// handle the play button click
const togglePlayHere = item => {
  if (currentEpisode.value?.id !== item.id) {
    currentEpisode.value = prepForPlayer(item)
  }
  togglePlayTrigger.value = !togglePlayTrigger.value
}
</script>

<template>
  <div>
    <Html lang="en">
      <Head>
        <Title>Somnia Sounds | Explore</Title>
        <Meta name="og:title" content="Somnia Sounds | Sounds" />
        <Meta name="twitter:title" content="Somnia Sounds | Sounds" />
      </Head>
    </Html>

    <section>
      <h1 class="mb-5">explore</h1>
      <div class="flex align-items-center gap-2 mb-5">
        <Button
          class="topic-btn text-sm white-space-nowrap"
          label="sounds"
          :aria-label="`sounds category button`"
        />
        <Button
          class="topic-btn text-sm white-space-nowrap"
          label="soundscapes"
          :aria-label="`infinite soundscapes category button`"
        />
        <Button
          class="topic-btn text-sm white-space-nowrap"
          label="meditations"
          :aria-label="`meditations category button`"
        />
        <Button
          class="closer"
          rounded
          text
          plain
          icon="pi pi-search"
          aria-label="search"
          @click="showSearchBar = !showSearchBar"
        />
      </div>
      <Transition name="fade">
        <div v-if="showSearchBar" class="mb-4">
          <span class="p-input-icon-left w-full">
            <i v-if="isSearching" class="pi pi-spin pi-spinner text-color" />
            <i v-else class="pi pi-search text-color" />
            <InputText
              v-model="searchFieldValue"
              placeholder="search for sounds"
              class="search-field w-full"
            />
            <Button
              v-if="searchFieldValue"
              class="closer"
              rounded
              text
              plain
              icon="pi pi-times"
              aria-label="clear search"
              @click="clearSearchField"
            />
          </span>
        </div>
      </Transition>
      <h3 class="mb-4">Sounds</h3>
      <div class="grid">
        <div class="col col-6" v-for="item in items" :key="item.id">
          <Card :item="item">
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
        </div>
      </div>
    </section>
  </div>
</template>
