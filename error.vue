<script setup lang="ts">
defineProps({
  error: {
    type: Object,
    default: null
  }
})

//clear error and route home
function handleGoHome() {
  //nuxt global
  clearError({ redirect: '/' })
}

//clear error and try again
function handleTryAgain() {
  //nuxt global
  clearError()
}
</script>

<template>
  <section>
    <h1 class="mb-4">page not found!</h1>
    <p class="mb-4">Sorry, there was an error 😱</p>
    <div class="flex gap-3">
      <Button
        label="Try Again"
        severity="secondary"
        aria-label="try Again"
        @click="handleTryAgain"
      />
      <Button
        label="Navigate Home"
        aria-label="Navigate Home"
        @click="handleGoHome"
      />
    </div>
  </section>
</template>
