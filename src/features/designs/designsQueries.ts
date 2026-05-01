import { showErrorToasts } from "@/utils/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDesign, getDesigns } from "./designsService";

export const designsKeys = {
  all: ["designs"] as const,
  list: () => [...designsKeys.all, "list"] as const,
};

export const useDesignsQuery = () =>
  useQuery({
    queryKey: designsKeys.list(),
    queryFn: getDesigns,
  });

export const useCreateDesignMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDesign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: designsKeys.list() });
    },
    onError: (error) => {
      showErrorToasts(error);
    },
  });
};
