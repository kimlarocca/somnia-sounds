/// <reference types="vitest" />

import { defineConfig/* , loadEnv */ } from 'vite'
import vue from '@vitejs/plugin-vue'

export default (/* { mode } */) => {
  // process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  // const envTheme = process.env.VITE_VUE_APP_THEME

  return defineConfig({
    plugins: [
      vue(),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
    },
    css: {
      preprocessorOptions: {
        scss: {
          // besure to mirror theses imports in the nuxt.config.ts
          additionalData: ' @import "~/assets/scss/global.scss";',
        },
      },
    },
  })
}





