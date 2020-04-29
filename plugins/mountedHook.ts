import Vue, { PluginObject } from 'vue';
import { PostService } from '../scripts/postService';

let firstRun = true;

const MountedHookPlugin: PluginObject<null> = {
  install(vue) {
    vue.mixin({
      // DISCLAIMER: this is called on every mount of every component
      mounted() {
        const instance = this as Vue;
        // Add hashed userID for Google Analytics
        if (firstRun) {
          // add authed axios instance
          PostService.addAuthedAxios(instance.$axios);
          firstRun = false;
        }
        // handle redirecting
        instance.$imgix.init();
      },
      updated() {
        const instance = this as Vue;
        instance.$imgix.init();
      },
    });
  },
};

Vue.use(MountedHookPlugin);
