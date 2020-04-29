<template>
  <v-app>
    <div class="landingbody">
      <script type="text/javascript" src="/scripts/ads.js"></script>
      <div class="topbarcolumns w-row">
        <div class="logocolumn w-col w-col-9" style="padding-left: 0px;">
          <a class="logocolumn" href="https://flint.gg">
            <img
              ix-path="branding/logo"
              ix-params='{
            "fit": "crop",
            "auto": "format"
            }'
              sizes="35px"
              alt="flint_logo"
              class="image-27"
            />
            <img
              ix-path="branding/textlogo"
              ix-params='{
            "fit": "crop",
            "auto": "format"
            }'
              sizes="(max-width: 479px) 38vw, 102.609375px"
              alt="flint_logo_text"
              class="image-28"
            />
          </a>
        </div>
      </div>
      <v-content>
        <nuxt />
      </v-content>
    </div>
    <CookieLaw theme="blood-orange">
      <div slot="message">
        We use cookies as well as anonymous analytics to ensure you get the best
        experience possible on our website.
      </div>
    </CookieLaw>
  </v-app>
</template>

<script lang="ts">
import CookieLaw from 'vue-cookie-law';
import { Component } from 'nuxt-property-decorator';

import Vue from 'vue';
import { isMobile } from '~/scripts/isMobile';

@Component({
  components: {
    CookieLaw,
  },
  mounted() {
    // Add CSS variable to use instead of vh, fixes mobile page height issues
    if (isMobile()) {
      // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
      const vh = window.innerHeight * 0.01;
      // Then we set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty('--vh', `${vh}px`);

      // We listen to the resize event
      window.addEventListener('resize', () => {
        // We execute the same script as before
        const vhListener = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vhListener}px`);
      });
    }
  },
})
export default class Default extends Vue {}
</script>

<style lang="scss" >
@import '~/assets/style/flint.webflow.css';
@import '~/assets/style/webflow.css';
@import '~/assets/style/app.scss';
</style>
<style lang="scss" scoped>
.w-col {
  width: 100%;
  left: auto;
  right: auto;
}

.w-col-9 {
  width: 75%;
}

.w-row {
  margin-left: 0;
  margin-right: 0;
}

.w-row:before,
.w-row:after {
  content: ' ';
  display: table;
  grid-column-start: 1;
  grid-row-start: 1;
  grid-column-end: 2;
  grid-row-end: 2;
}

.w-row:after {
  clear: both;
}

.image-27 {
  width: 35px;
  height: 35px;
  margin-top: 3px;
  margin-bottom: 3px;
}

.image-28 {
  display: block;
  height: 30px;
  margin-top: 8px;
  margin-bottom: 2px;
  padding-left: 5px;
}

.topbarcolumns {
  display: flex;
  height: 80px;
  margin-right: 5vw;
  margin-left: 5vw;
  justify-content: center;
  align-items: center;
  border-bottom: 3px none #222929;
  background-color: transparent;
}

.landingbody {
  min-height: calc(var(--vh, 1vh) * 100);
  background-repeat: no-repeat;
  background-size: cover;
  padding-top: 0;
  color: #ecfeff;
}

.logocolumn {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-top: 5px;
  padding-bottom: 5px;
}

@media (max-width: 768px) {
  .topbarcolumns {
    display: flex;
    flex-direction: row;
  }

  .logocolumn {
    display: flex;
    padding-right: 10px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
  }
}
</style>
