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
</script>

<template>
  <div>
    <Html lang="en">
      <Head>
        <Title>Somnia Sounds | Sleep</Title>
        <Meta name="og:title" content="Somnia Sounds | Sleep" />
        <Meta name="twitter:title" content="Somnia Sounds | Sleep" />
      </Head>
    </Html>

    <section>
      <h1 class="mb-4">Sleep</h1>
      <p class="mb-4">Coming soon!</p>
    </section>
  </div>
</template>
