import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { flintError } from '~/types/flintgg';

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
};
