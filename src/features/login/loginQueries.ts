import { useAuthStore } from "@/store/useAuthStore";
import { usePermissionStore } from "@/store/usePermissions";
import type { LoginResponse, Staff } from "@/types/staff.types";
import { showErrorToasts } from "@/utils/helpers";
import { TokenUtil } from "@/utils/tokenUtil";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authService } from "./loginService";

export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
};

const hydrateFromStaff = (staff: Staff) => {
  useAuthStore.getState().setStaff(staff);
  usePermissionStore.getState().setPermissionsFromModuleAccess(staff.moduleAccess);
};

export const applyLoginResponse = (response: LoginResponse) => {
  TokenUtil.setTokens(response.accessToken, response.refreshToken);
  hydrateFromStaff(response.staff);
};

export const useLoginMutation = () =>
  useMutation({
    mutationFn: authService.login,
    onError: (error) => {
      showErrorToasts(error);
    },
  });

export const useProfileQuery = (enabled: boolean = true) =>
  useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      const response = await authService.getProfile();
      hydrateFromStaff(response.data);
      return response.data;
    },
    enabled,
  });
