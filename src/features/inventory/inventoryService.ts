import { getData } from "@/api/axiosInstance";
import type {
  InventorySeries,
  InventorySize,
} from "./types/inventory.types";

export const getInventorySizes = () =>
  getData<InventorySize[]>("/inventory/sizes");

export const getInventorySeries = () =>
  getData<InventorySeries[]>("/inventory/series");
