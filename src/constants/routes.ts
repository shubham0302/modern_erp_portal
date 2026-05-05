export const ROUTES = {
  DASHBOARD: "/dashboard",
  DESIGNS: "/designs",
  INVENTORY: {
    ROOT: "/inventory",
    SIZE: (sizeId: string) => `/inventory/${sizeId}`,
  },
  PRODUCTION: "/production",
  ORDERS: "/orders",
  FINANCE: "/finance",
  INVENTORY_ITEMS: "/inventory-items",
  REPORTS: "/reports",
  SETTINGS: "/settings",
  LOGIN: "/login",
};
