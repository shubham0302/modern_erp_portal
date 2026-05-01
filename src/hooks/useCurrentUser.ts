import { useAuthStore } from "@/store/useAuthStore";

export const useCurrentUser = () => {
  const staff = useAuthStore((s) => s.staff);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const initials = staff?.name?.[0]?.toUpperCase() || "U";
  const displayRole = staff?.role?.name ?? "User";

  return { user: staff, staff, isLoggedIn, initials, displayRole };
};
