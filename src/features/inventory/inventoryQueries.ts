import { showErrorToasts } from "@/utils/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  completeBatchProduction,
  createBatch,
  getBatchesBySize,
  getDesignsBySize,
  getInventorySeries,
  getInventorySizes,
  startBatchProduction,
  updateBatch,
} from "./inventoryService";
import type { UpdateBatchRequest } from "./types/inventory.types";

export const inventoryKeys = {
  all: ["inventory"] as const,
  sizes: () => [...inventoryKeys.all, "sizes"] as const,
  series: () => [...inventoryKeys.all, "series"] as const,
  designsBySize: (sizeId: string) =>
    [...inventoryKeys.all, "designsBySize", sizeId] as const,
  batches: () => [...inventoryKeys.all, "batches"] as const,
  batchesBySize: (sizeId: string) =>
    [...inventoryKeys.batches(), "bySize", sizeId] as const,
};

export const useInventorySizesQuery = () =>
  useQuery({
    queryKey: inventoryKeys.sizes(),
    queryFn: getInventorySizes,
  });

export const useInventorySeriesQuery = () =>
  useQuery({
    queryKey: inventoryKeys.series(),
    queryFn: getInventorySeries,
  });

export const useDesignsBySizeQuery = (sizeId: string, enabled = true) =>
  useQuery({
    queryKey: inventoryKeys.designsBySize(sizeId),
    queryFn: () => getDesignsBySize(sizeId),
    enabled: enabled && !!sizeId,
  });

export const useBatchesBySizeQuery = (sizeId: string, enabled = true) =>
  useQuery({
    queryKey: inventoryKeys.batchesBySize(sizeId),
    queryFn: () => getBatchesBySize(sizeId),
    enabled: enabled && !!sizeId,
  });

export const useCreateBatchMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.batches() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.sizes() });
    },
    onError: (error) => {
      showErrorToasts(error);
    },
  });
};

export const useUpdateBatchMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBatchRequest }) =>
      updateBatch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.batches() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.sizes() });
    },
    onError: (error) => {
      showErrorToasts(error);
    },
  });
};

export const useStartBatchProductionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: startBatchProduction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.batches() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.sizes() });
    },
    onError: (error) => {
      showErrorToasts(error);
    },
  });
};

export const useCompleteBatchProductionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeBatchProduction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.batches() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.sizes() });
    },
    onError: (error) => {
      showErrorToasts(error);
    },
  });
};
