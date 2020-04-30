<template>
  <section>
    <h3 class="center-text">
      {{ userToken ? '' : 'Welcome to' }} Nintendo Switch Easyshare&trade; by
      <img
        ix-path="branding/textlogo"
        ix-params='{
            "fit": "crop",
            "auto": "format"
            }'
        sizes="100px"
      />
    </h3>

    <section v-if="userToken">
      <section v-if="!userName" class="accounts">
        <loading
          message="loading profile..."
          class="account-section"
          :inline="true"
        />
      </section>
      <section v-else class="accounts">
        <section class="account-section">
          <h3 style="margin-top:0px;">
            Welcome back, <strong>{{ userName }}</strong
            >.
          </h3>
          <section v-if="!linkedPhotos">
            <Button
              :onClick="redirectToPhotos"
              color="white"
              style="margin-bottom:2rem;"
              ><img
                src="~/assets/images/switch-share/photos_64dp.png"
                class="icon-in-button"
              />Connect Google Photos</Button
            >
            <h4>
              Please add the account you want to send your media to.
            </h4>
            We will create an album and upload media to it. You can disconnect
            or change your Google Photos account at any time. <br />
            <br />
          </section>
          <section v-else-if="stats" class="stats">
            <h4>Your personal usage summary:</h4>
            <ul>
              <li v-for="(s, i) in statsToDisplay" :key="s.title">
                <div
                  class="user-score"
                  :class="{
                    'user-score-leading': i === statsToDisplay.length - 1
                  }"
                >
                  {{ s.amount }}
                </div>
                <p class="user-name">{{ s.title }}</p>
              </li>
            </ul>
          </section>
          <Button :onClick="logout" color="grey" class="stick-to-bottom"
            >Log out</Button
          >
        </section>
        <section v-if="linkedPhotos" class="account-section">
          <h4>Toggle hashtags to track:</h4>
          <Button
            v-for="v in displayHashtags"
            :key="v.value"
            :onClick="() => toggleTracking(v.value, v.following)"
            :style="
              v.value === displayHashtags.length ? 'margin-bottom: 20px;' : ''
            "
            :color="v.following ? 'white' : 'grey'"
            :lowercase="true"
            >#{{ v.tag }}</Button
          >
          <Button
            :onClick="saveTags"
            :color="changedTags ? 'green' : 'grey'"
            class="stick-to-bottom"
            >Save changes</Button
          >
        </section>
      </section>
    </section>
    <section class="accounts">
      <section v-if="!userToken" class="account-section">
        <Button :onClick="redirectToTwitter" color="white">
          <img
            src="~/assets/images/switch-share/Twitter_Logo_Blue.svg"
            class="icon-in-button"
          />
          Sign in with twitter
        </Button>
      </section>
      <section
        v-if="userToken && userName && linkedPhotos"
        class="account-section"
      >
        <h4>Your Google Photos Account is connected.</h4>
        <Button :onClick="removePhotos" color="red">Disconnect</Button>
      </section>
    </section>
    <section class="accounts">
      <section class="account-section tutorial">
        <h3 style="margin-top:0px;">
          What's this all about?
        </h3>
        <p>
          Getting screenshots such as images and videos from your Nintendo
          Switch to your
          <strong>computer, smartphone and social media </strong> is difficult.
          Easyshare by flint.gg takes care of all the difficulties and makes it
          <strong>easy for you</strong>.
        </p>
        <div class="item">
          <h4>Upload media directly from your Switch</h4>
          Pick from a set of hashtags to track, such as #NintendoSwitch, and
          simply post to Twitter directly from your Switch. We will grab the
          content and delete the original tweet, keeping your Twitter timeline
          clean for everyone.
        </div>
        <div class="item">
          <h4>Get your media to where you want it</h4>
          Once our system receives your media, it directly forwards it to an
          album in your Google Photos account. No tracking, no detours, no
          delay. Just what you need, where you need it.
        </div>
        <h3 style="margin-top:0px;">
          I got a question!
        </h3>
        <div class="item">
          <h4>Why Twitter and Google Photos?</h4>
          Nintendo supports sharing to Twitter, and we take advantage of
          that.<br />
          Google Photos allows you to access your media online or on apps on
          both Android and iOS. It's super easy to share onto other platforms
          from there as well!
        </div>
        <div class="item">
          <h4>I have an idea for a new feature!</h4>
          This tool is currently in its very beginning, and depending on user
          feedback we will think about adding new ways to get, share and display
          your media! If you got some ideas, just hit us up!
        </div>
        <div class="item">
          <h4>How can i contact you?</h4>
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
import loading from '~/components/loading/loading.vue';
import Button from '~/components/Button.vue';
import {
  switchHashtag,
  userForClient,
  switchStat,
  switchEvent,
} from '~/server/switch-share/enums';

@Component({ components: { loading, Button } })
export default class serviceCallback extends Vue {
  get userToken() {
    return !this.loggingOut && localStorage.getItem('switchshare/token');
  }

  get linkedPhotos() {
    return (
      !this.loggingOut && Boolean(localStorage.getItem('switchshare/photos'))
    );
  }

  twitterToken: string | undefined;

  gphotosUrl: string | undefined;

  loggingOut = false;

  changedTags = false;

  userName: string | null = null;

  followedHashtags: Array<switchHashtag> | null = null;

  allHashtags: Array<string> | null = null;

  stats: Array<switchStat> | null = null;

  get singleImageStat() {
    const st = this.stats && this.stats.find((s) => s.type === switchEvent.singleImage);
    return st ? Number(st.amount) : 0;
  }

  get multiImageStat() {
    const st = this.stats && this.stats.find((s) => s.type === switchEvent.multiImage);
    return st ? Number(st.amount) : 0;
  }

  get singleVideoStat() {
    const st = this.stats && this.stats.find((s) => s.type === switchEvent.singleVideo);
    return st ? Number(st.amount) : 0;
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
      amount: this.singleImageStat + this.singleVideoStat + this.multiImageStat,
    });
    return ret;
  }

  get displayHashtags() {
    return (
      this.allHashtags
      && this.allHashtags
        .map((h, index) => {
          const following = this.followedHashtags!.findIndex((val) => val === index) > -1;
          return { tag: h, following, value: index as switchHashtag };
        })
        .slice(1)
    );
  }

  async mounted() {
    if (!this.userToken) {
      this.twitterToken = (await PostService.get<string>('twitter')).data;
    } else {
      const { data: dat } = await PostService.get<userForClient>('account', {
        headers: { Authorization: `Bearer ${this.userToken}` },
      });
      if (dat) {
        this.userName = dat.name;
        this.allHashtags = ['dummyToCorrectIndexForEnum'].concat(
          dat.hashtagsToFollow,
        );
        this.followedHashtags = dat.hashtags;
        this.stats = dat.stats;
        if (dat.linkedPhotos) {
          localStorage.setItem('switchshare/photos', 'true');
        } else {
          const { data, error } = await PostService.get<string>('photos', {
            headers: { Authorization: `Bearer ${this.userToken}` },
          });
          if (error) {
            this.logout();
          } else {
            this.gphotosUrl = data;
          }
        }
      } else {
        this.userName = null;
        this.allHashtags = null;
        this.followedHashtags = null;
        localStorage.removeItem('switchshare/photos');
        localStorage.removeItem('switchshare/token');

        this.twitterToken = (await PostService.get<string>('twitter')).data;
      }
      // reload computed properties
      this.loggingOut = true;
      this.loggingOut = false;
    }
  }

  redirectToTwitter() {
    if (this.twitterToken) {
      window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${this.twitterToken}`;
    }
  }

  redirectToPhotos() {
    if (this.gphotosUrl) {
      window.location.href = this.gphotosUrl;
    }
  }

  toggleTracking(value: switchHashtag, currently: boolean) {
    if (this.followedHashtags) {
      if (!currently) {
        this.followedHashtags = [...this.followedHashtags, value];
      } else {
        const index = this.followedHashtags.findIndex((v) => v === value);
        this.followedHashtags = [
          ...this.followedHashtags.slice(0, index),
          ...this.followedHashtags.slice(index + 1),
        ];
      }
      this.loggingOut = true;
      this.loggingOut = false;
      this.changedTags = true;
    }
  }

  async logout() {
    localStorage.removeItem('switchshare/token');
    localStorage.removeItem('switchshare/photos');
    this.userName = null;
    this.allHashtags = null;
    this.followedHashtags = null;
    this.loggingOut = true;
    this.twitterToken = (await PostService.get<string>('twitter')).data;
  }

  async removePhotos() {
    const { error } = await PostService.delete<string>('photos', {
      headers: { Authorization: `Bearer ${this.userToken}` },
    });
    if (error) {
      throw error;
    } else {
      localStorage.removeItem('switchshare/photos');
      this.loggingOut = true;
      this.loggingOut = false;
      this.$toast.success('Removed your Photos account.');
      // get token to link again
      const { data } = await PostService.get<string>('photos', {
        headers: { Authorization: `Bearer ${this.userToken}` },
      });
      if (data) {
        this.gphotosUrl = data;
      }
    }
  }

  async saveTags() {
    if (this.changedTags) {
      if (!this.followedHashtags || this.followedHashtags.length === 0) {
        // eslint-disable-next-line no-throw-literal
        throw {
          title: 'Failed to save your changes',
          detail: 'You need to choose a least one hashtag to follow!',
        };
      }
      const { error } = await PostService.patch(
        'account',
        {
          hashtags: this.followedHashtags,
        },
        {
          headers: { Authorization: `Bearer ${this.userToken}` },
        },
      );
      if (error) {
        throw error;
      } else {
        this.$toast.success('Saved your changes.');
        this.changedTags = false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
}
.stick-to-bottom {
  margin-top: auto;
}
.tutorial {
  max-width: 600px;
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
</style>
