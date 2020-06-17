<template>
  <section>
    <h3 class="center-text">
      {{ userToken ? '' : 'Welcome to' }}
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
    </h3>
    <section v-if="userToken">
      <v-alert
        v-if="userName && linkedPhotos && statsToDisplay[3] === 0"
        class="alert"
        type="info"
        color="blue"
        :dismissible="true"
      >
        Thanks for signing up! But what now?<br />
        Simply upload media from you switch to the twitter account you linked.
        Make sure to include one of the hashtags you set up below, by default
        you will not need to add any yourself.<br />Your media should become
        available on your Google Photos account a few moments after the upload
        completes.
      </v-alert>
      <section v-if="!userName" class="accounts">
        <loading
          message="loading profile..."
          class="account-section"
          :inline="true"
        />
      </section>
      <section v-else class="accounts">
        <section class="account-section">
          <h3>
            Welcome back, <strong>{{ userName }}</strong
            >.
          </h3>
          <section v-if="!linkedPhotos">
            <Button
              :onClick="redirectToPhotos"
              color="white"
              style="margin-bottom: 2rem;"
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
                    'user-score-leading': i === statsToDisplay.length - 1,
                  }"
                >
                  {{ s.amount }}
                </div>
                <p class="user-name">{{ s.title }}</p>
              </li>
            </ul>
          </section>
          <div
            class="stick-to-bottom"
            style="margin-left: auto; cursor: pointer;"
            @click="openPopup"
          >
            <settings
              class="tutorial-icon tutorial-icon--smol rotate-on-hover"
              style="height: 32px;"
            />
          </div>
        </section>
        <section v-if="linkedPhotos" class="account-section">
          <h3>Configuration</h3>
          <section class="toggle">
            <h4>Tracked hashtags:</h4>
            <v-switch
              v-for="v in displayHashtags"
              :key="v.value"
              v-model="followedHashtags"
              :label="'#' + v.tag"
              :value="v.value"
              :dark="true"
              color="#35e4d8"
              @change="() => (changedTags = true)"
            />
          </section>
          <section class="toggle">
            <v-switch
              v-model="deletePerDefault"
              label="Delete tracked tweets"
              :dark="true"
              color="#35e4d8"
              @change="() => (changedTags = true)"
            />
            <p v-if="deletePerDefault">
              Pro tip: You can mark tweets with #flintgg to keep them!
            </p>
            <p v-else>
              We recommend keeping this turned on, to keep everyones timelines
              clean.
            </p>
          </section>

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
    </section>
    <section v-if="!userName" class="accounts">
      <section class="tutorial-section">
        <div>
          <nswitch class="tutorial-icon tutorial-icon--switch" />
          <linkic
            class="tutorial-icon tutorial-icon--cascading tutorial-icon--smol"
          />
          <twicon class="tutorial-icon tutorial-icon--twitter" />
        </div>
        <h4>Upload directly from your Switch</h4>
        Post your images and videos from the switch library to twitter using the
        hashtag you set up on our system.<br />We support anything the Switch
        offers: Single images, multiple images, and videos.
      </section>
      <section class="tutorial-section">
        <div>
          <twicon
            class="tutorial-icon tutorial-icon--twitter tutorial-icon--smol"
          />
          <share class="tutorial-icon tutorial-icon--cascading" />
          <pinwheel
            class="tutorial-icon tutorial-icon--cascading tutorial-icon--smol"
          />
        </div>
        <h4>Let us do the hard work</h4>
        The moment you post, we grab the content and delete the original tweet,
        keeping your Twitter timeline clean.<br />
        We track #NintendoSwitch per default, as it is automatically added by
        your Switch, but you can choose other hashtags as well.
      </section>
      <section class="tutorial-section">
        <network class="tutorial-icon" />
        <h4>Your media, where you want it</h4>
        Once our system receives your media, it directly forwards it to an album
        in your Google Photos account. No tracking, no detours, no delay. Just
        what you need, where you need it.
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
    <PopUp
      style="z-index: 1000;"
      :display="showConfirmationPopup"
      color="#f04747"
      title="Hold up"
      :onClose="closeConfirmationPopup"
    >
      <div>
        Do you really want to disconnect Google Photos?<br />
        You can reactivate it at any time, but until you do so we won't be able
        to upload your media anymore!
      </div>
      <Button
        class="error-close-button"
        color="grey"
        :onClick="closeConfirmationPopup"
      >
        nevermind</Button
      ><Button class="error-close-button" color="red" :onClick="removePhotos">
        yes, disconnect</Button
      >
    </PopUp>
    <PopUp
      style="z-index: 1000;"
      :display="showPopup"
      title="Account Settings"
      :onClose="closePopup"
    >
      <section
        class="account-section"
        style="margin-left: auto; margin-right: auto;"
      >
        <section>
          <h4>
            You're currently logged in as <strong>{{ userName }}</strong
            >.
          </h4>
          <Button :onClick="logout" color="grey">Log out</Button>
        </section>
        <section v-if="linkedPhotos">
          <h4>
            Your Google Photos Account is connected.
          </h4>
          <Button :onClick="openConfirmationPopup" color="red"
            >Disconnect</Button
          >
        </section>
      </section>
    </PopUp>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'nuxt-property-decorator';
import { PostService } from '~/scripts/postService';
import loading from '~/components/loading/loading.vue';
import Button from '~/components/Button.vue';
import PopUp from '~/components/Popup.vue';
import {
  switchHashtag,
  userForClient,
  switchStat,
  switchEvent,
} from '~/server/switch-share/enums';

/* eslint-disable import/no-unresolved */
import share from '~/assets/images/switch-share/tutorial-icons/noun_Share_1774266.svg?inline';
import network from '~/assets/images/switch-share/tutorial-icons/noun_social network_2328434.svg?inline';
import nswitch from '~/assets/images/switch-share/tutorial-icons/switch.svg?inline';
import upload from '~/assets/images/switch-share/tutorial-icons/upload.svg?inline';
import twicon from '~/assets/images/switch-share/Twitter_Logo_Blue.svg?inline';
import linkic from '~/assets/images/switch-share/tutorial-icons/link.svg?inline';
import pinwheel from '~/assets/images/switch-share/tutorial-icons/pinwheel.svg?inline';
import settings from '~/assets/images/icons/settings.svg?inline';

/* eslint-enable import/no-unresolved */

@Component({
  components: {
    loading,
    Button,
    share,
    network,
    nswitch,
    upload,
    twicon,
    linkic,
    pinwheel,
    PopUp,
    settings,
  },
})
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

  deletePerDefault: boolean | null = null;

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
        .slice(1) // get rid of always followed hashtag for display
    );
  }

  showConfirmationPopup = false;

  showPopup = false;

  openConfirmationPopup() {
    this.showPopup = false;
    this.showConfirmationPopup = true;
  }

  closeConfirmationPopup() {
    this.showConfirmationPopup = false;
  }

  openPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
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
        this.allHashtags = dat.hashtagsToFollow;
        this.followedHashtags = dat.hashtags;
        this.stats = dat.stats;
        this.deletePerDefault = dat.autoDelete;
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

  /*   toggleTracking(value: switchHashtag, currently: boolean) {
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
  } */

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
      this.closeConfirmationPopup();
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
          autoDelete: this.deletePerDefault,
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
/* we need this here to bind stronger */
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

.stick-to-bottom {
  margin-top: auto;
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

.center-vertical {
  margin-top: auto;
  margin-bottom: auto;
}

.alert {
  margin: auto;
  max-width: 900px;
}

.toggle {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  margin-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
}
</style>
