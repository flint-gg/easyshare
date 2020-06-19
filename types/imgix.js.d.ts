declare module 'imgix.js' {
  export type ImgixConfig = {
    domain: string;
    host?: string
  }

  export type ImgixJs = {
    config: ImgixConfig;
    init(options?: {force:boolean}): void;
  }
}
