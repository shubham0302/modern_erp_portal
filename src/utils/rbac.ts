import {
  hasPermission,
  type AccessControlledMenuProps,
} from "@/components/compound/AccessControlledMenu";
import {
  PermissionTypeEnum,
  type PermissionFeaturesEnum,
  type UserPermissions,
} from "@/types/permissions.types";

export const hasAccess = (
  feature: PermissionFeaturesEnum,
  permissions: UserPermissions,
  actionTypes: PermissionTypeEnum[],
): boolean => {
  const featurePermissions = permissions[feature];
  if (!featurePermissions) return false;
  return actionTypes.every(
    (actionType) => featurePermissions[actionType] === true,
  );
};

export const getFeaturePermissions = (
  feature: PermissionFeaturesEnum,
  permissions: UserPermissions,
) => ({
  canRead: hasAccess(feature, permissions, [PermissionTypeEnum.canRead]),
  canWrite: hasAccess(feature, permissions, [
    PermissionTypeEnum.canRead,
    PermissionTypeEnum.canWrite,
  ]),
});

export const hasAnyActionPermission = (
  options: AccessControlledMenuProps,
): boolean => {
  const {
    permissions,
    feature,
    generalPermission = PermissionTypeEnum.canRead,
  } = options;

  const builtinActions: [
    keyof AccessControlledMenuProps,
    PermissionTypeEnum,
  ][] = [
    ["onView", PermissionTypeEnum.canRead],
    ["onEdit", PermissionTypeEnum.canWrite],
    ["onGoToDetails", PermissionTypeEnum.canRead],
  ];

  for (const [key, perm] of builtinActions) {
    const fn = options[key];
    if (typeof fn === "function" && hasPermission(permissions, feature, perm)) {
      return true;
    }
  }

  if (options.extraItems?.length) {
    for (const item of options.extraItems) {
      const effectivePerm = item.permission ?? generalPermission;
      if (hasPermission(permissions, feature, effectivePerm)) {
        return true;
      }
    }
  }

  return false;
};

export const shouldRenderOptionsColumn = <T>(
  rows: T[],
  showTableOptions?: (row: T) => AccessControlledMenuProps,
): boolean => {
  if (!showTableOptions) return false;

  return rows.some((row) => hasAnyActionPermission(showTableOptions(row)));
};
