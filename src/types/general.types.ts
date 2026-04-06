export type PaginationQueryParams = {
  currentPage?: number;
  pageSize?: number;
};

export type GeneralQueryParams<_T = unknown> = PaginationQueryParams & {
  search?: string;
  sortByField?: string;
  isAscending?: boolean;
  fetchAll?: boolean;
  active?: string;
};

export type AddEditFormProps<T> = {
  mode: "add" | "edit";
  defaultValues?: T;
  onSubmit: (formData: T) => void;
  isMutating?: boolean;
  className?: string;
  onCancel?: () => void;
  onSuccess?: (resetForm: () => void) => void;
};

export type AverageRating = {
  totalRatings: number;
  averageRating: number;
};

export enum PortalAccessUserTypeEnum {
  staff = "staff",
  master_franchise_owner = "master_franchise_owner",
  master_franchise_staff = "master_franchise_staff",
  franchise_owner = "franchise_owner",
  franchise_staff = "franchise_staff",
}

export enum FbPlatformTypeEnum {
  rider = "rider",
  customer = "customer",
  seller = "seller",
}

export enum DeviceTypeEnum {
  android = "android",
  ios = "ios",
}

export type ResetPasswordPayload = {
  newPassword: "string";
};
