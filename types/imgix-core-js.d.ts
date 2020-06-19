declare module 'imgix-core-js' {
  // https://docs.imgix.com/apis/url/size/fit
  import { ImgixConfig } from 'imgix.js';

  export type ImgixFit = 'crop' | 'max';

  // https://docs.imgix.com/apis/url/size/crop
  export type ImgixCrop = Partial<
    Record<
      | 'top'
      | 'bottom'
      | 'left'
      | 'right'
      | 'faces'
      | 'focalpoint'
      | 'edges'
      | 'entropy',
      boolean
    >
  >;

  // https://docs.imgix.com/apis/url/format/cs
  export enum ImgixColorSpace {
    srgb = 'srgb',
    adobergb1998 = 'adobergb1998',
    tinysrgb = 'tinysrgb',
    strip = 'strip',
  }

  // https://docs.imgix.com/apis/url/auto
  export type ImgixAuto = 'compress' | 'format';

  // https://docs.imgix.com/apis/url/format/ch
  export type ImgixClientHints = Partial<
    Record<'width' | 'dpr' | 'saveData', boolean>
  >;

  // https://docs.imgix.com/apis/url
  export type ImgixUrlQueryParams = {
    auto?: ImgixAuto;
    q?: number;
    h?: number;
    w?: number;
    fit?: ImgixFit;
    dpr?: number;
    crop?: ImgixCrop;
    bg?: string;
    ch?: ImgixClientHints;
    blur?: number;
    cs?: ImgixColorSpace;
    uncache?: number;
  };

  export default class ImgixClient {
    constructor(options: ImgixConfig);

    buildURL(base: string, params?: ImgixUrlQueryParams): string;
  }
}
