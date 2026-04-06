import {
  PermissionFeaturesEnum,
  PermissionTypeEnum,
  type UserPermissions,
} from "@/types/permissions.types";
import { create } from "zustand";

interface PermissionsState {
  permissions: UserPermissions;
  setPermissions: (permissions: UserPermissions) => void;
}

export const getDefaultPermissions = (): UserPermissions => {
  const defaultPermissionTypes: Record<PermissionTypeEnum, boolean> = {
    [PermissionTypeEnum.read]: false,
    [PermissionTypeEnum.write]: false,
    [PermissionTypeEnum.delete]: false,
  };

  const permissions: UserPermissions = Object.keys(
    PermissionFeaturesEnum,
  ).reduce((acc, feature) => {
    const featureKey = feature as keyof typeof PermissionFeaturesEnum;
    acc[PermissionFeaturesEnum[featureKey]] = { ...defaultPermissionTypes };
    return acc;
  }, {} as UserPermissions);
  return permissions;
};

export const usePermissionStore = create<PermissionsState>((set) => ({
  permissions: getDefaultPermissions(),

  setPermissions: (partial) =>
    set((state) => {
      const updated: UserPermissions = { ...state.permissions };

      for (const feature of Object.keys(partial) as PermissionFeaturesEnum[]) {
        updated[feature] = {
          ...updated[feature],
          ...(partial[feature] ?? {}),
        };
      }

      return { permissions: updated };
    }),
}));
