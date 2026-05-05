export interface InventorySize {
  id: string;
  name: string;
  isActive: boolean;
  totalBatches: number;
  totalBoxes: number;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  updatedByPlatform: string;
  updatedByName: string;
}

export interface InventoryFinish {
  id: string;
  name: string;
  isActive: boolean;
  sizes?: InventorySize[];
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
  updatedByPlatform?: string;
  updatedByName?: string;
}

export interface InventorySizeFinish {
  id: string;
  size: InventorySize;
  finish: InventoryFinish;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InventorySeries {
  id: string;
  name: string;
  isActive: boolean;
  sizeFinishes: InventorySizeFinish[];
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
  updatedByPlatform?: string;
  updatedByName?: string;
}

export type DesignStatus = "pending" | "approved" | "rejected";

export interface InventoryDesignStatusEntry {
  status: DesignStatus;
  date: string;
  reason?: string;
}

export interface InventoryDesign {
  id: string;
  name: string;
  thumbnailUrl: string;
  series: InventorySeries;
  sizeFinishes: InventorySizeFinish[];
  isActive: boolean;
  status: DesignStatus;
  approvedAt: string;
  statusHistory: InventoryDesignStatusEntry[];
  rejectionReason: string;
  createdBy: string;
  createdByName: string;
  approvedBy: string;
  approvedByName: string;
  updatedBy: string;
  updatedByName: string;
  createdAt: string;
  updatedAt: string;
}

export type Finish = "matt" | "glossy";

export type GlossySeries = "GL" | "EL" | "PN";
export type MattSeries = "SF" | "WF" | "TZ" | "PF";
export type Series = GlossySeries | MattSeries;

export type SizeKey =
  | "40x40"
  | "25x40"
  | "50x50"
  | "30x60"
  | "60x60"
  | "60x120";

export type BatchStatus = "pending" | "in_production" | "production_completed";

export interface Batch {
  apiId: string;
  id: string;
  size: SizeKey;
  finish: string;
  series: string;
  designCode: string;
  boxes: number;
  status: BatchStatus;
  createdAt: string;
}

export interface UpdateBatchRequest {
  numberOfBoxes: number;
}

export interface CreateBatchRequest {
  designId: string;
  sizeFinishId: string;
  sizeId: string;
  numberOfBoxes: number;
}

export interface CreateBatchResponse {
  id: string;
  designId: string;
  sizeFinishId: string;
  sizeId: string;
  numberOfBoxes: number;
  status: BatchStatus;
  createdAt: string;
}

export interface BatchStatusHistoryEntry {
  status: BatchStatus;
  date: string;
  reason?: string;
}

export interface BatchListItem {
  id: string;
  batchId: string;
  design: InventoryDesign;
  sizeFinish: InventorySizeFinish;
  size: InventorySize;
  numberOfBoxes: number;
  status: BatchStatus;
  isActive: boolean;
  statusHistory: BatchStatusHistoryEntry[];
  createdBy: string;
  createdByName: string;
  updatedBy: string;
  updatedByName: string;
  createdAt: string;
  updatedAt: string;
}

export type InventoryItemStatus =
  | "unverified"
  | "verified"
  | "on_the_way"
  | "in_depot"
  | "sold";

export interface InventoryItem {
  id: string;
  batchId: string;
  size: SizeKey;
  finish: string;
  series: string;
  designCode: string;
  status: InventoryItemStatus;
  createdAt: string;
}
