<template>
  <section>
    <h3 class="center-text">
      Nintendo Switch Easyshare<!-- &trade; -->
      by
      <img
        ix-path="branding/textlogo"
        ix-params='{
            "fit": "crop",
            "auto": "format"
            }'
        sizes="100px"
      />
      usage statistic
    </h3>
    <Button
      style="max-width:160px; margin:auto;"
      :onClick="
        () =>
          $router.push({
            path: '/'
          })
      "
      color="grey"
      >Back to the tool</Button
    >

    <section class="accounts">
      <section class="account-section">
        <section v-if="stats" class="stats">
          <h4>Alltime stats:</h4>
          <ul>
            <li v-for="(s, i) in statsToDisplay" :key="s.title">
              <div
                class="user-score"
                :class="{
                  'user-score-leading': i === 3
                }"
              >
                {{ s.amount }}
              </div>
              <p class="user-name">{{ s.title }}</p>
            </li>
          </ul>
        </section>
      </section>
    </section>

    <section class="accounts">
      <section class="account-section tutorial">
        <h3>
          What's this all about?
        </h3>
        <p>
          Getting media, such as screenshots and videos, from your Nintendo
          Switch to your
          <strong>computer, smartphone and social media</strong> is difficult.
          Easyshare by flint.gg takes care of all the difficulties and makes it
          <strong>easy for you</strong>.
        </p>
        <h3>
          I've got a question!
        </h3>
        <div class="item">
          <h4>Why Twitter and Google Photos?</h4>
          Nintendo supports sharing to Twitter &ndash; we take full advantage of
          that.<br />
          Google Photos allows you to access your media online or on apps on
          both Android and iOS. It's super easy to share onto other platforms
          from there as well.
        </div>
        <div class="item">
          <h4>I have an idea for a new feature!</h4>
          This tool is currently at its very beginning. Depending on user
          feedback we'll think about adding new ways to get, share and display
          your media. If you've got some ideas, just hit us up!
        </div>
        <div class="item">
          <h4>How can I contact you?</h4>
          You can always hang out or give feedback on
          <a href="https://discord.gg/vC2R7xx">our Discord server</a>!
        </div>
      </section>
    </section>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'nuxt-property-decorator';
import { PostService } from '~/scripts/postService';
import { switchStat, switchEvent } from '~/server/switch-share/enums';
import Button from '~/components/Button.vue';

@Component({ components: { Button } })
export default class serviceCallback extends Vue {
  stats: Array<switchStat & { author: string }> | null = null;

  get singleImageStat() {
    const st = this.stats
      && this.stats
        .filter((s) => s.type === switchEvent.singleImage)
        .reduce((p, n) => p + Number(n.amount), 0);
    return st || 0;
  }

  get multiImageStat() {
    const st = this.stats
      && this.stats
        .filter((s) => s.type === switchEvent.multiImage)
        .reduce((p, n) => p + Number(n.amount), 0);
    return st || 0;
  }

  get singleVideoStat() {
    const st = this.stats
      && this.stats
        .filter((s) => s.type === switchEvent.singleVideo)
        .reduce((p, n) => p + Number(n.amount), 0);
    return st || 0;
  }

  get signupStat() {
    const st = this.stats
      && this.stats
        .filter((s) => s.type === switchEvent.signup)
        .reduce((p, n) => p + Number(n.amount), 0);
    return st || 0;
  }

  get loginStat() {
    const st = this.stats
      && this.stats
        .filter((s) => s.type === switchEvent.login)
        .reduce((p, n) => p + Number(n.amount), 0);
    return st || 0;
  }

  get logoutStat() {
    const st = this.stats
      && this.stats
        .filter((s) => s.type === switchEvent.logout)
        .reduce((p, n) => p + Number(n.amount), 0);
    return st || 0;
  }

  get linkPhotosStat() {
    const st = this.stats
      && this.stats
        .filter((s) => s.type === switchEvent.linkPhotos)
        .reduce((p, n) => p + Number(n.amount), 0);
    return st || 0;
  }

  get unlinkPhotosStat() {
    const st = this.stats
      && this.stats
        .filter((s) => s.type === switchEvent.unlinkPhotos)
        .reduce((p, n) => p + Number(n.amount), 0);
    return st || 0;
  }

  get changeSettingsStat() {
    const st = this.stats
      && this.stats
        .filter((s) => s.type === switchEvent.changeSettings)
        .reduce((p, n) => p + Number(n.amount), 0);
    return st || 0;
  }

  get statsToDisplay() {
    const ret: Array<{ title: string; amount: number }> = [];
    ret.push({
      title: 'single-image uploads',
      amount: this.singleImageStat,
    });
    ret.push({
      title: 'multi-image uploads',
      amount: this.multiImageStat,
    });
    ret.push({
      title: 'video uploads',
      amount: this.singleVideoStat,
    });
    ret.push({
      title: 'accumulated usage',
      amount: ret.reduce((p, n) => p + n.amount, 0),
    });
    ret.push({
      title: 'signups',
      amount: this.signupStat,
    });
    ret.push({
      title: 'logins',
      amount: this.loginStat,
    });
    ret.push({
      title: 'logouts',
      amount: this.logoutStat,
    });
    ret.push({
      title: 'google photos linked',
      amount: this.linkPhotosStat,
    });
    ret.push({
      title: 'google photos unlinked',
      amount: this.unlinkPhotosStat,
    });
    ret.push({
      title: 'settings changed',
      amount: this.changeSettingsStat,
    });

    return ret;
  }

  async mounted() {
    if (!this.stats) {
      this.stats = (await PostService.get<Array<switchStat & { author: string }>>('stats'))
        .data || null;
    }
  }
}
</script>

<style lang="scss" scoped>
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

.center-text {
  text-align: center;
}

.accounts {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.account-section {
  width: 300px;
  margin: 1rem;
  padding: 1rem;
  border-radius: 5px;
  background-color: #172a3a;
  strong {
    color: #35e4d8;
  }
  display: flex;
  flex-direction: column;
  .white {
    color: #172a3a;
  }
  > h3 {
    margin-top: 0px;
  }
}
@media (max-width: 400px) {
  .account-section {
    margin-left: auto;
    margin-right: auto;
  }
}

.stick-to-bottom {
  margin-top: auto;
}
.tutorial {
  max-width: 900px;
  width: auto;

  h4 {
    color: #35e4d8;
    margin-top: 0px;
  }
  a {
    color: #35e4d8;
  }

  div {
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    margin-bottom: 10px;
  }
}
.stats {
  ul {
    display: flex;
    flex-direction: column;
    padding: 0;
  }

  li {
    display: flex;
    padding: 5px;
    background-color: rgba(255, 255, 255, 0.1);
    order: 1;
    border-radius: 10px;
    margin-bottom: 10px;
  }

  .user-name {
    margin-left: 0;
    margin-right: 10px;
    margin-top: auto;
    margin-bottom: auto;
  }

  .user-score {
    margin-right: 10px;
    min-width: 38px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    background-color: #2b353f;
    font-family: Exo-Bold;
    padding: 10px;
  }
  .user-score.user-score-leading {
    color: #35e4d8;
  }
}

.icon-in-button {
  width: 38px;
  height: 38px;
  margin-right: 5px;
}

.tutorial-icon {
  margin-left: auto;
  margin-right: auto;
  height: 64px;
  width: 64px;
  fill: #ecfeff;

  &--cascading {
    * {
      fill: #ecfeff;
    }
  }
  &--twitter {
    > path {
      fill: #ecfeff;
    }
  }
  &--smol {
    width: 32px;
  }
  &--switch {
    margin-right: 15px;
  }
}

.tutorial-section {
  width: 300px;
  margin: 1rem;
  padding: 1rem;
  border-radius: 5px;
  background-color: #172a3a;
  strong {
    color: #35e4d8;
  }
  display: flex;
  flex-direction: column;
  > div {
    margin-left: auto;
    margin-right: auto;
  }

  h4 {
    color: #35e4d8;
  }
}

.tutorial-next {
  height: 64px;
  width: 64px;
  margin-right: -20px;
  margin-left: -28px;
  margin-top: auto;
  margin-bottom: auto;
  fill: #ecfeff;
}

.center-vertical {
  margin-top: auto;
  margin-bottom: auto;
}

.alert {
  margin: auto;
  max-width: 900px;
}
</style>
