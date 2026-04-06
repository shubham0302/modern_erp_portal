import { authService } from "./loginService";

export const authQueries = {
  getPermissions: (userId?: string) => ({
    queryKey: ["auth", "permissions", userId] as const,
    queryFn: () => authService.getPermissions(userId!),
    enabled: !!userId,
  }),
};
