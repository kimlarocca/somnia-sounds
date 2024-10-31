<script setup>
import {
  getYear,
  setFontSize,
  toggleAskNotificationPermisstions
} from '~/utilities/helpers'
import {
  useTextSizeOption,
  useCurrentUser,
  useCurrentUserProfile,
  useEditProfileSideBar,
  useIsApp
} from '~/composables/states.ts'
import { Preferences } from '@capacitor/preferences'
import { localUserProfileKey } from '~/composables/globals'

const config = useRuntimeConfig()
const currentUser = useCurrentUser()
const currentUserProfile = useCurrentUserProfile()
const textSizeOptions = useTextSizeOption()
const editProfileSideBar = useEditProfileSideBar()
const isApp = useIsApp()
const client = useSupabaseClient()

//const isApple = currentUser.value?.app_metadata?.provider === 'apple'
//const isGoogle = currentUser.value?.app_metadata?.provider === 'google'
const isEmail = currentUser.value?.app_metadata?.provider === 'email'
const isDisabled = computed(() => {
  return !isEmail
})

const isMessage = shallowRef(false)
const severity = shallowRef('success')
const theMessage = shallowRef('Settings updated')

// main function to update the message component
const showMessage = async (
  mySverity = 'success',
  myMessage = 'Settings updated.'
) => {
  isMessage.value = false
  await nextTick()
  isMessage.value = true
  severity.value = mySverity
  theMessage.value = myMessage
}

const updateProfile = async () => {
  // update supabase and local storage
  if (currentUser.value && currentUserProfile.value) {
    const { error } = await client
      .from('profiles')
      .upsert({
        id: currentUser.value.id,
        updated_at: new Date().toISOString(),
        name: currentUserProfile.value.name,
        receive_general_notifications:
          currentUserProfile.value.receive_general_notifications,
        text_size: currentUserProfile.value.text_size.label,
        autodownload: currentUserProfile.value.autodownload
      })
      .match({ id: currentUser.value.id })
    if (error) {
      showMessage('error', 'Settings update failed.')
    } else {
      showMessage()
    }
  } else {
    const currentUserProfileSTRING = JSON.stringify(currentUserProfile.value)
    await Preferences.set({
      key: localUserProfileKey,
      value: currentUserProfileSTRING
    })
    setTimeout(() => {
      showMessage()
    }, 1000)
  }
}

const tempEmail = shallowRef(currentUser.value?.email)

watch(currentUserProfile.value, () => {
  updateProfile()
})

// handles setting the font size and tracking the event
const onUpdateTextSize = () => {
  setFontSize(currentUserProfile.value.text_size.pixel)
}

const accountHeader = computed(() => {
  switch (currentUser.value?.app_metadata?.provider) {
    case 'google':
      return {
        label: 'Google Account',
        icon: 'mr-2 pi pi-google',
        type: 'google'
      }
    case 'apple':
      return { label: 'Apple Account', icon: 'mr-2 pi pi-apple', type: 'apple' }
    default:
      return { label: 'Account', icon: '', type: null }
  }
})

// fire edit profile sidebar if the user clicks on a field
const editField = field => {
  if (!isDisabled.value) {
    editProfileSideBar.value = true
  }
}

const clickThisId = id => {
  document.getElementById(id).click()
}

// handles the notification switch change event
const handleNotificationChange = async e => {
  await toggleAskNotificationPermisstions(e)
}
</script>

<template>
  <div class="settings -mt-2">
    <section class="user">
      <SUser :disabled="isDisabled" :isEmail="isEmail" />
    </section>
    <section v-if="currentUser" class="user-preferences p-0">
      <div class="flex s-title-holder">
        <i :class="`${accountHeader.icon}`"></i>
        <div class="s-title">{{ accountHeader.label }}</div>
      </div>
      <SBox
        v-if="currentUserProfile?.name"
        label="Name"
        @click="editField('name')"
        :clickable="!isDisabled"
        :ripple="!isDisabled"
      >
        <p :class="[{ disabled: isDisabled }]">
          {{ currentUserProfile?.name }}
        </p>
      </SBox>
      <SBox
        label="Email"
        @click="editField('email')"
        :clickable="!isDisabled"
        :ripple="!isDisabled"
      >
        <p :class="[{ disabled: isDisabled }]">{{ tempEmail }}</p>
      </SBox>
      <SBox
        label="Password"
        v-if="isEmail"
        @click="editField('password')"
        :clickable="!isDisabled"
        :ripple="!isDisabled"
      >
        <p :class="[{ disabled: isDisabled }]">*********</p>
      </SBox>
    </section>
    <section v-if="isApp" class="notifications p-0">
      <div class="flex s-title-holder">
        <div class="s-title">Notifications</div>
      </div>
      <SBox label="General" :ripple="false">
        <VInputSwitch
          yes="ON"
          no="OFF"
          static-width
          v-model:data.sync="currentUserProfile.receive_general_notifications"
          @change="handleNotificationChange"
        />
      </SBox>
    </section>
    <section class="display p-0">
      <div class="flex s-title-holder">
        <div class="s-title">Display</div>
      </div>
      <SBox label="Text size" @labelClick="clickThisId('text-size')">
        <DropupMenu
          id="text-size"
          v-model:data.sync="currentUserProfile.text_size"
          :options="textSizeOptions"
          optionLabel="label"
          placeholder="Select a Text Size"
          label="Text Size"
          width="80%"
          class="-mr-2"
          @change="onUpdateTextSize"
        />
      </SBox>
    </section>
    <section class="p-0">
      <div class="flex s-title-holder">
        <div class="s-title">Support</div>
      </div>
      <SBox
        label="Tech support"
        link="https://somniasounds.com/support"
        :ripple="false"
      />
      <SBox
        label="Contact us"
        link="https://somniasounds.com/contact"
        :ripple="false"
      />
      <SBox
        v-if="currentUser"
        label="Delete account"
        link="https://somniasounds.com/delete-account"
        :ripple="false"
      />
    </section>
    <section class="footer mb-4">
      <Logo class="mb-3" />
      <p>© {{ getYear() }} Somnia Sounds. All rights reserved.</p>
      <p>Version {{ config.public.APP_VERSION }}</p>
    </section>
    <Transition name="zoom">
      <Message
        v-if="isMessage"
        class="settings-message"
        :severity="severity"
        :closable="false"
        :sticky="false"
      >
        {{ theMessage }}
      </Message>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.settings {
  section {
    margin-bottom: 30px;
  }
  .s-title-holder {
    padding: 0 1.25rem;
    margin-bottom: 8px;
    .s-title {
      font-size: 13px;
      text-transform: uppercase;
      opacity: 0.7;
      color: var(--text-color);
    }
    .pi {
      color: var(--text-color);
    }
  }
  .user-preferences {
    p.disabled {
      opacity: 60%;
      cursor: default !important;
      pointer-events: none;
      user-select: none;
    }
  }
  .footer {
    text-align: center;
  }
  .p-inplace {
    .p-inplace-display {
      @include font-config($type-paragraph);
    }
  }
  .p-button.p-button-icon-only {
    width: 2.357rem;
    padding: 0.5rem 0;
  }
  .settings-message {
    position: absolute;
    top: calc(env(safe-area-inset-top) + 40px);
    left: 0;
    right: 0;
  }
}
</style>

<style lang="scss">
.settings {
  .p-inplace {
    margin-right: -1rem;
    width: 80%;
    .p-inplace-display {
      width: 100%;
      position: relative;
      display: block;
      text-align: right;
      @include font-config($type-paragraph);
    }
    .p-inplace-content {
      display: flex;
      justify-content: flex-end;
      .p-inputtext {
        text-align: right;
        width: 100%;
        @include font-config($type-paragraph);
      }
    }
    .p-inputtext {
      background-color: transparent;
    }
  }
  .p-button.p-button-icon-only {
    width: 2.357rem;
    padding: 0.5rem 0;
  }
}
</style>
