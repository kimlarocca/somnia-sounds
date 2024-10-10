<script setup async>
import { useCurrentUserProfile } from '~/composables/states.ts'
import { useSignupSideBar, useLoginSideBar } from '~/composables/states'

useHead({
  bodyAttrs: {
    class: 'no-bottom-padding hide-bottom-menu solid-bg'
  }
})

definePageMeta({
  layout: 'default',
  middleware: ['check-auth-provider']
})

const loginSideBar = useLoginSideBar()
const signupSideBar = useSignupSideBar()

const currentUserProfile = useCurrentUserProfile()
const route = useRoute()
const isLoading = shallowRef(true)

onMounted(() => {
  setTimeout(() => {
    // if no redirect has happened, we can hide the loader
    isLoading.value = false
  }, 1500)
})
</script>
<template>
  <div>
    <Html>
      <Head>
        <Title>Somnia Sounds</Title>
        <Meta name="og:title" content="Somnia Sounds" />
        <Meta name="twitter:title" content="Somnia Sounds" />
      </Head>
    </Html>
    <div class="page style-mode-dark" :class="[`${String(route.name)}`]">
      <Transition name="fade">
        <section v-if="isLoading" class="loading-holder">
          <ProgressSpinner></ProgressSpinner>
        </section>
        <div v-else class="index-page flex flex-column">
          <section class="flex flex-column">
            <Logo class="m-auto mb-6 flex-none" />
            <div class="text-center flex flex-column gap-3 mb-4">
              <Button
                class="w-13rem m-auto"
                label="Create Account"
                aria-label="Create Account"
                rounded
                size="small"
                @click="signupSideBar = true"
              />
              <p>or</p>
              <Button
                class="w-13rem m-auto"
                label="Log in"
                aria-label="Log in"
                rounded
                size="small"
                severity="secondary"
                @click="loginSideBar = true"
              />
            </div>
          </section>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.index-page {
  height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
}
</style>
