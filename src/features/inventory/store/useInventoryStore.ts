import { create } from "zustand";
import type {
  Batch,
  BatchStatus,
  InventoryItem,
  InventoryItemStatus,
  SizeKey,
} from "../types/inventory.types";
import { formatBatchId } from "../utils/batchId";

type NewBatchInput = Omit<Batch, "id" | "createdAt" | "status">;

interface InventoryStore {
  batches: Batch[];
  items: InventoryItem[];
  counter: number;
  addBatch: (input: NewBatchInput) => Batch;
  deleteBatch: (id: string) => void;
  updateBatchStatus: (id: string, status: BatchStatus) => void;
  updateItemStatus: (id: string, status: InventoryItemStatus) => void;
  getBatchesBySize: (size: SizeKey) => Batch[];
}

const buildItemId = (batchId: string, index: number): string => {
  const padded = String(index).padStart(3, "0");
  return `INV-${batchId}-${padded}`;
};

const generateItemsForBatch = (batch: Batch): InventoryItem[] => {
  const now = new Date().toISOString();
  return Array.from({ length: batch.boxes }, (_, i) => ({
    id: buildItemId(batch.id, i + 1),
    batchId: batch.id,
    size: batch.size,
    finish: batch.finish,
    series: batch.series,
    designCode: batch.designCode,
    status: "unverified" as InventoryItemStatus,
    createdAt: now,
  }));
};

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  batches: [],
  items: [],
  counter: 0,

  addBatch: (input) => {
    const nextCounter = get().counter + 1;
    const batch: Batch = {
      ...input,
      id: formatBatchId(input.size, nextCounter),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      batches: [batch, ...state.batches],
      counter: nextCounter,
    }));
    return batch;
  },

  deleteBatch: (id) => {
    set((state) => ({
      batches: state.batches.filter((b) => b.id !== id),
    }));
  },

  updateBatchStatus: (id, status) => {
    set((state) => {
      const target = state.batches.find((b) => b.id === id);
      if (!target) return state;

      const updatedBatches = state.batches.map((b) =>
        b.id === id ? { ...b, status } : b,
      );

      const shouldGenerate =
        status === "in_production" &&
        target.status === "pending" &&
        !state.items.some((it) => it.batchId === id);

      const updatedItems = shouldGenerate
        ? [...generateItemsForBatch(target), ...state.items]
        : state.items;

      return { batches: updatedBatches, items: updatedItems };
    });
  },

  updateItemStatus: (id, status) => {
    set((state) => ({
      items: state.items.map((it) =>
        it.id === id ? { ...it, status } : it,
      ),
    }));
  },

  getBatchesBySize: (size) => {
    return get().batches.filter((b) => b.size === size);
  },
}));
