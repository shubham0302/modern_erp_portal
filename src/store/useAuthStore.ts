import type { Staff } from "@/types/staff.types";
import { create } from "zustand";

export interface AuthStore {
  isLoggedIn: boolean;
  staff?: Staff;
  setStaff: (staff: Staff) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLoggedIn: false,
  setStaff: (staff) => set({ staff, isLoggedIn: true }),
  clearAuth: () => set({ staff: undefined, isLoggedIn: false }),
}));
