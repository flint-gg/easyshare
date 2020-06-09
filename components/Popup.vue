
<template>
  <div
    v-if="display && isMobile"
    :style="cssVars"
    class="center popup--mobile"
    :class="{ fullscreen }"
  >
    <div class="header">
      <div
        class="display-icon"
        :class="{
          battle: icon == 'battle',
          'background-transparent': icon === ''
        }"
      />
      <h1>{{ title }}</h1>
      <div class="close-icon" @click="onClose" />
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
  <div
    v-else-if="display"
    :style="cssVars"
    class="popup--desktop"
    @click.self.stop
  >
    <div class="popup-container center" :class="{ fullscreen }" @click.stop>
      <div class="header">
        <div
          class="display-icon"
          :class="{
            battle: icon == 'battle',
            'background-transparent': icon === ''
          }"
        />
        <h1>{{ title }}</h1>
        <div class="close-icon" @click="onClose"></div>
      </div>
      <div class="content content--desktop">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'nuxt-property-decorator';
import { isMobile } from '~/scripts/isMobile';

@Component
export default class PopUp extends Vue {
  @Prop({ default: 'menu' })
  title!: string;

  @Prop({ default: false })
  fullscreen!: boolean;

  @Prop(/* { default: () =>  this.$router.back() } */)
  onClose;

  @Prop({ default: true })
  display;

  @Prop({ default: '#141f2a' })
  color;

  @Prop({ default: '' })
  icon;

  isMobile = isMobile();

  get cssVars() {
    return {
      '--color': this.color,
    };
  }
}
</script>

<style lang="scss" scoped>
.center {
  text-align: center;
}

.popup-container {
  max-height: 100%;
}

.popup--mobile {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  z-index: 101;
  max-height: calc(var(--vh, 1vh) * 100);
  min-height: 20vh;
}

.popup--desktop {
  position: fixed;
  top: 0;
  left: 0;
  height: calc(var(--vh, 1vh) * 100);
  width: 100%;
  z-index: 101;
  background-color: rgba(0, 0, 0, 0.8);
  padding-left: 6.6rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.header {
  min-height: 61px;
  width: 100%;
  background-color: var(--color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.header h1 {
  text-transform: uppercase;
  font-family: Exo2;
  font-size: 24px;
  font-weight: 900;
  line-height: 1.46;
  margin: auto;
}

.content {
  background-color: #172a3a;
  padding: 1.5rem;
  /* this makes sure it's not fullscreen
  but still scrollable if the screen is so small it becomes fullscreen*/
  max-height: calc((var(--vh, 1vh) * 100) - 61px);
  min-height: calc(100% - 61px);
  overflow-y: auto;
}

.content--desktop {
  min-width: 25vw;
}

.fullscreen {
  height: calc(var(--vh, 1vh) * 100);
}

.background-transparent {
  background-color: #ffffff00 !important ;
}

.close-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  background-color: #ffffff;
  mask: url('~assets/images/icons/ic-clear.svg') no-repeat center;
  mask-size: 32px;
  margin-left: 1rem;
  margin-right: 1rem;
  cursor: pointer;
}

.display-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  background-color: #ffffff;
  mask-size: 32px;
  margin-left: 1rem;
  margin-right: 1rem;
}
.battle {
  mask: url('~assets/images/icons/battle.svg') no-repeat center;
}
</style>
