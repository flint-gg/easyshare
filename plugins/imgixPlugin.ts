import Vue from 'vue';
import ImgixClient from 'imgix-core-js';
import { ImgixJs } from 'imgix.js';

declare const window: Window & {
  imgix: ImgixJs;
};

// we need to do this, so that imgix is a globally defined variable
require('imgix.js');

const imgixcore = new ImgixClient({
  domain: 'flint-gg.imgix.net',
});

// this is globally defined
window.imgix.config.host = 'flint-gg.imgix.net';
Vue.prototype.$imgix = window.imgix;
// add the simple URL creator as well, for stuff like BG images, which don't use the img tag
Vue.prototype.$imgixcore = imgixcore;
