<script async setup>
import {
  useSignupSideBar,
  useLoginSideBar,
  useSettingSideBar,
  useForgotPasswordSideBar
} from '~/composables/states'

const settingsSideBar = useSettingSideBar()
const signUpSideBar = useSignupSideBar()
const loginSideBar = useLoginSideBar()
const forgotPasswordSideBar = useForgotPasswordSideBar()

const client = useSupabaseClient()
const config = useRuntimeConfig()

// handle the login and signup sidebars when the user clicks on the sign up link
const onSignupClick = () => {
  loginSideBar.value = false
  signUpSideBar.value = true
}

// close all sidebars
const closeAll = () => {
  loginSideBar.value = false
  signUpSideBar.value = false
  settingsSideBar.value = false
}

// open the forgot password sidebar
const openForgotPassword = () => {
  loginSideBar.value = false
  forgotPasswordSideBar.value = true
}
</script>

<template>
  <div class="login">
    <section>
      <SHeader label="Log in" @close-sidebar="loginSideBar = false" />
    </section>
    <section>
      <p>
        Don't have an account yet?
        <nuxt-link to="#" @click="onSignupClick"> Sign up</nuxt-link>
      </p>
      <SupabaseVLoginWithProvider
        :client="client"
        :config="config"
        provider="google"
        label="Log in with Google"
        severity="secondary"
        class="center my-3"
      />
      <SupabaseVLoginWithProvider
        :client="client"
        :config="config"
        provider="apple"
        label="Log in with Apple"
        severity="secondary"
        class="center"
      />
      <Divider class="my-4" align="center">
        <b>or</b>
      </Divider>
      <SupabaseVLoginWithEmail
        label="Log in"
        :client="client"
        :config="config"
        slug="/confirm"
        @submit-success="closeAll"
      >
        <template #belowSubmit>
          <div class="mt-4 relative">
            <p class="text-center">
              <nuxt-link to="#" @click="openForgotPassword">
                Forgot password?
              </nuxt-link>
            </p>
          </div>
        </template>
      </SupabaseVLoginWithEmail>
    </section>
  </div>
</template>
