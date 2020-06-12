<template>
  <v-app>
    <v-content> <nuxt /> </v-content
    ><PopUp
      style="z-index: 1000;"
      :display="errorTitle"
      color="#f04747"
      :title="/*'Error: ' + */ errorTitle"
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
  </v-app>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator';

import Vue from 'vue';
import PopUp from '~/components/Popup.vue';

@Component({
  components: {
    PopUp,
  },
})
export default class empty extends Vue {
  errorMsg = null;

  errorTitle = null;

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

<style lang="scss" scoped>
.error-close-button {
  margin-top: 25px;
}
@media (min-width: 769px) {
  .error-close-button {
    max-width: 13rem;
  }
}
</style>
