import type { PortalAccessUserTypeEnum } from "./general.types";

export interface User {
  name: string;
  uniqueId: string;
  email: string;
  roles: string[];
  active: boolean;
  createdDate: string;
  userType: PortalAccessUserTypeEnum;
  referenceFranchiseId?: string;
}
