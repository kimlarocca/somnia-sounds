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
      <h2 class="mt-4 mb-3">Section Header</h2>
      <p>coming soon</p>
    </section>
  </div>
</template>
