<script setup lang="ts">
import {
  getAndSetUserProfile,
  askNotificationPermisstions,
  askTrackingPermissions
} from '~/utilities/helpers'
import { initFileSystem } from '~/utilities/file-system'
import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'
import type { URLOpenListenerEvent } from '@capacitor/app'
import {
  //PushNotificationSchema,
  PushNotifications
} from '@capacitor/push-notifications'
import type { ActionPerformed, Token } from '@capacitor/push-notifications'
import {
  useIsApp,
  useCurrentUserProfile,
  useGlobalToast,
  useIsNetworkConnected,
  useCurrentEpisode
} from '~/composables/states'
import { useBrowserTopColor } from '~/composables/globals'
import { initLocalNotifications } from '~/utilities/local-notifications'
import { Network } from '@capacitor/network'
import { useToast } from 'primevue/usetoast'
import { initMediaSession } from '~/utilities/media-session.js'
import { useNewFeatureBadge } from '~/composables/useNewFeatureBadge'

// temp system to handle the new feature badge on the sleep timer
const { initFeatureSessionCount } = useNewFeatureBadge()
initFeatureSessionCount()

const toast = useToast()

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const currentUserProfile = useCurrentUserProfile()
const currentEpisode = useCurrentEpisode()
const browserTopColor = useBrowserTopColor()
const globalToast = useGlobalToast()
const isNetworkConnected = useIsNetworkConnected()
const isApp = useIsApp()

const fcmToken = ref('')
//const nNotification = ref(null)
const appLaunchUrl = ref(null)

isApp.value = Capacitor.getPlatform() !== 'web'
useHead({
  htmlAttrs: {
    lang: 'en'
  },
  script: [],
  noscript: []
})
// a func to refresh all data
const refreshData = async () => {
  await getAndSetUserProfile()

  // refresh data here

  try {
    await refreshNuxtData()
  } catch (error) {
    console.error(error)
  }
  //update media session
  initMediaSession(currentEpisode.value)
}

// // init the Network listener
// Network.addListener("networkStatusChange", (status) => {
//   isNetworkConnected.value = status.connected
//   // refresh data here
//   if (status.connected) {
//     refreshData()
//   }
// })
// // set the initial network status
// const initNewtworkStatus = await Network.getStatus()
// isNetworkConnected.value = initNewtworkStatus.connected

// adds listeners for push notifications and appStateChange and appUrlOpen
const addListeners = async () => {
  // Ask for notification permissions
  await askNotificationPermisstions()
  // Ask for tracking permissions (iOS only)
  await askTrackingPermissions()

  // On success, we should be able to receive notifications
  await PushNotifications.addListener('registration', (token: Token) => {
    fcmToken.value = token.value
    //alert('Push registration success, token: ' + token.value)
  })

  // Some issue with our setup and push will not work
  await PushNotifications.addListener(
    'registrationError',
    (/* error: any */) => {
      //alert('Error on registration: ' + JSON.stringify(error))
    }
  )

  // Show us the notification payload if the app is open on our device
  await PushNotifications.addListener(
    'pushNotificationReceived',
    (/* notification: PushNotificationSchema */) => {
      //nNotification.value = notification
      //alert('Push received: ' + JSON.stringify(notification))
    }
  )

  // Method called when tapping on a local notification
  await PushNotifications.addListener(
    'pushNotificationActionPerformed',
    (notification: ActionPerformed) => {
      //nNotification.value = notification
      //alert('Push action performed: ' + JSON.stringify(notification))
      const slug = notification.notification.data.slug
      if (slug) {
        router.push(`/${slug}`)
      }
    }
  )
  // fired when the app becomes active (ios only)
  await App.addListener('appStateChange', (/* { isActive } */) => {
    //alert("App state changed. ", JSON.stringify(isActive))
  })

  // this is for deep links
  const client = useSupabaseClient()
  await App.addListener('appUrlOpen', async (event: URLOpenListenerEvent) => {
    //when redirected to the app from a deep link, we need to exchange the url parame code for a session
    //console.log("event = ", event)
    const code = event.url.split('=')[1]
    //alert("code = " + JSON.stringify(code))
    // for some reason, sometimes, the code has a '#' at the end of it, so we need to remove it
    const cleanCode = code.replace('#', '')
    //console.log("code = ", code)
    if (cleanCode) {
      try {
        await client.auth.exchangeCodeForSession(cleanCode)
        //alert("route")
        navigateTo('/')
        //alert("refresh")
        window.location.reload()
      } catch (error) {
        console.error(error)
        toast.add({
          severity: 'error',
          summary: 'Authentication failed',
          life: 6000
        })
      }
    } else {
      console.error('No code or wrong code in the auth event.url')
      // show toast error
      toast.add({
        severity: 'error',
        summary: 'Authentication failed',
        life: 6000
      })
    }
  })
}

// get the URL the app was loaded from (if any)
const checkAppLaunchUrl = async () => {
  const url = await App.getLaunchUrl()
  appLaunchUrl.value = url
  // so in the future, if we have it set up where certain URLs open the app, then we can read it and do something with it
  //alert("App opened with URL: " + JSON.stringify(url))
}

onMounted(async () => {
  await getAndSetUserProfile()

  if (isApp.value) {
    // init downloads files system for the app
    await initFileSystem()

    await addListeners()
    // if APP then add listeners
    await checkAppLaunchUrl()
    // init local notifications
    await initLocalNotifications()
  }

  //refresh data and check notification permissions every time the tab is in focus or the App is in focus
  document.addEventListener('visibilitychange', async () => {
    if (!document.hidden) {
      // update user profile when coming back from  the system settings
      if (isApp.value) {
        await PushNotifications.checkPermissions().then(result => {
          if (result.receive === 'denied') {
            currentUserProfile.value.receive_general_notifications = false
          }
          if (result.receive === 'granted') {
            currentUserProfile.value.receive_general_notifications = true
          }
        })
      }
      refreshData()
    }
  })
})

watch(globalToast, optionsObj => {
  if (optionsObj) {
    toast.add(optionsObj)
  }
})

const globalError = useError()

watch(globalError, error => {
  if (error) {
    toast.add({
      severity: 'error',
      summary: error,
      life: 6000
    })
  }
})
</script>

<template>
  <Html lang="en">
    <Head>
      <Link rel="canonical" :href="`https://somniasounds.com${route.path}`" />
      <Link rel="stylesheet" :href="config.public.HTL_CSS" type="text/css" />
      <Title> Somnia Sounds </Title>
      <Meta
        name="description"
        content="Somnia Sounds helps you relax and sleep better with soothing sounds and meditations."
      />
      <Meta name="keywords" content="somnia sounds" />
      <Meta name="og:site_name" content="Somnia Sounds" />
      <Meta name="og:type" content="website" />
      <Meta
        name="og:url"
        :content="`https://www.somniasounds.com${route.fullPath}`"
      />
      <Meta name="og:title" content="Somnia Sounds" />
      <Meta
        name="og:description"
        content="Somnia Sounds helps you relax and sleep better with soothing sounds and meditations."
      />
      <Meta
        name="og:image"
        content="https://uhqlxyalbxtrtvduigiv.supabase.co/storage/v1/object/public/images/splash.png?t=2024-11-14T20%3A51%3A41.939Z"
      />
      <Meta name="og:image:alt" content="Somnia Sounds" />
      <Meta name="og:image:width" content="1200" />
      <Meta name="og:image:height" content="600" />
      <Meta name="fb:app_id" content="151261804904925" />
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:site" content="@radiolab" />
      <Meta name="twitter:title" content="Somnia Sounds" />
      <Meta
        name="twitter:description"
        content="Somnia Sounds helps you relax and sleep better with soothing sounds and meditations"
      />
      <Meta
        name="twitter:image"
        content="https://uhqlxyalbxtrtvduigiv.supabase.co/storage/v1/object/public/images/splash.png?t=2024-11-14T20%3A51%3A41.939Z"
      />
      <Meta name="theme-color" :content="browserTopColor" />
      <Meta name="msapplication-TileColor" :content="browserTopColor" />
    </Head>
  </Html>
  <NuxtLayout>
    <NuxtPage :keepalive="{}" />
  </NuxtLayout>
  <NetworkBanner :connected="isNetworkConnected" />
  <AudioPlayer />
  <Sidebars class="z-2" />
  <Toast position="top-center" />
  <!-- <PullToRefresh /> -->
</template>
