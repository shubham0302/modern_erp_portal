import type { NavItemTypes } from "@/types/nav.types";
import type {
  PermissionFeaturesEnum,
  UserPermissions,
} from "@/types/permissions.types";

export function hasPermissionAccess(
  permission: PermissionFeaturesEnum | PermissionFeaturesEnum[],
  permissions: UserPermissions,
): boolean {
  if (typeof permission === "string") {
    return permissions[permission]?.canRead === true;
  }

  if (Array.isArray(permission)) {
    return permission.some((p) => permissions[p]?.canRead === true);
  }

  return false;
}

export function filterNavItemsByPermissions(
  navItems: NavItemTypes[],
  permissions: UserPermissions,
): NavItemTypes[] {
  return navItems
    .map((item) => {
      if (!item.permission) {
        if (item.children && item.children.length > 0) {
          const filteredChildren = filterNavItemsByPermissions(
            item.children,
            permissions,
          );

          if (filteredChildren.length === 0) {
            return null;
          }

          return { ...item, children: filteredChildren };
        }

        return item;
      }

      const hasAccess = hasPermissionAccess(item.permission, permissions);

      if (!hasAccess) {
        return null;
      }

      if (item.children && item.children.length > 0) {
        const filteredChildren = filterNavItemsByPermissions(
          item.children,
          permissions,
        );

        if (filteredChildren.length === 0) {
          return null;
        }

        return { ...item, children: filteredChildren };
      }

      return item;
    })
    .filter((item): item is NavItemTypes => item !== null);
}
