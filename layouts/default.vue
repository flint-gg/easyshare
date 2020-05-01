<template>
  <v-app>
    <div class="landingbody">
      <script type="text/javascript" src="/scripts/ads.js"></script>
      <div v-if="!isMobile" class="topbarcolumns w-row desktop">
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
      <PopUp
        style="z-index:1000;"
        :display="errorTitle"
        color="#f04747"
        :title="errorTitle"
        :onClose="
          () => {
            errorTitle = null;
            errorMsg = null;
          }
        "
      >
        <div v-if="errorMsg">{{ errorMsg }}</div>
        <div v-else>No error Message provided</div>
        <Button
          class="error-close-button"
          color="grey"
          :onClick="
            () => {
              errorTitle = null;
              errorMsg = null;
            }
          "
        >
          Okay</Button
        >
      </PopUp>
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
import PopUp from '~/components/Popup.vue';
import Button from '~/components/Button.vue';

@Component({
  components: {
    CookieLaw,
    PopUp,
    Button,
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
export default class Default extends Vue {
  errorMsg = null;

  errorTitle = null;

  isMobile = isMobile();

  // Catches errors thrown by child components
  errorCaptured(err) {
    // err, vm, info
    if (!err.title) {
      // If its not a flint Error, we pass it down for nuxt to "handle"
      return true;
    }
    this.errorTitle = err.title;
    this.errorMsg = err.detail;
    return false;
  }
}
</script>

<style lang="scss" >
@import '~/assets/style/webflow-rest.css';
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
  background-color: #141f2a;
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
.error-close-button {
  margin-left: auto;
  margin-right: auto;
  margin-top: 25px;
}
@media (min-width: 769px) {
  .error-close-button {
    max-width: 13rem;
  }
}
</style>
