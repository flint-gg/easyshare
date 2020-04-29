<template>
  <section>
    <loading
      v-if="this.$route.query.code"
      style="text-align:center;"
      :message="'Linking accounts...'"
    />
    <div v-else>No callback code provided.</div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'nuxt-property-decorator';
import { PostService } from '~/scripts/postService';
import loading from '~/components/loading/loading.vue';

@Component({ components: { loading } })
export default class serviceCallback extends Vue {
  get userToken() {
    return localStorage.getItem('switchshare/token');
  }

  async mounted() {
    const code = this.$route.query.code as string | undefined;
    if (code) {
      try {
        const { error } = await PostService.post(
          'photos',
          {
            code,
          },
          { headers: { Authorization: `Bearer ${this.userToken}` } },
        );
        if (error) {
          this.$toast.error(`Failed adding your account: ${error.detail}`);
        } else {
          this.$toast.success('Successfully added your account.');
          localStorage.setItem('switchshare/photos', 'true');
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
