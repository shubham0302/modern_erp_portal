import { getData, postData } from "@/api/axiosInstance";
import type { User } from "@/types/user.types";
import type { UserPermissions } from "@/types/permissions.types";

export const authService = {
  getProfile: () => getData<User>("/api/auth/profile"),
  login: (data: { email: string; password: string }) =>
    postData<{ token: string }, typeof data>("/api/auth/login", data),
  getPermissions: (userId: string) =>
    getData<UserPermissions>(`/api/auth/permissions/${userId}`),
};
