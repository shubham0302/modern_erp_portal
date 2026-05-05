import { Button } from "@/components/base/Button";
import { IconButton } from "@/components/base/IconButton";
import { Table, type TableColumn } from "@/components/compound/table/Table";
import { cn } from "@/utils/helpers";
import { PackageOpen, Pencil } from "lucide-react";
import type { Batch, BatchStatus } from "../types/inventory.types";

interface BatchesTableProps {
  batches: Batch[];
  onRequestStatusChange: (batch: Batch, next: BatchStatus) => void;
  onEdit: (batch: Batch) => void;
  emptyState?: React.ReactNode;
  canWrite?: boolean;
}

const TAG_PALETTE = [
  "bg-t-blue/10 text-t-blue dark:bg-t-blue/15 dark:text-t-blue",
  "bg-t-amber/10 text-t-amber dark:bg-t-amber/15 dark:text-t-amber",
  "bg-t-indigo/10 text-t-indigo",
  "bg-t-violet/10 text-t-violet",
  "bg-t-pink/10 text-t-pink",
  "bg-t-peach/10 text-t-peach",
  "bg-t-green/10 text-t-green",
  "bg-t-yellow/10 text-t-yellow",
  "bg-t-purple/10 text-t-purple",
];

const tagStyle = (value: string): string => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return TAG_PALETTE[hash % TAG_PALETTE.length];
};

const statusStyles: Record<BatchStatus, string> = {
  pending: "bg-t-amber/10 text-t-amber dark:bg-t-amber/15 dark:text-t-amber",
  in_production: "bg-t-blue/10 text-t-blue dark:bg-t-blue/15 dark:text-t-blue",
  production_completed:
    "bg-t-green/10 text-t-green dark:bg-t-green/15 dark:text-t-green",
};

export const STATUS_LABEL: Record<BatchStatus, string> = {
  pending: "Pending",
  in_production: "In Production",
  production_completed: "Production Completed",
};

export const getNextStatus = (
  status: BatchStatus,
): BatchStatus | null => {
  if (status === "pending") return "in_production";
  if (status === "in_production") return "production_completed";
  return null;
};

const nextActionLabel: Record<BatchStatus, string> = {
  pending: "Start Production",
  in_production: "Mark Completed",
  production_completed: "",
};

const formatRelativeTime = (iso: string): string => {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

const BatchesTable: React.FC<BatchesTableProps> = ({
  batches,
  onRequestStatusChange,
  onEdit,
  emptyState,
  canWrite = true,
}) => {
  const columns: TableColumn<Batch>[] = [
    {
      header: "Batch ID",
      accessor: "id",
      cell: (value: string) => (
        <span className="text-nl-700 dark:text-nd-100 font-mono text-xs font-medium">
          {value}
        </span>
      ),
    },
    {
      header: "Finish",
      accessor: "finish",
      cell: (value: string) => (
        <span
          className={cn(
            "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium",
            tagStyle(value),
          )}
        >
          {value}
        </span>
      ),
    },
    {
      header: "Series",
      accessor: "series",
      cell: (value: string) => (
        <span
          className={cn(
            "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold",
            tagStyle(value),
          )}
        >
          {value}
        </span>
      ),
    },
    {
      header: "Design Code",
      accessor: "designCode",
      cell: (value: string) => (
        <span className="text-nl-700 dark:text-nd-100 font-medium">
          {value}
        </span>
      ),
    },
    {
      header: "Boxes",
      accessor: "boxes",
      cell: (value: number) => (
        <span className="text-nl-700 dark:text-nd-100 font-medium">
          {value}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (value: BatchStatus) => (
        <span
          className={cn(
            "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium",
            statusStyles[value],
          )}
        >
          {STATUS_LABEL[value]}
        </span>
      ),
    },
    {
      header: "Added",
      accessor: "createdAt",
      cell: (value: string) => (
        <span className="text-nl-500 dark:text-nd-400 text-xs">
          {formatRelativeTime(value)}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (row) => row.id,
      className: "w-48",
      cell: (_value, row) => {
        const next = getNextStatus(row.status);
        if (!canWrite) {
          return <span className="text-nl-400 dark:text-nd-500 text-xs">—</span>;
        }
        return (
          <div className="flex items-center gap-2">
            {next ? (
              <Button
                size="sm"
                variant="outline"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestStatusChange(row, next);
                }}
              >
                {nextActionLabel[row.status]}
              </Button>
            ) : (
              <span className="text-nl-400 dark:text-nd-500 text-xs">—</span>
            )}
            {row.status === "pending" && (
              <IconButton
                icon={Pencil}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(row);
                }}
              />
            )}
          </div>
        );
      },
    },
  ];

  if (batches.length === 0) {
    if (emptyState) return <>{emptyState}</>;
    return (
      <div className="card fall flex-col gap-3 py-14">
        <div className="bg-pl-50 dark:bg-pd-900/40 text-pl-500 dark:text-pd-400 flex size-14 items-center justify-center rounded-2xl">
          <PackageOpen size={26} />
        </div>
        <div className="text-center">
          <h6 className="text-nl-700 dark:text-nd-100 font-semibold">
            No batches yet
          </h6>
          <p className="text-nl-500 dark:text-nd-400 mt-1 text-sm">
            Click 'Add Batch' to create one
          </p>
        </div>
      </div>
    );
  }

  return <Table columns={columns} data={batches} />;
};

export default BatchesTable;
