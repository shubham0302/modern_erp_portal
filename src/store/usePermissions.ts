import {
  PermissionFeaturesEnum,
  PermissionTypeEnum,
  type UserPermissions,
} from "@/types/permissions.types";
import type { ModuleAccess } from "@/types/staff.types";
import { create } from "zustand";

interface PermissionsState {
  permissions: UserPermissions;
  setPermissions: (permissions: UserPermissions) => void;
  setPermissionsFromModuleAccess: (moduleAccess: ModuleAccess) => void;
  resetPermissions: () => void;
}

export const getDefaultPermissions = (): UserPermissions => {
  const defaultPermissionTypes: Record<PermissionTypeEnum, boolean> = {
    [PermissionTypeEnum.canRead]: false,
    [PermissionTypeEnum.canWrite]: false,
  };

  return Object.values(PermissionFeaturesEnum).reduce((acc, feature) => {
    acc[feature] = { ...defaultPermissionTypes };
    return acc;
  }, {} as UserPermissions);
};

export const moduleAccessToPermissions = (
  moduleAccess: ModuleAccess,
): UserPermissions => {
  return Object.values(PermissionFeaturesEnum).reduce((acc, feature) => {
    const entry = moduleAccess[feature];
    acc[feature] = {
      [PermissionTypeEnum.canRead]: entry?.canRead ?? false,
      [PermissionTypeEnum.canWrite]: entry?.canWrite ?? false,
    };
    return acc;
  }, {} as UserPermissions);
};

export const usePermissionStore = create<PermissionsState>((set) => ({
  permissions: getDefaultPermissions(),

  setPermissions: (permissions) => set({ permissions }),

  setPermissionsFromModuleAccess: (moduleAccess) =>
    set({ permissions: moduleAccessToPermissions(moduleAccess) }),

  resetPermissions: () => set({ permissions: getDefaultPermissions() }),
}));
