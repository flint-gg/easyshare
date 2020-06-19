declare module 'vue-cookie-law' {
  import Vue, { VueConstructor } from 'vue';

  export interface CookieLaw extends VueConstructor<Vue> {
    theme: string;
  }
}
