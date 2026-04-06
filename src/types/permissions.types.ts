export enum PermissionFeaturesEnum {
  dashboard = "dashboard",
  inventory = "inventory",
  orders = "orders",
  customers = "customers",
  reports = "reports",
  settings = "settings",
}

export enum PermissionTypeEnum {
  read = "read",
  write = "write",
  delete = "delete",
}

export type PermissionTypes = {
  [key in PermissionTypeEnum]?: boolean;
};

export type UserPermissions = {
  [key in PermissionFeaturesEnum]: PermissionTypes;
};
