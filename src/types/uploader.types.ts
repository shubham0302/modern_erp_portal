export type FileType = "image" | "file" | "video";

export type Uploader =
  | "customer"
  | "seller_owner"
  | "seller_staff"
  | "rider"
  | "staff"
  | "franchise"
  | "masterFranchise";

export interface UploadMeta {
  type: FileType;
  uploader: Uploader;
  group: string;
  size: string;
}

export interface UploadResult {
  type: string;
  path: string;
  name: string;
  uploader: UploadMeta["uploader"];
  group: UploadMeta["group"];
  size: number;
  uniqueId: string;
  createdDate: number;
}
