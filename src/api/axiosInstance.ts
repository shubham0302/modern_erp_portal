import { router } from "@/router";
import { TokenUtil } from "@/utils/tokenUtil";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import type {
  BaseApiErrorResponse,
  BaseApiResponse,
  PaginatedResponse,
} from "../types/baseApi.types";


const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = TokenUtil.getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorData: BaseApiErrorResponse = error?.response?.data ?? {
      error: "Network Error",
      message: "Network error or server unavailable",
      statusCode: error?.response?.status || 500,
    };

    const location = router.state.location;
    const activeMatch = router.state.matches[router.state.matches.length - 1];
    const routeParams = activeMatch?.params ?? {};

    const context = {
      route: location.pathname,
      search: JSON.stringify(location.search || {}),
      params: JSON.stringify(routeParams || {}),
      hash: location.hash,
      status: error?.response?.status,
      statusCode: errorData.statusCode,
      error: errorData.error,
      message: errorData.message,
      endpoint: error?.config?.url,
      method: error?.config?.method?.toUpperCase(),
      paramsSent: error?.config?.params,
      data: error?.config?.data,
    };

    console.error("API Error:", context);

    // Handle unauthorized access - redirect to login
    if (errorData.message === "UNAUTHORIZED") {
      // TokenUtil.removeToken();
      // window.location.href = ROUTES.LOGIN;
      // return Promise.reject(errorData);
    }

    console.error("API Error:", context);
    return Promise.reject(errorData);
  },
);

export const getData = async <T>(
  endpoint: string,
  config?: AxiosRequestConfig,
): Promise<BaseApiResponse<T>> => {
  const response: AxiosResponse<BaseApiResponse<T>> = await apiClient.get(
    endpoint,
    config,
  );
  return response.data;
};

export const getPaginatedData = async <T>(
  endpoint: string,
  config?: AxiosRequestConfig,
): Promise<BaseApiResponse<PaginatedResponse<T>>> => {
  const response: AxiosResponse<BaseApiResponse<PaginatedResponse<T>>> =
    await apiClient.get(endpoint, config);
  return response.data;
};

export const postData = async <T, U>(
  endpoint: string,
  data: U,
  config?: AxiosRequestConfig,
): Promise<BaseApiResponse<T>> => {
  const response: AxiosResponse<BaseApiResponse<T>> = await apiClient.post(
    endpoint,
    data,
    config,
  );
  return response.data;
};

export const putData = async <T, U>(
  endpoint: string,
  data: U,
  config?: AxiosRequestConfig,
): Promise<BaseApiResponse<T>> => {
  const response: AxiosResponse<BaseApiResponse<T>> = await apiClient.put(
    endpoint,
    data,
    config,
  );
  return response.data;
};

export const patchData = async <T, U>(
  endpoint: string,
  data: Partial<U>,
  config?: AxiosRequestConfig,
): Promise<BaseApiResponse<T>> => {
  const response: AxiosResponse<BaseApiResponse<T>> = await apiClient.patch(
    endpoint,
    data,
    config,
  );
  return response.data;
};

export const deleteData = async <T>(
  endpoint: string,
  config?: AxiosRequestConfig,
): Promise<BaseApiResponse<T>> => {
  const response: AxiosResponse<BaseApiResponse<T>> = await apiClient.delete(
    endpoint,
    config,
  );
  return response.data;
};

export const getBlob = async (
  endpoint: string,
  config?: AxiosRequestConfig,
): Promise<Blob> => {
  const response: AxiosResponse<Blob> = await apiClient.get(endpoint, {
    ...config,
    responseType: "blob",
  });
  return response.data;
};

export { apiClient };
