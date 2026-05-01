import { LocalStorageUtil } from "./localStorageUtil";

const ACCESS_TOKEN_KEY = "erp-admin-access-token";
const REFRESH_TOKEN_KEY = "erp-admin-refresh-token";

export const TokenUtil = {
  setAccessToken(token: string): void {
    LocalStorageUtil.setItem<string>(ACCESS_TOKEN_KEY, token);
  },

  getAccessToken(): string | null {
    return LocalStorageUtil.getItem<string>(ACCESS_TOKEN_KEY);
  },

  setRefreshToken(token: string): void {
    LocalStorageUtil.setItem<string>(REFRESH_TOKEN_KEY, token);
  },

  getRefreshToken(): string | null {
    return LocalStorageUtil.getItem<string>(REFRESH_TOKEN_KEY);
  },

  setTokens(accessToken: string, refreshToken: string): void {
    LocalStorageUtil.setItem<string>(ACCESS_TOKEN_KEY, accessToken);
    LocalStorageUtil.setItem<string>(REFRESH_TOKEN_KEY, refreshToken);
  },

  clearTokens(): void {
    LocalStorageUtil.removeItem(ACCESS_TOKEN_KEY);
    LocalStorageUtil.removeItem(REFRESH_TOKEN_KEY);
  },

  getToken(): string | null {
    return LocalStorageUtil.getItem<string>(ACCESS_TOKEN_KEY);
  },
};
