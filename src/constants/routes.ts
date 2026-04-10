export const ROUTES = {
  DASHBOARD: "/dashboard",
  INVENTORY: {
    ROOT: "/inventory",
    SIZE: (size: string) => `/inventory/${size}`,
  },
  ORDERS: "/orders",
  CUSTOMERS: "/customers",
  REPORTS: "/reports",
  SETTINGS: "/settings",
  LOGIN: "/login",
};
