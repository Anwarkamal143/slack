import { API_BASE_URL, POKEMON_API_BASE_URL } from "@/config";
import useRefreshStore from "@/store/useRefreshTokens";
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const codeMessage: { [key: string]: string } = {
  200: "The request has succeeded",
  201: "New resource has been created ",
  202: "The request has been received",
  204: "No Content",
  400: "The server could not understand the request due to invalid syntax.",
  401: "Unauthorized Operation",
  403: "You do not have access rights to the content",
  404: "Not Found",
  406: "Not Acceptable",
  410: "The request content is not longer available",
  422: "The request was well-formed but was unable to be followed due to semantic errors.",
  500: "The server has encountered a situation it doesn't know how to handle",
  502: "Bad Gateway",
  503: "The server is not ready to handle the request",
  504: "Timeout",
};

export const API_POOL = {
  //   "user-mng": process.env.REACT_APP_USER_MNG_BASE_URL,
  //   "dev-sett": process.env.REACT_APP_DEV_SETT_BASE_URL,
  //   "gui-fusion": process.env.REACT_APP_GUI_FUSION_BASE_URL,
  //   "data-mng": process.env.REACT_APP_DATA_MNG_BASE_URL,
  //   contact: process.env.REACT_APP_CONTACT_BASE_URL,
  //   "public-1": process.env.REACT_APP_PUBLIC_API_1_BASE_URL,
  "public-1": API_BASE_URL,
  "pokemon-1": POKEMON_API_BASE_URL,
} as const;

const baseURL = API_POOL["public-1"];
// const baseURL = 'https://401d-182-184-90-121.eu.ngrok.io';

const TOKEN_PAYLOAD_KEY = "authorization";

export interface IAxiosRequest extends Partial<AxiosRequestConfig> {
  public?: boolean;
  handleError?: boolean;
  attachToken?: boolean;
  attachAccountId?: boolean;
  token?: string;
}

const axiosRequest = axios.create({
  baseURL: baseURL,
  timeout: 60000,
  withCredentials: true,
});

export let requestQueue: any = []; // Queue to hold pending requests

const isRefreshing = useRefreshStore.getState().isRefreshing;
// Add request interceptor

axiosRequest.interceptors.request.use(
  (reqConfig: InternalAxiosRequestConfig<any> & IAxiosRequest) => {
    const {
      attachToken = true,
      attachAccountId = true,
      token = "",
      ...config
    } = reqConfig;
    if (attachToken) {
      // const token = getLocalStorage("token", false);
      const jwtToken = `Bearer ${token}`;

      if (token) {
        config.headers && (config.headers[TOKEN_PAYLOAD_KEY] = jwtToken);
      }

      if (!jwtToken && !config.public) {
        Promise.reject("Attach a token in request or mark it public");
      }
    }
    if (isRefreshing) {
      // Token is expired
      return new Promise((resolve) => {
        requestQueue.push(() => {
          resolve(config);
        });
      });
    } else {
      // If already refreshing, queue the request
      try {
        // Retry all queued requests
        requestQueue.forEach((cb: any) => cb());
        requestQueue = []; // Clear the queue

        return config;
      } catch (error) {
        requestQueue = []; // Clear the queue on error
        return Promise.reject(error);
      }
    }

    return config;
  },
  (error) => {
    // Do something with request error here
    // notification.error({
    // 	message: 'Error'
    // })
    Promise.reject(error);
  }
);

type CustomResponse = {
  success?: boolean;
  errorHandled?: boolean;
  reason?: string;
  message?: string;
} & Partial<AxiosResponse>;

type RequestError = { response: CustomResponse };

const errorHandler = (error: RequestError): CustomResponse => {
  if (error instanceof axios.Cancel) {
    return {
      success: false,
      errorHandled: true,
      reason: "cancelled",

      ...error,
    };
  }

  const { response } = error;

  if (response && response.status && codeMessage[response.status]) {
    // if (response.status === 400) {
    //   notification.error({
    //     message: response.data?.message || codeMessage[response.status],
    //   });
    // }
    response.success = false;
    response.errorHandled = true;
    const errorText = codeMessage[response.status];
    return {
      message: response.data.message,
      ...response,
      success: false,
      errorHandled: true,
      reason: errorText,
    };
  } else if (!response) {
    return { success: false, errorHandled: true };
  }

  return {
    message: response.data.message,
    ...response,
    success: false,
    errorHandled: true,
    reason: "network",
  };
};

/**
 * Fetch data from given url
 * @param {*} url
 * @param {*} options
 *
 * Note Don't add anymore params if needed add a object type called 'extra' or something
 * can tell me what's the need for includeAuthHead?
 */
const request = async (
  url: string,
  options: IAxiosRequest = {
    handleError: true,
  }
) => {
  const handleError = options.handleError ?? true;
  try {
    const res = await axiosRequest(url, options);
    return res;
  } catch (e) {
    if (handleError) {
      throw errorHandler(e as RequestError);
    } else {
      throw e;
    }
  }
};

export default request;
