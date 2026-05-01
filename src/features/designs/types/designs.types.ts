import type {
  InventorySeries,
  InventorySizeFinish,
} from "@/features/inventory/types/inventory.types";

export type DesignStatus = "pending" | "approved" | "rejected";

export interface DesignStatusHistory {
  status: DesignStatus;
  date: string;
  reason: string;
}

export interface Design {
  id: string;
  name: string;
  thumbnailUrl: string;
  series: InventorySeries;
  sizeFinishes: InventorySizeFinish[];
  status: DesignStatus;
  statusHistory: DesignStatusHistory[];
  isActive: boolean;
  approvedAt: string;
  rejectionReason: string;
  createdBy: string;
  createdByName: string;
  approvedBy: string;
  approvedByName: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  updatedByName: string;
}

export interface CreateDesignRequest {
  name: string;
  thumbnailUrl?: string;
  seriesId: string;
  sizeFinishIds: string[];
}

export interface CreateDesignResponse extends Design {}
