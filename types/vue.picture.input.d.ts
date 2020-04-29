declare module 'vue-picture-input' {
  import Vue, { VueConstructor } from 'vue';

  export type PictureInputRef = { file?: Blob };
  export type PictureInput = VueConstructor<Vue> & PictureInputRef;
}
