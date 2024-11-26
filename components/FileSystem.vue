<script setup>
import {
  //useFileSystem,
  useFileSystemLS
} from '~/composables/states'

//const fileSystem = useFileSystem()
const fileSystemLS = useFileSystemLS()

// const used = ref(0)
// const granted = ref(0)

// get the used and granted storage
// watch(
//   fileSystem,
//   (/* value */) => {
//     navigator.webkitPersistentStorage.queryUsageAndQuota((usedBytes, grantedBytes) => {
//       //console.log('we are using ', usedBytes, ' of ', grantedBytes, 'bytes')
//       used.value = usedBytes
//       granted.value = grantedBytes
//     })
//   },
//   { deep: true }
// )
</script>

<template>
  <div>
    <div class="file-system">
      <!-- <p>!!Storage limit: {{ used }} of {{ granted }}</p> -->
      <div>
        <div class="flex flex-column-reverse gap-4 mt-2">
          <Item
            v-for="file in fileSystemLS"
            :data="file"
            :key="`EI-${file.id}`"
            isInDownloads
          >
            <!-- <div class="flex gap-2 z-2 align-items-center">
              <DownloadProgress class="mr-2" :isDownloaded="true" :progress="1" small />
              <Button
                icon="pi pi-trash"
                text
                rounded
                aria-label="delete"
                @click="handleDelete(file)"
              />
            </div> -->
          </Item>
        </div>
      </div>
    </div>
  </div>
</template>
