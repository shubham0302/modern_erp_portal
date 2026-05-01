export interface InventorySize {
  id: string;
  name: string;
  isActive: boolean;
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
  id: string;
  size: SizeKey;
  finish: Finish;
  series: Series;
  designCode: string;
  boxes: number;
  status: BatchStatus;
  createdAt: string;
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
  finish: Finish;
  series: Series;
  designCode: string;
  status: InventoryItemStatus;
  createdAt: string;
}
