import { PortalAccessUserTypeEnum } from "@/types/general.types";
import {
  PermissionFeaturesEnum,
  PermissionTypeEnum,
  type UserPermissions,
} from "@/types/permissions.types";
import type { User } from "@/types/user.types";

export const DEMO_TOKEN = "demo-token";

export const DEMO_USER: User = {
  name: "Demo User",
  uniqueId: "demo-001",
  email: "demo@example.com",
  roles: ["admin"],
  active: true,
  createdDate: new Date().toISOString(),
  userType: PortalAccessUserTypeEnum.staff,
};

export const createFullPermissions = (): UserPermissions =>
  Object.values(PermissionFeaturesEnum).reduce(
    (acc, feature) => {
      acc[feature] = {
        [PermissionTypeEnum.read]: true,
        [PermissionTypeEnum.write]: true,
        [PermissionTypeEnum.delete]: true,
      };
      return acc;
    },
    {} as UserPermissions,
  );
