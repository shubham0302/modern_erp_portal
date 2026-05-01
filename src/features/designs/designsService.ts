import { getData, postData } from "@/api/axiosInstance";
import type {
  CreateDesignRequest,
  CreateDesignResponse,
  Design,
} from "./types/designs.types";

export const getDesigns = () => getData<Design[]>("/inventory/designs");

export const createDesign = (data: CreateDesignRequest) =>
  postData<CreateDesignResponse, CreateDesignRequest>(
    "/inventory/designs/create",
    data,
  );
