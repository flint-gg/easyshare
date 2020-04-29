<template>
  <div class="vue-load-image" :class="{'absolute': absolute, 'loaded': status === 'loaded'}" >
    <slot
      v-if="$slots.default"
    />
    <slot
      v-if="$slots.image"
      name="image"
    />

    <v-progress-circular
      v-if="status === 'loading'"
      indeterminate
      color="#33e4d8"
      size="50"
    ></v-progress-circular>

    <img
      v-else-if="status === 'failed'"
      class="loading-error"
      src="~/assets/images/icons/ic-close.svg"
    />
  </div>
</template>

<style scoped>
  .vue-load-image img {
    position: relative;
    display: none;
  }

  .vue-load-image.loaded img {
    position: relative;
    display: unset;
  }

  .vue-load-image {
    position: relative;
    height: 100%;
  }

  .vue-load-image .v-progress-circular {
    height: 100% !important;
    overflow: hidden;
  }

  .vue-load-image .loading-error {
    height: 100% !important;
    width: 50px;
    display: unset !important
  }

  .vue-load-image.absolute {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  .vue-load-image.absolute .v-progress-circular,
  .vue-load-image.absolute .loading-error {
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
  }
</style>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'nuxt-property-decorator';

const Status = {
  LOADING: 'loading',
  LOADED: 'loaded',
  FAILED: 'failed',
};
    @Component
export default class LoadingIndicator extends Vue {
        @Prop({ default() {} })
        onFail


        @Prop({ default: false })
        absolute

        status: any = null;

        img: any = null;

        slot: any = null;

        src: any = null;

        @Watch('slot.elm')
        loaded() {
          this.img = this.slot.elm;
          if (this.img) {
            this.img.onload = this.handleLoad;
            this.img.onerror = this.handleError;
          }
        }

        async created() {
          this.status = Status.LOADING;

          if (this.$slots.image
                && this.$slots.image[0].data
                && this.$slots.image[0].data.attrs) {
            // <img src=...>
            this.slot = this.$slots.image[0];
          } else if (this.$slots.default
                && this.$slots.default[0].data
                && this.$slots.default[0].data.attrs) {
            this.slot = this.$slots.default[0];
          }
        }

        async updated() {
          if (this.$slots.image
                && this.$slots.image[0].data
                && this.$slots.image[0].data.attrs) {
            this.slot = this.$slots.image[0];
          } else if (this.$slots.default
                && this.$slots.default[0].data
                && this.$slots.default[0].data.attrs) {
            this.slot = this.$slots.default[0];
          }
        }

        handleLoad() {
          // ix-path images will return an image that is 1x1 pixel instead of throwing error
          // -> call error handler manually
          if (this.img.width === 1 && this.img.height === 1) {
            this.handleError(null);
          } else {
            this.status = Status.LOADED;
          }
        }

        handleError(error) {
          this.status = Status.FAILED;
          if (this.onFail) this.onFail();
        }
}
</script>
