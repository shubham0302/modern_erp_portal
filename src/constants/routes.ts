export const ROUTES = {
  DASHBOARD: "/dashboard",
  INVENTORY: {
    ROOT: "/inventory",
    SIZE: (size: string) => `/inventory/${size}`,
  },
  ORDERS: "/orders",
  INVENTORY_ITEMS: "/inventory-items",
  REPORTS: "/reports",
  SETTINGS: "/settings",
  LOGIN: "/login",
};
