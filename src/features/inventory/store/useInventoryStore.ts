import { create } from "zustand";
import type { Batch, SizeKey } from "../types/inventory.types";
import { formatBatchId } from "../utils/batchId";

type NewBatchInput = Omit<Batch, "id" | "createdAt">;

interface InventoryStore {
  batches: Batch[];
  counter: number;
  addBatch: (input: NewBatchInput) => Batch;
  deleteBatch: (id: string) => void;
  getBatchesBySize: (size: SizeKey) => Batch[];
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  batches: [],
  counter: 0,

  addBatch: (input) => {
    const nextCounter = get().counter + 1;
    const batch: Batch = {
      ...input,
      id: formatBatchId(input.size, nextCounter),
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

  getBatchesBySize: (size) => {
    return get().batches.filter((b) => b.size === size);
  },
}));
