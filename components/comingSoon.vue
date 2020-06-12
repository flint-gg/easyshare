<template>
  <div class="coming-soon">
    <slot></slot>
    <img class="icon-top-right" src="~/assets/images/icons/comingSoon.svg" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'nuxt-property-decorator';

@Component({})
export default class comingSoon extends Vue {}
</script>
