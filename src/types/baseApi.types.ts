export interface BaseApiResponse<T> {
  data: T;
  statusCode: number;
}

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalRows: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  currentRows: number;
}

export interface BaseApiErrorResponse {
  statusCode?: number;
  errorCode?: string;
  message?: string | string[];
  requestId?: string;
  details?: unknown;
  path?: string;
}

export interface BaseApiErrorEnvelope {
  success: false;
  error: BaseApiErrorResponse;
}
