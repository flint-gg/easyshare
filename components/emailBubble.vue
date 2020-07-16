<template>
  <v-alert
    v-if="(bannerVisible && !userToken || !linkedEmail)"
    class="survey-bubble"
    :class="{ 'fixed-to-right': !inFeedbackPage, margins: true }"
    transition="slide-x-reverse-transition"
    type="info"
    icon="email"
    :color="
      emailSubscribeStatus > 0
        ? 'green'
        : emailSubscribeStatus === 0
        ? 'red'
        : 'blue'
    "
    :dismissible="true"
    style="max-width: 640px;"
  >
    <v-form
      v-if="!emailSubscribeStatus"
      ref="form"
      v-model="valid"
      lazy-validation
    >
      Want us to keep you up to date with everything flint.gg?
      <v-text-field
        v-model="email"
        style="padding-right: 2rem;"
        :rules="emailRules"
        label="Your E-mail"
        required
      ></v-text-field>
      <div v-if="emailSubscribeStatus === 0">
        Something went wrong. Please try again later.
      </div>
      <v-btn
        :disabled="!valid"
        color="success"
        class="mr-4"
        @click="subscribeToNewsletter"
      >
        Sign me up!
      </v-btn>
    </v-form>
    <section v-else>
      <div v-if="emailSubscribeStatus === 1">
        Successfully subscribed to the newsletter! Check your emails for a
        confirmation mail.
      </div>
      <div v-else>You're already subscribed to the newsletter!</div>
    </section>
  </v-alert>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'nuxt-property-decorator';
import Button from '~/components/Button.vue';
import { mailchimpSubscribe } from '../types/enums';
import { PostService } from '../scripts/postService';

@Component({ components: { Button } })
export default class surveyBubble extends Vue {
  @Prop()
  userToken?: string;

  @Prop({
    default: false,
  })
  inFeedbackPage!: boolean;

  bannerVisible: boolean = false;

  get linkedEmail() {
    return Boolean(localStorage.getItem('switchshare/email'));
  }

  async mounted() {
    const alreadyReactedToSurvey = this.$cookies.get('survey-banner');
    if (!this.inFeedbackPage && alreadyReactedToSurvey !== 'emailCollected') {
      setTimeout(() => {
        this.bannerVisible = true;
      }, 10 * 1000);
    } else if (this.inFeedbackPage) {
      this.bannerVisible = true;
    }
  }

  valid = true;

  email = '';

  emailRules = [
    (v) => !!v || 'E-mail is required',
    (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
  ];

  emailSubscribeStatus: mailchimpSubscribe | null = null;

  async subscribeToNewsletter() {
    const { data } = await PostService.post<{ success: mailchimpSubscribe }>(
      this.userToken ? 'newsletter/authed' : 'newsletter', // specieal endpoint when a token exists
      {
        email: this.email,
      },
      this.userToken
        ? {
          headers: { Authorization: `Bearer ${this.userToken}` },
        }
        : undefined,
    );
    if (data) {
      if (data.success === mailchimpSubscribe.failure) {
        localStorage.removeItem('switchshare/email');
      } else {
        localStorage.setItem('switchshare/email', 'true');
      }
    }
    this.emailSubscribeStatus = data
      ? data.success
      : mailchimpSubscribe.failure;
  }
}
</script>

<style scoped lang="scss">
.survey-bubble {
  max-width: calc(100vw - 20px);
}

.margins {
  margin-right: 10px;
  margin-left: 10px;
}

.fixed-to-right {
  position: fixed;
  right: 10px;
  top: calc(var(--vh, 1vh) * 20);
  z-index: 1500;
}
</style>
