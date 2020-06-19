<template>
  <div class="container" style="text-align: center; min-height: 80vh;">
    <h1 style="font-size: 100px; margin-top: 50px;">{{ error.statusCode }}</h1>
    <div v-if="error.statusCode === 404">
      <h1>Bloop bleep bleep bloop.</h1>
      <h3>
        The page you are looking for doesn&#x27;t exist or has been moved.
      </h3>
      <br />
    </div>
    <h1 v-else>An error occurred. Sorry for the inconvenience.</h1>
    <div>
      <h2>Wait! Since you're here anyways...</h2>
      <p>
        If you came here and expected a page that worked, we'd appreciate if you
        told us what went wrong!
      </p>
      <p>
        You can contact us via
        <a
          class="flint-link"
          :href="`mailto:contact@flint.gg?subject=flint.gg%20bug%20report`"
          >email</a
        >
        or join our
        <a class="flint-link" href="https://discord.gg/vC2R7xx"
          >discord community</a
        >.
      </p>
    </div>
    <button class="flint-link" @click="$router.back()">
      <h4>go back</h4>
    </button>
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator';
import Vue from 'vue';

@Component({
  props: ['error'],
  layout: 'landing',
})
export default class errorLayout extends Vue {
  isEmpty = (obj: Object): boolean => Object.keys(obj).length === 0;
}
</script>
