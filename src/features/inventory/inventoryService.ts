import { getData, patchData, postData } from "@/api/axiosInstance";
import type {
  BatchListItem,
  CreateBatchRequest,
  CreateBatchResponse,
  InventoryDesign,
  InventorySeries,
  InventorySize,
  UpdateBatchRequest,
} from "./types/inventory.types";

export const getInventorySizes = () =>
  getData<InventorySize[]>("/inventory/sizes");

export const getInventorySeries = () =>
  getData<InventorySeries[]>("/inventory/series");

export const getDesignsBySize = (sizeId: string) =>
  getData<InventoryDesign[]>(`/inventory/sizes/${sizeId}/designs`);

export const getBatchesBySize = (sizeId: string) =>
  getData<BatchListItem[]>(`/inventory/batches/by-size/${sizeId}`);

export const createBatch = (data: CreateBatchRequest) =>
  postData<CreateBatchResponse, CreateBatchRequest>(
    "/inventory/batches/create",
    data,
  );

export const updateBatch = (id: string, data: UpdateBatchRequest) =>
  patchData<BatchListItem, UpdateBatchRequest>(
    `/inventory/batches/update/${id}`,
    data,
  );

export const startBatchProduction = (id: string) =>
  patchData<BatchListItem, Record<string, never>>(
    `/inventory/batches/start-production/${id}`,
    {},
  );

export const completeBatchProduction = (id: string) =>
  patchData<BatchListItem, Record<string, never>>(
    `/inventory/batches/complete-production/${id}`,
    {},
  );
