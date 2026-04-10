import type { SizeKey } from "../types/inventory.types";

export const formatBatchId = (size: SizeKey, counter: number): string => {
  const padded = String(counter).padStart(6, "0");
  return `BATCH-${size}-${padded}`;
};
