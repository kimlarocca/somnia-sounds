// import { sentryVitePlugin } from '@sentry/vite-plugin'
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/ionic',
    '@nuxtjs/device',
    '@nuxt/image',
    '@hypernym/nuxt-gsap',
    "@vueuse/nuxt"
  ],

  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: false,
  },

  image: {
    dir: 'public/',
    screens: {
      xs: 390,
      sm: 640,
      md: 767,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      '2xl': 1920
    }
  },

  /* ssr: process.env.ISAPP === 'false' ? true : false, */
  ssr: false,

  ionic: {
    integrations: {
      router: false,
    },
    css: {
      core: false,
      basic: false,
    }
  },

  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in' // default
    },
    layoutTransition: true,
    head: {
      title: 'Somnia Sounds',
      meta: [
        { name: 'viewport', content: 'viewport-fit=cover, width=device-width, initial-scale=1, maximum-scale=1' }
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: 'https://media.wnyc.org/static/img/favicon_wnyc.ico?_=1553611630' // KIM TO DO
        }
      ]
    }
  },

  css: [
		'primevue/resources/themes/mdc-light-deeppurple/theme.css',
    'primevue/resources/primevue.min.css',
		'primeicons/primeicons.css',
		'primeflex/primeflex.css',
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // be sure to mirror theses imports in the vitest.config.ts
          additionalData: '@import "~/assets/scss/global.scss";',
        },
      },
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule: { name: string; remove: () => void; }) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              }
            }
          }
        ]
      }
    },
    // plugins: [
    //   process.env.SENTRY_ENV === 'development'
    //     ? null
    //     : sentryVitePlugin({
    //       include: '.nuxt/dist',
    //       ignore: ['node_modules', 'nuxt.config.ts'],
    //       org: 'nypublicradio',
    //       project: 'wnyc-vue3',
    //       authToken: process.env.SENTRY_AUTH_TOKEN,
    //     }),
    // ],
  },

  sourcemap: {
    client: true,
    server: true,
  },

  components: [
    '~/components',
    '~/components/icons',
  ],

  imports: {
    dirs: [
      'composables', // top-level modules
      'composables/icons',
      'composables/*/index.{ts,js,mjs,mts}' // one level directories's index.js,
    ]
  },

  build: {
    transpile: [
      'primevue'
    ]
  },

  plugins: [
    '~/plugins/primevue.js',
    '~/plugins/router-guards.js',
    '~/plugins/error-handler.js',
    '~/plugins/firebase.js',
  ],

  experimental: {
    crossOriginPrefetch: true
  },

  runtimeConfig: {
    public: {
      SENTRY_DSN: process.env['SENTRY_DSN'],
      SENTRY_ENV: process.env.SENTRY_ENV ?? 'prod',
      ENV: process.env.ENV ?? 'prod',
      FB_MEASUREMENT_ID: process.env.FB_MEASUREMENT_ID,
      FB_API_KEY_WEB: process.env.FB_API_KEY_WEB,
      FB_API_KEY_IOS: process.env.FB_API_KEY_IOS,
      FB_API_KEY_ANDROID: process.env.FB_API_KEY_ANDROID,
      FB_AUTH_DOMAIN: process.env.FB_AUTH_DOMAIN,
      FB_PROJECT_ID: process.env.FB_PROJECT_ID,
      FB_STORAGE_BUCKET: process.env.FB_STORAGE_BUCKET,
      FB_MESSAGING_SENDER_ID: process.env.FB_MESSAGING_SENDER_ID,
      FB_APP_ID_WEB: process.env.FB_APP_ID_WEB,
      FB_APP_ID_IOS: process.env.FB_APP_ID_IOS,
      FB_APP_ID_ANDROID: process.env.FB_APP_ID_ANDROID,
      environment: process.env.environment ?? 'prod',
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      supabaseAuthSignInRedirectTo: process.env.SUPABASE_AUTH_SIGN_IN_REDIRECT_TO,
      supabaseAuthTokenName: process.env.SUPABASE_AUTH_TOKEN_NAME,
      APP_VERSION: process.env.APP_VERSION ?? 'x.x.x',
    }
  },
  compatibilityDate: '2024-10-31',
})