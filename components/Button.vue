<template>
  <div
    class="wrapper"
    :class="{
      'flint-blue': color === 'blue',
      'flint-grey': color === 'grey',
      white: color === 'white',
      discord: color === 'discord',
      ['dark-blue']: color === 'dark-blue',
      red: color === 'red',
      violet: color === 'violet',
      green: color === 'green'
    }"
    @click="onClick"
  >
    <button
      class="disable-svg-focus"
      :style="lowercase ? '' : 'text-transform: uppercase;'"
    >
      <slot></slot>
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'nuxt-property-decorator';

@Component({
  components: {},
})
export default class Button extends Vue {
  @Prop()
  onClick;

  @Prop({ default: 'blue' })
  color!: string;

  @Prop({ default: false })
  lowercase!: boolean;
}
</script>

<style scoped lang="scss">
.wrapper {
  min-height: 3rem;
  width: calc(100% - 10px);
  border-radius: 4px;
  margin: 5px;
}

.wrapper > button {
  font-family: Exo-Bold;
  font-weight: 900;
  line-height: 1.29;
  letter-spacing: 1.25px;
  text-align: center;
  min-height: inherit;
  height: 100%;
  width: 100%;
}

.wrapper > button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
.disable-svg-focus svg:focus {
  outline: none;
}

.flint-blue {
  background-color: #33e4d8;
}

.flint-grey {
  background-color: rgba(255, 255, 255, 0.1);
}

.dark-blue {
  background-color: rgba(20, 31, 42, 0.6);
}

.discord {
  background-color: rgba(114, 137, 218, 1);
}
.white {
  background-color: #ffffff;
  color: #33e4d8;
  > * {
    fill: #33e4d8;
  }
}
.red {
  background-color: #f04747;
}
.green {
  background-color: lightgreen;
}
.violet {
  background-color: #5274eb;
}
</style>
