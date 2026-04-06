export interface PDFGenerateOptions {
  fileName: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export interface PDFTableColumn<T = any> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  width?: string | number;
  align?: "left" | "center" | "right";
}

export interface PDFTableProps<T = any> {
  columns: PDFTableColumn<T>[];
  data: T[];
  showHeader?: boolean;
}
