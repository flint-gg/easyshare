<template>
  <div class="collapse" :class="{ open: open }">
    <div class="toggle" @click.stop="open = !open">
      <img v-if="!open" src="~/assets/images/icons/ic-unfold-more.svg" />
      <img v-else src="~/assets/images/icons/ic-unfold-less.svg" />
    </div>
    <div class="content">
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      open: false,
    };
  },
};
</script>

<style lang="scss" scoped>
  .collapse {
    display: flex;
    flex-direction: row-reverse;
    margin: 1rem;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  .content {
    flex-grow: 1;
    padding: .5rem 0 .5rem 1.2rem;
  }
  .content > div {
    display: none;
  }

  .toggle {
    padding: 12px;
    text-align: center;
    cursor: pointer;
    user-select: none;
    color: #666;

    img {
      width: 30px;
    }
  }

  .content {
    > :nth-child(2) {
      display: block;
    }
  }

  .open .content > div {
    display: block;
  }
</style>
