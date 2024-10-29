<script setup>
import {
  useSettingSideBar,
  useLoginSideBar,
  useSignupSideBar,
  useForgotPasswordSideBar,
  useEditProfileSideBar,
  useAccountPromptSideBar,
  useSleepTimerSideBar
} from '~/composables/states'

const settingsSideBar = useSettingSideBar()
const loginSideBar = useLoginSideBar()
const signinSideBar = useSignupSideBar()
const forgotPasswordSideBar = useForgotPasswordSideBar()
const editProfileSideBar = useEditProfileSideBar()
const accountPromptSideBar = useAccountPromptSideBar()
const sleepTimerSideBar = useSleepTimerSideBar()
</script>

<template>
  <div class="sidebars">
    <Sidebar
      v-model:visible="settingsSideBar"
      :baseZIndex="10000"
      position="right"
      class="w-full"
      id="settings-sidebar"
    >
      <template #header><span></span></template>
      <Settings />
    </Sidebar>
    <Sidebar
      v-model:visible="loginSideBar"
      :baseZIndex="10001"
      position="right"
      class="w-full hideX"
      blockScroll
      id="login-sidebar"
    >
      <Login />
    </Sidebar>
    <Sidebar
      v-model:visible="signinSideBar"
      :baseZIndex="10002"
      position="right"
      class="w-full hideX"
      blockScroll
      id="signin-sidebar"
    >
      <Signup />
    </Sidebar>
    <Sidebar
      v-model:visible="forgotPasswordSideBar"
      :baseZIndex="10003"
      position="right"
      class="w-full hideX"
      blockScroll
      id="forgot-password-sidebar"
    >
      <ForgotPassword />
    </Sidebar>
    <Sidebar
      v-model:visible="editProfileSideBar"
      :baseZIndex="10003"
      position="right"
      class="w-full hideX"
      blockScroll
      id="edit-profile-sidebar"
    >
      <EditProfile />
    </Sidebar>
    <Sidebar
      v-model:visible="accountPromptSideBar"
      :baseZIndex="10003"
      position="bottom"
      class="w-full hideX no-safe-area h-auto"
      id="account-prompt-sidebar"
    >
      <AccountPromptSideBar />
    </Sidebar>
    <Sidebar
      v-model:visible="sleepTimerSideBar"
      :baseZIndex="10003"
      position="bottom"
      class="w-full hideX no-safe-area h-auto"
      :class="[{ hide: !sleepTimerSideBar }]"
      id="sleep-timer-sidebar"
    >
      <SleepTimer />
    </Sidebar>
  </div>
</template>

<style lang="scss">
.p-sidebar {
  padding-top: env(safe-area-inset-top);
  background: var(--background2);
  .p-sidebar-header {
    padding: 0.75rem 0.75rem 0.75rem 1.25rem;
    justify-content: space-between;
  }
  .p-sidebar-content {
    padding: 0;
  }
  .p-sidebar-close {
    width: 32px !important;
    height: 32px !important;
  }
  .p-sidebar-close,
  .p-sidebar-close .p-icon {
    width: 18px;
    height: 18px;
    path {
      fill: var(--night);
    }
  }
  &.hideX {
    .p-sidebar-header {
      display: none !important;
    }
  }
  &.no-safe-area {
    padding-top: 0 !important;
  }
}
</style>
