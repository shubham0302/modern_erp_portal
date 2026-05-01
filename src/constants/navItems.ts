import { PermissionFeaturesEnum } from "@/types/permissions.types";
import type { NavItemTypes } from "@/types/nav.types";
import { ROUTES } from "./routes";

export const NAV_ITEMS: NavItemTypes[] = [
  {
    label: "Dashboard",
    path: ROUTES.DASHBOARD,
    icon: "LayoutDashboard",
    permission: PermissionFeaturesEnum.dashboard,
  },
  {
    label: "Designs",
    path: ROUTES.DESIGNS,
    icon: "BookOpen",
    permission: PermissionFeaturesEnum.designs,
  },
  {
    label: "Inventory",
    path: ROUTES.INVENTORY.ROOT,
    icon: "Boxes",
    permission: PermissionFeaturesEnum.inventory,
  },
  {
    label: "Production",
    path: ROUTES.PRODUCTION,
    icon: "Factory",
    permission: PermissionFeaturesEnum.production,
  },
  {
    label: "Order",
    path: ROUTES.ORDERS,
    icon: "ShoppingCart",
    permission: PermissionFeaturesEnum.order,
  },
  {
    label: "Finance",
    path: ROUTES.FINANCE,
    icon: "Wallet",
    permission: PermissionFeaturesEnum.finance,
  },
];
