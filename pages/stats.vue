<template>
  <section>
    <h3 class="center-text">
      Easyshare<!-- &trade; -->
      by
      <img
        ix-path="branding/textlogo"
        ix-params='{
            "fit": "crop",
            "auto": "format"
            }'
        sizes="100px"
      />
    </h3>
    <h3 class="center-text">usage stats</h3>
    <section class="accounts">
      <section class="account-section">
        <section v-if="stats" class="stats">
          <h4>Alltime stats:</h4>
          <ul>
            <li v-for="(s, i) in statsToDisplay" :key="s.title">
              <div
                class="user-score"
                :class="{
                  'user-score-leading': i === 4,
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
    <Button
      style="max-width: 160px; margin: auto"
      :onClick="
        () =>
          $router.push({
            path: '/',
          })
      "
      color="grey"
      >Back to the tool</Button
    >
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'nuxt-property-decorator';
import { PostService } from '~/scripts/postService';
import {
  switchStat,
  easyshareEvent,
  easyshareSource,
} from '~/server/easy-share/enums';
import Button from '~/components/Button.vue';

@Component({ components: { Button } })
export default class serviceCallback extends Vue {
  stats: Array<switchStat & { author: string }> | null = null;

  get singleImageStat() {
    return (
      (this.stats
        && this.stats
          .filter((s) => s.type === easyshareEvent.singleImage)
          .reduce((p, c) => p + Number(c.amount), 0))
      || 0
    );
  }

  get multiImageStat() {
    return (
      (this.stats
        && this.stats
          .filter((s) => s.type === easyshareEvent.multiImage)
          .reduce((p, c) => p + Number(c.amount), 0))
      || 0
    );
  }

  get singleVideoStat() {
    return (
      (this.stats
        && this.stats
          .filter((s) => s.type === easyshareEvent.singleVideo)
          .reduce((p, c) => p + Number(c.amount), 0))
      || 0
    );
  }

  get signupStat() {
    return (
      (this.stats
        && this.stats
          .filter((s) => s.type === easyshareEvent.signup)
          .reduce((p, c) => p + Number(c.amount), 0))
      || 0
    );
  }

  get numOfSwitchUse() {
    return (
      (this.stats
        && this.stats
          .filter((s) => s.source === easyshareSource.switch)
          .reduce((p, c) => p + Number(c.amount), 0))
      || 0
    );
  }

  get numOfPS4Use() {
    return (
      (this.stats
        && this.stats
          .filter((s) => s.source === easyshareSource.ps4)
          .reduce((p, c) => p + Number(c.amount), 0))
      || 0
    );
  }

  /* get loginStat() {
    const st = this.stats
      && this.stats
        .filter((s) => s.type === easyshareEvent.login)
        .reduce((p, n) => p + Number(n.amount), 0);
    return st || 0;
  }

  get logoutStat() {
    const st = this.stats
      && this.stats
        .filter((s) => s.type === easyshareEvent.logout)
        .reduce((p, n) => p + Number(n.amount), 0);
    return st || 0;
  }

  get linkPhotosStat() {
    const st = this.stats
      && this.stats
        .filter((s) => s.type === easyshareEvent.linkPhotos)
        .reduce((p, n) => p + Number(n.amount), 0);
    return st || 0;
  }

  get unlinkPhotosStat() {
    const st = this.stats
      && this.stats
        .filter((s) => s.type === easyshareEvent.unlinkPhotos)
        .reduce((p, n) => p + Number(n.amount), 0);
    return st || 0;
  }

  get changeSettingsStat() {
    const st = this.stats
      && this.stats
        .filter((s) => s.type === easyshareEvent.changeSettings)
        .reduce((p, n) => p + Number(n.amount), 0);
    return st || 0;
  }
*/
  get statsToDisplay() {
    const ret: Array<{ title: string; amount: number }> = [];
    ret.push({
      title: 'users',
      amount: this.signupStat,
    });
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
      amount: this.singleImageStat + this.multiImageStat + this.singleVideoStat,
    });
    ret.push({
      title: 'switch shares',
      amount: this.numOfSwitchUse,
    });
    ret.push({
      title: 'ps4 shares',
      amount: this.numOfPS4Use,
    });
    /* ret.push({
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
    }); */

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
