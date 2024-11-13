import { format, formatDistanceToNowStrict } from "date-fns"
import { StatusBar, Style } from "@capacitor/status-bar"
import {
  useCurrentEpisode,
  useTextSizeOption,
  useIsApp,
  useCurrentUser,
  useCurrentUserProfile,
  useLocalUserProfileDefault,
  useCurrentUserFavorites,
  useTogglePlayTrigger,
  useGlobalToast,
  useAccountPromptSideBar,
  useIsNetworkConnected,
} from "~/composables/states"
import { Capacitor } from "@capacitor/core"
import { Preferences } from "@capacitor/preferences"
import { NativeSettings, AndroidSettings, IOSSettings } from "capacitor-native-settings"
import { Browser } from "@capacitor/browser"
import {
  localUserProfileKey,
  FALLBACKIMAGEEPDARK,
} from "~/composables/globals"
import axios from "axios"
import { Share } from "@capacitor/share"
import { Clipboard } from "@capacitor/clipboard"
import { PushNotifications } from "@capacitor/push-notifications"
import { initDeviceId } from "~/utilities/device-id.js"
import { deleteDirectory } from "~/utilities/file-system"
//import { useSupabaseClient } from '@nuxtjs/supabase'
import {
  AppTrackingTransparency,
} from "capacitor-plugin-app-tracking-transparency"
import {
  type AppTrackingStatusResponse,
} from "capacitor-plugin-app-tracking-transparency"

// function to check if a URL returns a 404
export const checkUrl404 = async (url) => {
  try {
    const response = await axios(url, { method: "HEAD" })
    return response.status === 404
  } catch (error) {
    console.error("Error checking URL:", error)
    return true
  }
}

// rreturn organization name from CMS source
export const getOrg = (cmsSource) => {
  switch (cmsSource) {
    case cmsSources.PUBLISHER:
      return "WNYC"
    case cmsSources.WAGTAIL:
      return "Gothamist"
    case cmsSources.NPR:
      return "NPR"
    default:
      return "WNYC"
  }
}

// returns the time since the episode was published, but checks for updated_date first
export const whenTime = (data) => {
  const res = data?.updatedDate
    ? howLongAgo(data?.updatedDate)
    : data?.publicationDate
      ? howLongAgo(data?.publicationDate)
      : data?.publishAt
        ? howLongAgo(data?.publishAt)
        : howLongAgo(data?.firstPublishedAt)
  return res
}

// format ISO timestamp to return only the time
export function formatTime(date: any) {
  if (date) {
    const dateObject = new Date(date)
    return format(dateObject, "h:mm a")
  }
  return null
}

/*
formats the url of a publisher image so it works with our design system image components
*/
export const formatPublisherImageUrl = (url) => {
  return url.replace("%s/%s/%s/%s", "%width%/%height%/c/%quality%")
}

/*
finds the image first then formats the url of a publisher image so it works with our design system image components
*/
export const formatPublisherImage = (attributes) => {
  const img = attributes.imageMain ?? attributes.image
  const url = img.template
  return url.replace("%s/%s/%s/%s", "%width%/%height%/c/%quality%")
}

// Function to strip HTML tags and return text content
function stripHtmlTags(str) {
  const parser = new DOMParser()
  const dom = parser.parseFromString(str, "text/html")
  return dom.body.textContent ?? ""
}

// Computed property to calculate reading time
export const getReadingTime = (htmlContent) => {
  const textContent = stripHtmlTags(htmlContent)
  const wordsPerMinute = 200 // Average reading speed
  const estimatedWordCount = textContent.split(/\s+/).length
  return `${Math.ceil(estimatedWordCount / wordsPerMinute)} min read`
}

interface ImageAttributes {
  imageMain?: {
    template: string
  }
  image?: {
    template: string
  }
}

// returns the rounded up minutes duration of the episode
export const getMinutes = (ms, mult = 1000) => {
  const seconds = Math.round(ms / mult)
  let minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  minutes %= 60

  let duration = ""
  if (hours > 0) {
    duration += `${hours} hr`
  }
  if (minutes > 0) {
    duration += ` ${minutes} min`
  }
  if (duration === "") {
    duration = "Play"
  }
  return duration
}

// returns a resized image url when provided the entire image object
export const resizePublisherImage = (
  attributes: ImageAttributes,
  w: number,
  h: number,
  q = 80
): string => {
  const img = attributes.imageMain ?? attributes.image
  const url = img.template

  const pieces = url.split("/")
  const finalUrlArr: string[] = []

  pieces.forEach((piece: string, index: number) => {
    if (index < 4 || index > 7) {
      finalUrlArr.push(piece)
    }
    if (index === 4) {
      finalUrlArr.push(`${w}/${h}/c/${q}`)
    }
  })
  return finalUrlArr.join("/")
}

// returns a resized image url when provided just the image URL
export const resizePublisherImageUrl = (
  url: string,
  w: number,
  h: number,
  q = 80
): string => {
  const pieces = url.split("/")
  const finalUrlArr: string[] = []

  pieces.forEach((piece: string, index: number) => {
    if (index < 4 || index > 7) {
      finalUrlArr.push(piece)
    }
    if (index === 4) {
      finalUrlArr.push(`${w}/${h}/c/${q}`)
    }
  })
  return finalUrlArr.join("/")
}

// returns a resized image url when provided just the image URL
export const resizeNprImageUrl = (
  url: string,
  w: number,
  q = 80,
  format = "webp"
): string => {
  const finalUrl = url.replace('{width}', w.toString()).replace('{format}', format).replace('{quality}', q.toString())
  return finalUrl
}

// returns a resized image url when provided just the image URL
export const resizeWagtailImageUrl = (
  id: string,
  w: number,
  h: number,
  q = 80,
  format = "webp"
): string => {
  const config = useRuntimeConfig()
  const finalUrl = `${config.public.IMAGE_BASE_URL}${id}/fill-${w}x${h}-c0|format-${format}|webpquality-${q}`
  return finalUrl
}
// returns a templated image url when provided just the image URL
export const templatizePublisherImageUrl = (url: string): string => {
  if (url?.includes("media.wnyc.org")) {
    const pieces = url.split("/")
    const finalUrlArr: string[] = []

    pieces.forEach((piece: string, index: number) => {
      if (index < 4 || index > 7) {
        finalUrlArr.push(piece)
      }
      if (index === 4) {
        finalUrlArr.push("%s/%s/%s/%s")
      }
    })
    return finalUrlArr.join("/")
  } else {
    return url
  }
}

// central spot to handle image formatting from diff sources
export const imageSolver = (url, options = {}) => {
  // Default values for width, height, quality, and format
  const { w = 288, h = 288, q = 80, format = "webp" }: { w?: number, h?: number, q?: number, format?: string } = options

  let imgUrl = ""
  if (/^\d+$/.test(url)) {
    imgUrl = resizeWagtailImageUrl(url, w, h, q, format)
  } else if (url.includes("media.wnyc.org")) {
    imgUrl = resizePublisherImageUrl(url, w, h, q)
  } else {
    imgUrl = url
  }
  return imgUrl
}

/**
 * to get how long ago a date was
 */
export function howLongAgo(date) {
  if (date) {
    // check if unix tiumestamp
    if (Number.isInteger(date)) {
      date = new Date(date * 1000)
    }

    const res = formatDistanceToNowStrict(new Date(date), {
      addSuffix: true,
    })

    return res.replace("minutes", "min").replace("minute", "min")
  }
  return null
}

/**
 * to get the desired date format for the header
 */
export function getDate(data = null, formatString = "EEE, MMM do") {
  const date = data?.updatedDate || data?.publicationDate
  if (date) {
    const currentYear = new Date().getFullYear()
    const currentDay = new Date().getDate()
    const inputDate = new Date(date)
    const inputYear = inputDate.getFullYear()
    const inputDay = inputDate.getDate()
    if (inputDay !== currentDay) {
      if (inputYear !== currentYear) {
        formatString = `${formatString}, yyyy` // Update formatString to include the year
      }
      return format(inputDate, formatString)
    } else {
      return whenTime(data)
    }
  } else {
    return format(new Date(), formatString)
  }
}

/**
 * to get the desired date format for the header
 */
export function formatDate(date = null, formatString = "EEE, MMM do") {
  if (date) {
    const currentYear = new Date().getFullYear()
    const inputDate = new Date(date)
    const inputYear = inputDate.getFullYear()
    if (inputYear !== currentYear) {
      formatString = `${formatString}, yyyy` // Update formatString to include the year
    }
    return format(inputDate, formatString)
  } else {
    return format(new Date(), formatString)
  }
}

/**
 * to get the yaer for the footer in the settings
 */
export function getYear() {
  return new Date().getFullYear()
}

/**
 * helper function to capitalize the first letter of a string
 */
export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * helper function to change the global font size
 */
export function setFontSize(size: string) {
  document.documentElement.style.fontSize = size
}

// function to get the EPISODE fallback image for the episode
export const getEpisodeFallBackImage = () => {
  return FALLBACKIMAGEEPDARK
}

// helper function to get the pixel size from thr label
export const getTextSizePixel = (label) => {
  if (typeof label === "string") {
    const textSizeOptions = useTextSizeOption()
    return textSizeOptions.value.find((item) => item.label === label).pixel
  } else {
    return label.pixel
  }
}

// set the display settings in one place
export const setDisplaySettings = async (data) => {
  setFontSize(getTextSizePixel(data.text_size))
}

// will take the user to their native os system settings
export const toSystemSettings = () => {
  if (Capacitor.getPlatform() === "android") {
    NativeSettings.openAndroid({
      option: AndroidSettings.AppNotification,
    })
  } else {
    NativeSettings.openIOS({
      option: IOSSettings.App,
    })
  }
}

// helper function to open a link in the browser IN the app
export async function openLinkInAppBrowser(url: string) {
  await Browser.open({ url })
}

// handle the delete of the stored audio file
export const handleDelete = (file) => {
  const globalToast = useGlobalToast()
  deleteDirectory(file)
  globalToast.value = {
    severity: "info",
    summary: "Removed download.",
    life: 3000,
  }
}

// get the current user's favorited items
export const getFavoritedItems = async () => {
  const favorites = useCurrentUserFavorites()
  const user = useCurrentUser()
  if (user.value) {
    const client = useSupabaseClient()
    const { data, error } = await client
      .from("favorited")
      .select("*, sounds ( * )")
      .eq("uuid", user.value.id)

    if (error) {
      console.error("favorited items error", error)
    }
    favorites.value = data
  }
}

// check if an item is favorited
export const checkIsFavorited = async (itemId) => {
  const user = useCurrentUser()
  if (user.value) {
    const favorites = useCurrentUserFavorites()
    if (favorites.value) {
      const result = favorites.value.find(
        (item) => item.sounds?.id === itemId
      )
      return result ? true : false
    }
  }
  return false
}

// get and set the user profile
export const getAndSetUserProfile = async () => {
  const isNetworkConnected = useIsNetworkConnected()
  const isApp = useIsApp()
  const currentUser = useCurrentUser()
  const currentUserProfile = useCurrentUserProfile()
  const localUserProfileDefault = useLocalUserProfileDefault()
  const config = useRuntimeConfig()
  const client = useSupabaseClient()
  const user = await client.auth.getSession()

  // function that gets a user profile
  const getProfile = async () => {
    const { data, error } = await client
      .from("profiles")
      .select("*")
      .eq("id", currentUser.value.id)
      .single()
    if (error) {
      console.error(error)
      //account does not exist anymore, wipe local storage and session and hard refresh
      if (error.code === 'PGRST116') {
        await Preferences.clear()
        await localStorage.clear()
        location.reload()
      }
    } else if (data) {
      if (data.initial) {
        const lsSTRING = await Preferences.get({ key: localUserProfileKey })
        const ls = JSON.parse(lsSTRING.value)

        // some odd timing hack to fix the text_size and default station if they come over as an object
        if (typeof ls.text_size === 'object') {
          ls.text_size = ls.text_size.label;
        }
        if (typeof ls.default_live_stream === 'object') {
          ls.default_live_stream = ls.default_live_stream.station;
        }

        // get the system's notification permission and apply it to the ls
        if (isApp.value) {
          await PushNotifications.checkPermissions().then((result) => {
            if (result.receive === "denied") {
              ls.receive_general_notifications = false
            }
            if (result.receive === "granted") {
              ls.receive_general_notifications = true
            }
          })
        }

        // if first time logging in with new profile
        data.initial = false
        data.autodownload = ls.autodownload
        data.receive_general_notifications = ls.receive_general_notifications
        data.text_size = ls.text_size

        // update supabase profile data
        // set the supabase preferences with what is currently set in the local storage
        await client
          .from("profiles")
          .update({
            initial: false,
            autodownload: ls.autodownload,
            receive_general_notifications: ls.receive_general_notifications,
            text_size: ls.text_size,
          })
          .match({ id: currentUser.value.id })

        // set the current user profile state
        currentUserProfile.value = data
        setDisplaySettings(data)
      } else {
        // set the current user profile state
        currentUserProfile.value = data
        setDisplaySettings(data)
      }
    }
  }

  // check local storage for the auth token
  if (process.client) {
    const supabaseAuthToken = await Preferences.get({
      key: config.public.supabaseAuthTokenName,
    })

    if (supabaseAuthToken.value) {
      currentUser.value = JSON.stringify(supabaseAuthToken.user)
    }

    // check supabase session for logged in user
    if (user?.data?.session?.user) {
      currentUser.value = user?.data?.session?.user
    }

    // if no network connection, get the user profile from local storage
    if (!isNetworkConnected.value) {
      const lsSTRING = await Preferences.get({ key: localUserProfileKey })
      const ls = JSON.parse(lsSTRING.value)
      currentUserProfile.value = ls

      setDisplaySettings(currentUserProfile.value)
    } else {


      if (!currentUser.value) {
        // initially set default user profile settings or use the local storage settings

        // does local storage settings exist?
        const isLocalUserProfile = await Preferences.get({ key: localUserProfileKey })
        if (!isLocalUserProfile.value) {
          // no, set defaults from localUserProfileDefault state
          const defaults = localUserProfileDefault.value

          // get the system's notification permission and apply it to the initial defaults
          if (isApp.value) {
            await PushNotifications.checkPermissions().then((result) => {
              if (result.receive === "denied") {
                defaults.receive_general_notifications = false
              }
              if (result.receive === "granted") {
                defaults.receive_general_notifications = true
              }
            })
          }

          const defaultsSTRING = JSON.stringify(defaults)
          await Preferences.set({
            key: localUserProfileKey,
            value: defaultsSTRING,
          })

          currentUserProfile.value = defaults

          //set display settings
          setDisplaySettings(defaults)
        } else {
          // local storage is set, so set currentUserProfile to the local storage settings
          currentUserProfile.value = JSON.parse(isLocalUserProfile.value)

          // get the system's notification permission and apply it to the currentUserProfile.value
          if (isApp.value) {
            await PushNotifications.checkPermissions().then((result) => {
              if (result.receive === "denied") {
                currentUserProfile.value.receive_general_notifications = false
              }
              if (result.receive === "granted") {
                currentUserProfile.value.receive_general_notifications = true
              }
            })
          }

          //set display settings
          setDisplaySettings(currentUserProfile.value)
        }
      } else {
        // if they are a user, get their profile data
        await getProfile()
        // get the device id if it's an app and not a browser
        if (isApp.value) {
          await initDeviceId()
        }
        await getFavoritedItems()
      }
    }
  }
}

interface SavedItem {
  uid: string
  type: string
  cmsSource: string
  media_id: string
  slug: string
  reading_time: string
  title: string
  image: any
  producingOrganizations: any
  authors: any
  meta: any
  audio: any
  showTitle: string
}

export const deleteFavorite = async (soundId) => {
  // detect if logged in
  const user = useCurrentUser()
  if (user.value) {
    const client = useSupabaseClient()
    const { error } = await client
      .from('favorited')
      .delete()
      .eq("sound_id", soundId)
    if (error) {
      console.error("error deleting favorite", error)
    }
  }
}

// handles saving a favorite
export const saveFavorite = async (soundId) => {
  const user = useCurrentUser()
  if (user.value) {
    const client = useSupabaseClient()
    const { error } = await client
      .from('favorited')
      .upsert({
        uuid: user.value.id,
        sound_id: soundId,
      })
      .match({ uuid: user.value.id })
    if (error) {
      console.error("error = ", error)
    }
  }
}

// normalize the bucket item data for the player
export const prepForPlayer = (item, index = null) => {
  const isSegment = index !== null

  const fileValue = item.file?.includes("blob:")
    ? item.file
    : isSegment
      ? item.audio[index]
      : item.audio || item.hls

  return {
    ...item,
    file: fileValue,
    audio: fileValue,
    hls: item.hls,
    title: isSegment ? item.segments[index].title : item.title,
    image:
      item.image?.template ??
      item.image ??
      item.listingImage?.template ??
      item.showImage ??
      getEpisodeFallBackImage(),
    duration: item.estimatedDuration || item.duration,
    details: isSegment ? item.segments[index].tease : item.body,
    first_published_at: isSegment ? item.segments[index].newsdate : item.publishAt,
  }
}

// handles playing episodes and segments
export const togglePlayEpisode = (media, type = mediaTypes.EPISODE, index = 0) => {
  const currentEpisode = useCurrentEpisode()
  const togglePlayTrigger = useTogglePlayTrigger()
  if (typeof media.audio === "string") {
    if (currentEpisode.value?.audio !== media.audio) {
      currentEpisode.value = prepForPlayer(media)
    }
  } else {
    // segment
    if (currentEpisode.value?.file !== media.audio[index]) {
      currentEpisode.value = prepForPlayer(media, index)
    }
  }
  togglePlayTrigger.value = !togglePlayTrigger.value
}

// checks if the audio key has a valid value for having audio
export const hasAudio = (audio) => {
  return (
    audio &&
    ((typeof audio === "string" && audio.trim() !== "") ||
      (Array.isArray(audio) &&
        audio.length > 0 &&
        audio.every((item) => item && typeof item === "string" && item.trim() !== "")))
  )
}

// function to add to the favorites
export const addToFavorites = async (item, isFavorited, message = isFavorited ? "Removed from Favorites" : "Added to Favorites") => {
  const user = useCurrentUser()
  const accountPromptSideBar = useAccountPromptSideBar()
  if (user.value) {
    const globalToast = useGlobalToast()
    if (isFavorited) {
      await deleteFavorite(item.id)
      getFavoritedItems()
    } else {
      await saveFavorite(item.id)
      getFavoritedItems()
    }
    globalToast.value = {
      severity: "info",
      summary: message,
      life: 3000,
    }
  } else {
    accountPromptSideBar.value = true
  }
}

// handles the permissions for push & local notifications
export const askNotificationPermisstions = async () => {
  const currentUserProfile = useCurrentUserProfile()
  await PushNotifications.requestPermissions().then((result) => {
    //alert('push request' + JSON.stringify(result))
    if (result.receive === "granted") {
      // Register with Apple / Google to receive push via APNS/FCM
      PushNotifications.register()
      currentUserProfile.value.receive_general_notifications = true
    } else {
      currentUserProfile.value.receive_general_notifications = false
    }
  })
}

// handles iOS asking permission for tracking
export const askTrackingPermissions = async () => {
  if (Capacitor.getPlatform() === "ios") {
    await AppTrackingTransparency.requestPermission().then(
      (response: AppTrackingStatusResponse) => {
        // we are currently not doing anything with the response
        if (response.status === "authorized") {
          // User has authorized
          // eventualy add this preference to the users profile
          // attach it to a toggle switch in the settings that triggerss the request again
        }
      }
    )
    // AppTrackingTransparency.getStatus().then((response: AppTrackingStatusResponse) => {
    //   console.log("getStatus response: ", response)
    //   if (response.status === "authorized") {
    //     // User has authorized
    //   }
    // })
  }
}

// handles the toggling of permissions for push & local notifications. Either to use the available propt, or route to the system settings to manually change it
export const toggleAskNotificationPermisstions = async (isEnabled = true) => {
  await nextTick()
  const permStatus = await PushNotifications.checkPermissions()
  if (
    isEnabled === true &&
    (permStatus.receive === "prompt" || permStatus.receive === "prompt-with-rationale")
  ) {
    askNotificationPermisstions()
  } else {
    toSystemSettings()
  }
}

// log out the current user
export const logOutUser = async () => {
  const client = useSupabaseClient()
  const currentUser = useCurrentUser()
  const currentEpisode = useCurrentEpisode()
  const currentEpisodeHolder = useCurrentEpisodeHolder()
  const isEpisodePlaying = useIsEpisodePlaying()

  // sign out from supabase
  await client.auth.signOut()

  // set the currentUser composable to null
  currentUser.value = null

  // clear what is playing
  currentEpisode.value = null
  currentEpisodeHolder.value = null
  isEpisodePlaying.value = false

  // clear the local storage
  await Preferences.clear()

  getAndSetUserProfile()
}

// Custom sorting function that ignores "A " and "The " at the beginning of titles
export const customAlphabeticalSort = (key = 'title') => {
  return (a, b) => {
    // get the value from the key
    const getValue = (obj, key) => obj[key];

    // get the title without "A " or "The " at the beginning
    const getTitle = (title) => {
      const prefixes = ["A ", "The "];
      for (const prefix of prefixes) {
        if (title.startsWith(prefix)) {
          return title.substring(prefix.length);
        }
      }
      return title;
    };

    const aValue = getTitle(getValue(a, key));
    const bValue = getTitle(getValue(b, key));

    if (aValue !== bValue) {
      return aValue.localeCompare(bValue);
    }

    return a.localeCompare(b);
  };
};
