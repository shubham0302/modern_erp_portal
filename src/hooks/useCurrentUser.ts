import { useAuthStore } from "@/store/useAuthStore";

export const useCurrentUser = () => {
  const user = useAuthStore((s) => s.user);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const initials = user?.name?.[0]?.toUpperCase() || "U";
  const displayRole = user?.roles?.[0]
    ? user.roles[0].charAt(0).toUpperCase() + user.roles[0].slice(1)
    : "User";

  return { user, isLoggedIn, initials, displayRole };
};
