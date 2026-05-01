import { getData, postData } from "@/api/axiosInstance";
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  Staff,
} from "@/types/staff.types";

export const authService = {
  login: (data: LoginRequest) =>
    postData<LoginResponse, LoginRequest>("/staff/login", data),

  getProfile: () => getData<Staff>("/staff/profile"),

  refresh: (refreshToken: string) =>
    postData<RefreshTokenResponse, RefreshTokenRequest>("/staff/refresh", {
      refreshToken,
    }),
};
