import { useQuery } from "@tanstack/react-query";
import { getInventorySeries, getInventorySizes } from "./inventoryService";

export const inventoryKeys = {
  all: ["inventory"] as const,
  sizes: () => [...inventoryKeys.all, "sizes"] as const,
  series: () => [...inventoryKeys.all, "series"] as const,
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
