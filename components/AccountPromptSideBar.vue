<script setup>
import { useSignupSideBar, useLoginSideBar } from '~/composables/states'

const loginSideBar = useLoginSideBar()
const signupSideBar = useSignupSideBar()
const accountPromptSideBar = useAccountPromptSideBar()
</script>

<template>
  <div class="account-prompt-sidebar py-4">
    <section>
      <h1 class="mb-4">Save Your Favorites</h1>
      <p class="text-base mb-4">
        <nuxt-link
          to="#"
          @click="
            () => {
              accountPromptSideBar = false
              loginSideBar = true
            }
          "
        >
          Login</nuxt-link
        >
        to your account to save your favorite sounds, soundscapes, meditations
        and custom mixes.
      </p>
      <Button
        class="mr-3"
        label="Login Now"
        aria-label="Login Now"
        size="small"
        @click="
          () => {
            accountPromptSideBar = false
            loginSideBar = true
          }
        "
      />
      <Button
        label="Create Free Account"
        size="small"
        aria-label="Create Free Account"
        @click="
          () => {
            accountPromptSideBar = false
            signupSideBar = true
          }
        "
      />
    </section>
  </div>
</template>

<style lang="scss" scoped>
.account-prompt-sidebar {
  background: var(--solid-bg-color);
}
</style>
