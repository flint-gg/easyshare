import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { mediaIntent, mailchimpSubscribe } from '../types/enums';

const apiurl: string = '/api/';

// Axios instance we save to check if we already resolved the promise
let authedAxios: AxiosInstance | null = null;

// resolver function
let axiosResolved: (value: AxiosInstance) => void;

// instance promise we wait for, setting the resolver function in the constructor
// this is also the instance we use to connect to the API
const authedAxiosPromise = new Promise<AxiosInstance>((resolve) => {
  axiosResolved = resolve;
});

export const PostService = {
  /** Function to resolve the axios promise by filling the variable with the axios instance */
  addAuthedAxios(axi: AxiosInstance) {
    if (!authedAxios) {
      authedAxios = axi;
      axiosResolved(authedAxios);
      return 1;
    }
    return -1;
  },

  async subscribe(user: {
    email: string;
    name?: string;
  }): Promise<mailchimpSubscribe> {
    const response = await this.post<{ status: mailchimpSubscribe }>(
      'subscribe',
      user,
    );
    if (response.error) {
      return mailchimpSubscribe.failure;
    }
    if (response.data) {
      if (
        response.data.status === mailchimpSubscribe.success
        || response.data.status === mailchimpSubscribe.already
      ) {
        return response.data.status;
      }
    }
    return mailchimpSubscribe.failure;
  },

  uploadMedia(
    file: Blob,
    intent: mediaIntent,
    gcId?: gamecardId,
    caption?: string,
  ) {
    const formData = new FormData();
    if (intent === mediaIntent.video) {
      formData.append('video', file);
    } else {
      formData.append('image', file);
    }
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
      params: {
        intent,
        gcId,
        caption,
      },
    };
    return this.postAuthAxios<flintId>('media', formData, config);
  },

  /** Delete a certain medium you own. If you want to delete something from a gamecard,
   *  you need to supply the gamecard ID and the medium ID.
   * Profilepictures can be deleted just by naming that intent. */
  deleteMedia(intent: mediaIntent, mediaId?: flintId, gcId?: gamecardId) {
    return this.deleteAuthAxios<null>('media', {
      intent,
      gcId,
      mediaId,
    });
  },

  likeMedia(mediaId: flintId, dislike?: boolean) {
    return this.patchAuthAxios<null>('media/like', {
      mediaId,
      dislike,
    });
  },

  post<R>(
    urlEnding: string,
    body?: any,
    config?: AxiosRequestConfig,
  ): Promise<{ data?: R; error?: flintError }> {
    return authedAxiosPromise.then(async (axios: AxiosInstance) => {
      try {
        const { data } = await axios.post(
          `${apiurl}${urlEnding}`,
          body,
          config,
        );
        return { data };
      } catch (e) {
        return {
          error: { ...e.response.data.error, status: e.response.status },
        };
      }
    });
  },

  get<R>(
    urlEnding: string,
    config?: AxiosRequestConfig,
  ): Promise<{ data?: R; error?: flintError }> {
    return authedAxiosPromise.then(async (axios: AxiosInstance) => {
      try {
        const { data } = await axios.get<R>(`${apiurl}${urlEnding}`, config);
        return { data };
      } catch (e) {
        return {
          error: { ...e.response.data.error, status: e.response.status },
        };
      }
    });
  },

  delete<F>(
    urlEnding: string,
    config?: AxiosRequestConfig,
  ): Promise<{ data?: F; error?: flintError }> {
    return authedAxiosPromise.then(async (axios: AxiosInstance) => {
      try {
        const { data } = await axios.delete(`${apiurl}${urlEnding}`, config);
        return { data };
      } catch (e) {
        return {
          error: { ...e.response.data.error, status: e.response.status },
        };
      }
    });
  },

  patch<R>(
    urlEnding: string,
    body?: any,
    config?: AxiosRequestConfig,
  ): Promise<{ data?: R; error?: flintError }> {
    return authedAxiosPromise.then(async (axios: AxiosInstance) => {
      try {
        const { data } = await axios.patch(
          `${apiurl}${urlEnding}`,
          body,
          config,
        );
        return { data };
      } catch (e) {
        return {
          error: { ...e.response.data.error, status: e.response.status },
        };
      }
    });
  },

  getAuthAxios<T>(urlEnding: string, query?: any, config?: AxiosRequestConfig) {
    const newConfig = config || {};
    newConfig.params = query;
    return this.get<T>(`auth/${urlEnding}`, newConfig);
  },

  postAuthAxios<R>(urlEnding: string, body?: any, config?: AxiosRequestConfig) {
    return this.post<R>(`auth/${urlEnding}`, body, config);
  },

  deleteAuthAxios<H>(
    urlEnding: string,
    query?: any,
    config?: AxiosRequestConfig,
  ) {
    const newConfig = config || {};
    newConfig.params = query;
    return this.delete<H>(`auth/${urlEnding}`, newConfig);
  },

  patchAuthAxios<G>(
    urlEnding: string,
    body?: any,
    config?: AxiosRequestConfig,
  ) {
    return this.patch<G>(`auth/${urlEnding}`, body, config);
  },

  sendMessage(body, receiverId) {
    return this.postAuthAxios('chat/', { body, receiverId });
  },

  initiateChat(receiverID, receiverName) {
    return this.postAuthAxios('chat/initiate', {
      body: 'this is the start of your conversation.',
      receiverId: receiverID,
      receiverName,
    });
  },

  async amAlreadyFollowing(followedID: string): Promise<boolean> {
    const res = await this.getAuthAxios<boolean>('follow/check/follow', {
      id: followedID,
    });
    return res.data || false;
  },

  followUser(followID: flintId) {
    return this.postAuthAxios<undefined>('follow/follow', { id: followID });
  },

  unFollowUser(unFollowID: flintId) {
    return this.deleteAuthAxios<undefined>('follow/follow', { id: unFollowID });
  },

  async friendsget(friendsid: string) {
    return authedAxiosPromise.then(async (axios: AxiosInstance) => {
      axios
        .get('/friends', {
          params: {
            ID: friendsid,
          },
        })
        .then((response) => response)
        .catch((error) => {
          console.error(error);
          return undefined;
        });
    });
  },

  async friends(friendsID: string) {
    const response = await this.friendsget(friendsID);
    return response;
  },
};
