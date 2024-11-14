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
        <Title>Somnia Sounds | Home</Title>
        <Meta name="og:title" content="Somnia Sounds | Home" />
        <Meta name="twitter:title" content="Somnia Sounds | Home" />
      </Head>
    </Html>

    <section>
      <h1 class="mb-4">home</h1>
      <p>Coming soon!</p>
    </section>
  </div>
</template>
