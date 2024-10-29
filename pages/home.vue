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
      <h1 class="mt-4 mb-3">This Is A H1 Header</h1>
      <h2 class="mt-4 mb-3">This Is A H2 Header</h2>
      <h3 class="mt-4 mb-3">This Is A H3 Header</h3>
      <p>More paragraphs are coming soon...</p>
    </section>
  </div>
</template>
