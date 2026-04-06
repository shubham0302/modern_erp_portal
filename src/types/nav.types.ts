import type { PermissionFeaturesEnum } from "@/types/permissions.types";
import type * as LucideIcons from "lucide-react";

export type NavItemTypes = {
  label: string;
  icon?: keyof typeof LucideIcons;
  permission?: PermissionFeaturesEnum | PermissionFeaturesEnum[];
} & (
  | { path: string; children?: NavItemTypes[] }
  | { children?: NavItemTypes[] }
);
