<script setup>
import { useForgotPasswordSideBar } from '~/composables/states'

const client = useSupabaseClient()
const config = useRuntimeConfig()

const forgotPasswordSideBar = useForgotPasswordSideBar()
</script>

<template>
  <div>
    <section>
      <SHeader
        label="Forgot password?"
        @close-sidebar="forgotPasswordSideBar = false"
      />
    </section>
    <section>
      <p class="mb-4 lg:w-7 m-auto">
        Please enter your email address below and a magic link will be sent to
        you. Once you click on the magic link and are logged in, you may reset
        your password on your account settings page.
      </p>
      <SupabaseVLoginWithMagicLink :client="client" :config="config" />
    </section>
  </div>
</template>
