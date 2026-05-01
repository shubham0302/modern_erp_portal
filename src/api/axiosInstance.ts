import { ROUTES } from "@/constants/routes";
import { router } from "@/router";
import { useAuthStore } from "@/store/useAuthStore";
import {
  getDefaultPermissions,
  usePermissionStore,
} from "@/store/usePermissions";
import type { LoginResponse } from "@/types/staff.types";
import { TokenUtil } from "@/utils/tokenUtil";
import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";
import type {
  BaseApiErrorEnvelope,
  BaseApiErrorResponse,
  BaseApiResponse,
  PaginatedResponse,
} from "../types/baseApi.types";

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

const REFRESH_ENDPOINT = "/staff/refresh";
const TOKEN_EXPIRED_CODE = "TOKEN_EXPIRED";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = TokenUtil.getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let refreshPromise: Promise<string> | null = null;

const performRefresh = async (): Promise<string> => {
  const refreshToken = TokenUtil.getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  // Use a bare axios call so we don't recurse through this interceptor.
  const response = await axios.post<BaseApiResponse<LoginResponse>>(
    `${import.meta.env.VITE_SERVER_URL}${REFRESH_ENDPOINT}`,
    { refreshToken },
    { headers: { "Content-Type": "application/json" } },
  );

  const payload = response.data.data;
  TokenUtil.setTokens(payload.accessToken, payload.refreshToken);
  useAuthStore.getState().setStaff(payload.staff);
  usePermissionStore
    .getState()
    .setPermissionsFromModuleAccess(payload.staff.moduleAccess);

  router.update({
    context: {
      ...router.options.context,
      isLoggedIn: true,
      permissions: usePermissionStore.getState().permissions,
    },
  });

  return payload.accessToken;
};

const logoutAndRedirect = () => {
  TokenUtil.clearTokens();
  useAuthStore.getState().clearAuth();
  usePermissionStore.getState().resetPermissions();

  router.update({
    context: {
      ...router.options.context,
      isLoggedIn: false,
      permissions: getDefaultPermissions(),
    },
  });

  const currentPath = router.state.location.pathname;
  if (currentPath !== ROUTES.LOGIN) {
    router.navigate({
      to: ROUTES.LOGIN,
      search: { redirectTo: currentPath },
    });
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<BaseApiErrorEnvelope>) => {
    const originalConfig = error.config as RetriableConfig | undefined;
    const status = error.response?.status;
    const errorData: BaseApiErrorResponse = error.response?.data?.error ?? {
      message: "Network error or server unavailable",
      statusCode: status ?? 500,
    };

    const requestUrl = originalConfig?.url ?? "";
    const isRefreshCall = requestUrl.includes(REFRESH_ENDPOINT);
    const isTokenExpired =
      status === 401 && errorData.errorCode === TOKEN_EXPIRED_CODE;

    if (
      isTokenExpired &&
      !isRefreshCall &&
      originalConfig &&
      !originalConfig._retried
    ) {
      originalConfig._retried = true;
      try {
        if (!refreshPromise) {
          refreshPromise = performRefresh().finally(() => {
            refreshPromise = null;
          });
        }
        const newAccessToken = await refreshPromise;
        originalConfig.headers = originalConfig.headers ?? {};
        originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient.request(originalConfig);
      } catch (refreshErr) {
        logoutAndRedirect();
        return Promise.reject(errorData);
      }
    }

    if (isRefreshCall && status === 401) {
      logoutAndRedirect();
    }

    const location = router.state.location;
    const activeMatch = router.state.matches[router.state.matches.length - 1];
    const routeParams = activeMatch?.params ?? {};

    console.error("API Error:", {
      route: location.pathname,
      search: JSON.stringify(location.search || {}),
      params: JSON.stringify(routeParams || {}),
      hash: location.hash,
      status,
      statusCode: errorData.statusCode,
      errorCode: errorData.errorCode,
      message: errorData.message,
      requestId: errorData.requestId,
      details: errorData.details,
      path: errorData.path,
      endpoint: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      paramsSent: error.config?.params,
      data: error.config?.data,
    });

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
