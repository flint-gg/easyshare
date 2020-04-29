/**
 * Augment the typings of Vue.js
 */

import Vue, { ComponentOptions } from 'vue';
import { ImgixJs } from 'imgix.js';
import ImgixClient from 'imgix-core-js';
import { NuxtCookies } from 'cookie-universal-nuxt';

import { AxiosInstance } from 'axios';

interface StorageCookieOptions {
  cookie: {
    prefix: string;
    options?: StorageCookieOptions;
  };
}

interface Storage {
  setUniversal(key: string, value: any, isJson?: boolean): string;

  getUniversal(key: string, isJson?: boolean): any;

  syncUniversal(key: string, defaultValue: any, isJson?: boolean): any;

  // Local State
  setState(key: string, val: any): string;

  getState(key: string): string;

  watchState(key: string, handler: (newValue: any) => void);

  // Cookies
  setCookie(key: string, val: any, options?: StorageCookieOptions);

  getCookie(key: string, isJson?: boolean): any;

  // Local Storage
  setLocalStorage(key: string, val: any, isJson?: boolean);

  getLocalStorage(key: string, isJson?: boolean): any;
}

interface Auth<T = any> {
  ctx: any;
  $state: any; // todo: type this
  $storage: Storage;
  user: T;
  loggedIn: boolean;

  loginWith(strategyName: string, ...args): Promise<never>;

  login(...args): Promise<never>;

  logout(): Promise<never>;

  fetchUser(): Promise<never>;

  fetchUserOnce(): Promise<never>;

  hasScope(scopeName: string): boolean;

  getToken(strategyName: string, token?: string): string;

  setToken(strategyName: string, token?: string): string;

  setUserToken(token: String): Promise<any>;

  syncToken(strategyName: string): string;

  onError(handler: (error: Error, name: string, endpoint: any) => void);

  setUser(user?: Partial<T>);

  reset(): Promise<never>;

  redirect(name: string);
}

interface VueSocket {
  emit(identifier: string, message: string): void;
}

export interface VueSocketSubscriptions {
  subscribe(messageName: string, handler: (msg) => void): void;
}

interface NuxtToastProps {
  position: 'bottom-right';
}

interface NuxtToast {
  show(msg: string, props?: NuxtToastProps): void;

  success(msg: string): void;

  error(msg: string): void;
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    auth?: boolean;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $toast: NuxtToast;
    $imgix: ImgixJs;
    $imgixcore: ImgixClient;
    $socket: VueSocket;
    $copyText: (text: string) => void;
    $axios: AxiosInstance;
    $authRefresh: {
      initRefreshInterval: () => void;
      attemptRefresh: () => Promise<void>;
      resetRefreshInterval: (refreshtoken: string) => void;
      onRefreshError: (fun: Function) => void;
    };
    $cookies: NuxtCookies;
  }
}
