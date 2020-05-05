import { Configuration } from '@nuxt/types';

const pkg = require('./package');

const config: Configuration = {
  buildModules: [
    '@nuxt/typescript-build',
    [
      '@nuxtjs/vuetify',
      {
        defaultAssets: {
          font: {
            family: 'Roboto',
          },
          icons: 'mdi',
        },
      },
    ],
    '@nuxtjs/gtm',
  ],
  typescript: {
    typeCheck: true,
    ignoreNotFoundWarnings: true,
  },
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      {
        charset: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        name: 'theme-color',
        content: '#1f222a',
      },
      {
        property: 'ix:host',
        content: 'flint-gg.imgix.net',
      }, // this is for our imgix library
      {
        hid: 'description',
        name: 'description',
        content:
          'Easily, quickly and securely share media from your Nintendo Switch to other platforms.',
      },
      {
        hid: 'title',
        name: 'title',
        content: 'Easyshare for Nintendo Switch - by flint.gg',
      },
    ],
    link: [
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons',
      },
    ],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#35E4D8',
  },

  /*
   ** Global CSS
   */
  css: ['~/assets/style/normalize.css', '~/assets/style/app.scss'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/vuetify',
    '~/plugins/imgixPlugin',
    {
      src: '~/plugins/vueModal',
      mode: 'client',
    },
    '~/plugins/resizeTextPlugin',
    '~/plugins/vueTooltip',
    '~/plugins/mountedHook',
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/axios',
    '@nuxtjs/toast',
    'nuxt-clipboard2',
    'cookie-universal-nuxt',
    '@nuxtjs/svg',
    'vue-scrollto/nuxt',
  ],
  // override purgecss settings: not done here

  // pwa options
  pwa: {
    manifest: {
      name: 'flint.gg',
      lang: 'en',
    },
    workbox: {
      runtimeCaching: [
        {
          // Should be a regex string. Compiles into new RegExp('https://my-cdn.com/.*')
          urlPattern: 'https://flint-gg.imgix.net/.*',
          // Defaults to `networkFirst` if omitted
          // handler: 'networkFirst',
          // Defaults to `GET` if omitted
          // method: 'GET'
        },
      ],
    },
    /* // icon options
    icons: {

    }, */
  },
  // endof pwa options

  gtm: {
    id: 'GTM-PDT5WHT',
    pageTracking: true,
  },

  // change toast options
  toast: {
    position: 'top-right',
    duration: '5000',
    containerClass: 'toast-container',
  },

  env: {
    SITE_URL: process.env.SITE_URL as string,
    PORT: process.env.PORT as string,
    EXPERIMENTAL: process.env.EXPERIMENTAL as string,
  },

  /*
   ** Build configuration
   */
  build: {
    babel: {
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
      ],
      presets: [
        [
          '@nuxt/babel-preset-app',
          {
            modules: 'commonjs',
          },
        ],
      ],
    },
    loaders: {
      stylus: {
        import: ['~assets/style/variables.scss'],
      },
    },
    extractCSS: true,
    /*
     ** You can extend webpack config here
     */
    extend(conf /* , ctx */) {
      /* conf.module!.rules.push({

      }); */
    },
  },
};
// module.exports = config;
export default config;
