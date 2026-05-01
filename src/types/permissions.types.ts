export enum PermissionFeaturesEnum {
  dashboard = "dashboard",
  designs = "designs",
  inventory = "inventory",
  production = "production",
  order = "order",
  finance = "finance",
}

export enum PermissionTypeEnum {
  canRead = "canRead",
  canWrite = "canWrite",
}

export type PermissionTypes = {
  [key in PermissionTypeEnum]?: boolean;
};

export type UserPermissions = {
  [key in PermissionFeaturesEnum]: PermissionTypes;
};
