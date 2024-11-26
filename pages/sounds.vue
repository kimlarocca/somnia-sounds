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

const client = useSupabaseClient()
const pending = ref(true)
const sounds = ref([])
const searchFieldValue = ref('')
const showSearchBar = ref(false)

const fetchData = async () => {
  const { data, error } = await client.from('sounds').select('*').order('title')
  if (error) {
    console.error('sounds database error', error)
  } else {
    sounds.value = data
    pending.value = false
  }
}

// computed property for filtered sounds based on search field value
const filteredItems = computed(() => {
  if (!searchFieldValue.value) {
    return sounds.value
  }
  return sounds.value.filter(item => {
    const searchTerm = searchFieldValue.value.toLowerCase()
    return item.title.toLowerCase().includes(searchTerm)
  })
})

// clear the search field
const clearSearchField = () => {
  searchFieldValue.value = ''
}

onMounted(() => {
  fetchData()
})
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

    <section v-if="pending">
      <div class="grid">
        <div
          v-for="i in 12"
          :key="`skeleton-${i}`"
          class="col col-6 md:col-4 xl:col-3 mb-3"
        >
          <SkeletonItem />
        </div>
      </div>
    </section>

    <section v-else>
      <h1 class="mb-5">sounds</h1>
      <div class="flex align-items-center gap-2 mb-5">
        <Button
          class="topic-btn text-sm white-space-nowrap active"
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
      <Transition name="slide-fade">
        <div v-if="showSearchBar" class="flex align-items-center gap-2 mb-4">
          <span class="p-input-icon-left w-full">
            <i class="pi pi-search text-color" />
            <InputText
              v-model="searchFieldValue"
              placeholder="search for sounds"
              class="search-field w-full"
            />
          </span>
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
        </div>
      </Transition>
      <div class="grid">
        <div
          class="col col-6 md:col-4 xl:col-3 mb-3"
          v-for="item in filteredItems"
          :key="item.id"
        >
          <Item :data="item" />
        </div>
      </div>
    </section>
  </div>
</template>
