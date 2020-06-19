import Vue from 'vue';
// eslint-disable-next-line import/no-extraneous-dependencies
import Vuetify from 'vuetify/lib';
// eslint-disable-next-line import/no-extraneous-dependencies
import colors from 'vuetify/es5/util/colors';

Vue.use(Vuetify, {
  themes: {
    primary: '#35e4d8', // a color that is not in the material colors palette,
    // "primary--text": "#ecfeff", // this changes background not text color...
    accent: colors.grey.darken3,
    secondary: colors.amber.darken3,
    info: colors.teal.lighten1,
    warning: colors.amber.base,
    error: colors.deepOrange.accent4,
    success: colors.green.accent3,
  },
});
