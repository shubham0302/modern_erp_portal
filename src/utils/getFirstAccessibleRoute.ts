import type { NavItemTypes } from "@/types/nav.types";
import { NAV_ITEMS } from "@/constants/navItems";
import { ROUTES } from "@/constants/routes";
import type { UserPermissions } from "@/types/permissions.types";
import { hasPermissionAccess } from "./navFilter";

function findFirstAccessiblePath(
  navItems: NavItemTypes[],
  permissions: UserPermissions,
): string | null {
  for (const item of navItems) {
    if (item.permission) {
      const hasAccess = hasPermissionAccess(item.permission, permissions);
      if (!hasAccess) {
        continue;
      }
    }

    if ("path" in item && item.path) {
      return item.path;
    }

    if (item.children && item.children.length > 0) {
      const childPath = findFirstAccessiblePath(item.children, permissions);
      if (childPath) {
        return childPath;
      }
    }
  }

  return null;
}

function isRouteAccessible(
  path: string,
  navItems: NavItemTypes[],
  permissions: UserPermissions,
): boolean {
  for (const item of navItems) {
    if ("path" in item && item.path === path) {
      if (item.permission) {
        return hasPermissionAccess(item.permission, permissions);
      }
      return true;
    }

    if (item.children && item.children.length > 0) {
      const childResult = isRouteAccessible(path, item.children, permissions);
      if (childResult) {
        return childResult;
      }
    }
  }

  return false;
}

export function getFirstAccessibleRoute(
  permissions: UserPermissions,
  redirectTo?: string,
): string {
  if (redirectTo && isRouteAccessible(redirectTo, NAV_ITEMS, permissions)) {
    return redirectTo;
  }

  const firstPath = findFirstAccessiblePath(NAV_ITEMS, permissions);

  if (firstPath) {
    return firstPath;
  }

  return ROUTES.DASHBOARD;
}
