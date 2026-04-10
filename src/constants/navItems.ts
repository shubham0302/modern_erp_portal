import type { NavItemTypes } from "@/types/nav.types";
import { ROUTES } from "./routes";

export const NAV_ITEMS: NavItemTypes[] = [
  {
    label: "Dashboard",
    path: ROUTES.DASHBOARD,
    icon: "LayoutDashboard",
  },
  {
    label: "Inventory",
    path: ROUTES.INVENTORY.ROOT,
    icon: "Package",
  },
  {
    label: "Orders",
    path: ROUTES.ORDERS,
    icon: "ShoppingCart",
  },
  {
    label: "Customers",
    path: ROUTES.CUSTOMERS,
    icon: "Users",
  },
  {
    label: "Reports",
    path: ROUTES.REPORTS,
    icon: "BarChart3",
  },
  {
    label: "Settings",
    path: ROUTES.SETTINGS,
    icon: "Settings",
  },
];
