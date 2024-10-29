<script setup>
import {
  useSettingSideBar,
  useLoginSideBar,
  useSignupSideBar,
  useCurrentUser,
  useCurrentUserProfile
} from '~/composables/states.ts'
import { logOutUser } from '~/utilities/helpers'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  isEmail: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:data', 'onDisabled'])

const settingsSideBar = useSettingSideBar()
const loginSideBar = useLoginSideBar()
const signupSideBar = useSignupSideBar()
const currentUser = useCurrentUser()
const currentUserProfile = useCurrentUserProfile()
const client = useSupabaseClient()
const config = useRuntimeConfig()
const imageUploadModal = shallowRef(false)

const onLogIn = () => {
  loginSideBar.value = true
}

const onLogOut = async () => {
  await logOutUser()
  settingsSideBar.value = false
  // show toast
  toast.add({
    severity: 'success',
    summary: 'You have been logged out.',
    life: 3000
  })
}

const onSignUp = () => {
  signupSideBar.value = true
}

const handleModal = () => {
  if (!props.disabled) {
    imageUploadModal.value = true
  } else {
    emit('onDisabled')
  }
}

const avatarUrl = computed(() => {
  return (
    currentUser.value?.user_metadata?.avatar_url ||
    currentUserProfile.value?.avatar_image_url ||
    null
  )
})
</script>

<template>
  <div class="s-user flex gap-3">
    <Avatar
      v-if="currentUser"
      :image="avatarUrl"
      size="large"
      :style="`
        cursor: ${props.disabled ? 'default' : 'pointer'};
      `"
      shape="circle"
      @click="handleModal"
    >
      <template #icon v-if="!avatarUrl">
        <Button
          v-if="currentUser && props.isEmail"
          icon="pi pi-plus"
          severity="secondary"
          rounded
          aria-label="upload image"
        />
      </template>
    </Avatar>
    <Dialog
      v-model:visible="imageUploadModal"
      modal
      header="Your Profile Image"
      :draggable="false"
    >
      <SupabaseVUploadImage
        :image="currentUserProfile?.avatar_image_url"
        :currentUser="currentUser"
        :currentUserProfile="currentUserProfile"
        :client="client"
        :config="config"
        :maxFileSize="2500000"
        @close-dialog="() => (imageUploadModal = false)"
        @imageUploaded="
          imageUrl => {
            currentUserProfile.avatar_image_url = imageUrl
          }
        "
      />
    </Dialog>
    <div v-if="currentUser" class="info flex flex-column gap-2 mt-2">
      <h2 class="mb-2">Hi, {{ currentUserProfile?.name }}</h2>
      <nuxt-link to="/home" class="p1" @click="onLogOut"> Log out </nuxt-link>
    </div>
    <div v-else class="info flex flex-column gap-3 mb-4">
      <h2 class="mb-2">You are logged out.</h2>
      <Button
        label="Log in"
        rounded
        @click="onLogIn"
        class="w-9rem mb-2"
        aria-label="login"
      />
      <p>
        Don't have an account yet?
        <nuxt-link to="#" @click="onSignUp"> Sign up </nuxt-link>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.s-user {
  .user-icon path {
    color: var(--night--500);
  }
  .p-avatar {
    width: 40px;
    height: 40px;
    position: relative;
    flex: none;
    background-color: #ffffff;
    color: var(--night--500);
    border-radius: 50%;
    img {
      object-fit: cover;
    }
    .p-button {
      position: absolute;
      transform: scale(0.5);
      left: -15px;
      bottom: -10px;
      &:before {
        font-weight: 900;
      }
    }
  }
}
</style>
