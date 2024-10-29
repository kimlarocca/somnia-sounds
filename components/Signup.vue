<script setup>
import {
  useSignupSideBar,
  useLoginSideBar,
  useSettingSideBar
} from '~/composables/states'

const settingsSideBar = useSettingSideBar()
const signUpSideBar = useSignupSideBar()
const loginSideBar = useLoginSideBar()

const client = useSupabaseClient()
const config = useRuntimeConfig()

const onLoginClick = () => {
  loginSideBar.value = true
  signUpSideBar.value = false
}

// close all sidebars
const closeAll = () => {
  loginSideBar.value = false
  signUpSideBar.value = false
  settingsSideBar.value = false
}
</script>

<template>
  <div class="signup">
    <section>
      <SHeader label="Sign up" @close-sidebar="signUpSideBar = false" />
    </section>
    <section>
      <p>
        Already have an account?
        <nuxt-link to="#" aria-label="login" @click="onLoginClick"
          >Log in</nuxt-link
        >
      </p>
      <SupabaseVLoginWithProvider
        :client="client"
        :config="config"
        provider="google"
        label="Sign up with Google"
        severity="secondary"
        class="center my-3"
      />
      <SupabaseVLoginWithProvider
        :client="client"
        :config="config"
        provider="apple"
        severity="secondary"
        class="center"
        label="Sign up with Apple"
      />
      <Divider class="my-4" align="center">
        <b>or</b>
      </Divider>
      <SupabaseVSignupWithEmail
        :client="client"
        :config="config"
        label="Sign up"
        slug="/confirm"
        @login-success="closeAll"
        redirectUrl="https://demo.native-app.wnyc.org"
      >
        <template #aboveSubmit>
          <p class="mb-3 text-xs">
            By proceeding to create your account, you are agreeing to Somnia
            Sounds'
            <nuxt-link to="https://somniasounds.com/terms">
              Terms of Service
            </nuxt-link>
            and
            <nuxt-link to="https://somniasounds.com/privacy">
              Privacy Policy
            </nuxt-link>
          </p>
        </template>
      </SupabaseVSignupWithEmail>
    </section>
  </div>
</template>
