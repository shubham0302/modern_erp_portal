export const ROUTES = {
  DASHBOARD: "/dashboard",
  DESIGNS: "/designs",
  INVENTORY: {
    ROOT: "/inventory",
    SIZE: (size: string) => `/inventory/${size}`,
  },
  PRODUCTION: "/production",
  ORDERS: "/orders",
  FINANCE: "/finance",
  INVENTORY_ITEMS: "/inventory-items",
  REPORTS: "/reports",
  SETTINGS: "/settings",
  LOGIN: "/login",
};
