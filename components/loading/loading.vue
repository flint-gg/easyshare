<template>
  <div :class="inline ? 'inline' : 'block'">
    <div style="height: 7rem;">
      <flintCar :car-speed="carSpeed" :exhaust-speed="exhaustSpeed" />
    </div>
    <v-progress-linear
      :background-opacity="0.3"
      :query="true"
      :indeterminate="true"
      color="#35E4D8"
      style="margin-top: 0px;"
    />
    <h3>{{ message }}</h3>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'nuxt-property-decorator';
import flintCar from '~/components/loading/flintCar.vue';

@Component({
  components: {
    flintCar,
  },
})
export default class loading extends Vue {
  @Prop()
  carSpeed!: number;

  @Prop()
  exhaustSpeed!: number;

  @Prop({ default: 'Please wait while the app is loading.' })
  message!: string;

  @Prop({ default: false })
  inline!: boolean;
}
</script>

<style lang="scss" scoped>
.inline {
  text-align: center;
  overflow: hidden;
  margin: 10px 0;
}

.block {
  text-align: center;
  min-height: 60vh;
  margin-top: 200px;
  overflow: hidden;
}
</style>
