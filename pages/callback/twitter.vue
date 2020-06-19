<template>
  <section>
    <loading
      v-if="this.$route.query.oauth_token"
      style="text-align:center;"
      :message="'Logging into twitter...'"
    />
    <div v-else>No callback tokens provided.</div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'nuxt-property-decorator';
import { PostService } from '~/scripts/postService';
import flintURL from '~/scripts/flintURL';
import loading from '~/components/loading/loading.vue';
import { requestTokenResponse } from '~/types/twitter';

const realm = flintURL.getURL();

@Component({ components: { loading } })
export default class serviceCallback extends Vue {
  async mounted() {
    const callback_url = `${realm}callback/twitter`;

    const tokens = this.$route.query as requestTokenResponse;
    if (tokens.oauth_token) {
      try {
        const { error, data } = await PostService.post<string>(
          'twitter',
          {
            callback_url,
            tokens,
          },
        );
        if (error) {
          this.$toast.error(`Failed adding your account: ${error.detail}`);
        } else {
          localStorage.setItem('switchshare/token', data!);
        }
        this.$router.push({
          path: '/',
        });
      } catch ({ response }) {
        this.$toast.error(`failed adding your account: ${response.data}`);
      }
    }
  }
}
</script>
