<script setup>
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
    image: 'https://placehold.co/248x124',
    audio: 'https://www.kimlarocca.com/fur-elise.mp3'
  }
])

const togglePlayHere = item => {
  console.log('play', item)
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
      <h1 class="mb-4">infinite soundscapes</h1>
      <CardLarge v-for="item in items" :key="item.id" :item="item">
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
      </CardLarge>
    </section>
  </div>
</template>
