import { Button } from "@/components/base/Button";
import { Table, type TableColumn } from "@/components/compound/table/Table";
import { cn } from "@/utils/helpers";
import { PackageOpen } from "lucide-react";
import type {
  Finish,
  InventoryItem,
  InventoryItemStatus,
  Series,
} from "../types/inventory.types";

interface InventoryItemsTableProps {
  items: InventoryItem[];
  onRequestStatusChange: (
    item: InventoryItem,
    next: InventoryItemStatus,
  ) => void;
  emptyState?: React.ReactNode;
}

const finishStyles: Record<Finish, string> = {
  glossy: "bg-t-blue/10 text-t-blue dark:bg-t-blue/15 dark:text-t-blue",
  matt: "bg-t-amber/10 text-t-amber dark:bg-t-amber/15 dark:text-t-amber",
};

const finishLabel: Record<Finish, string> = {
  glossy: "Glossy",
  matt: "Matt",
};

const seriesTint: Record<Series, string> = {
  GL: "bg-t-indigo/10 text-t-indigo",
  EL: "bg-t-violet/10 text-t-violet",
  PN: "bg-t-pink/10 text-t-pink",
  SF: "bg-t-peach/10 text-t-peach",
  WF: "bg-t-green/10 text-t-green",
  TZ: "bg-t-yellow/10 text-t-yellow",
  PF: "bg-t-purple/10 text-t-purple",
};

const itemStatusStyles: Record<InventoryItemStatus, string> = {
  unverified:
    "bg-t-gray/10 text-t-gray dark:bg-t-gray/15 dark:text-t-gray",
  verified:
    "bg-t-amber/10 text-t-amber dark:bg-t-amber/15 dark:text-t-amber",
  on_the_way:
    "bg-t-blue/10 text-t-blue dark:bg-t-blue/15 dark:text-t-blue",
  in_depot:
    "bg-t-indigo/10 text-t-indigo dark:bg-t-indigo/15 dark:text-t-indigo",
  sold: "bg-t-green/10 text-t-green dark:bg-t-green/15 dark:text-t-green",
};

export const ITEM_STATUS_LABEL: Record<InventoryItemStatus, string> = {
  unverified: "Unverified",
  verified: "Verified",
  on_the_way: "On The Way",
  in_depot: "In Depot",
  sold: "Sold",
};

const ITEM_STATUS_SEQUENCE: InventoryItemStatus[] = [
  "unverified",
  "verified",
  "on_the_way",
  "in_depot",
  "sold",
];

export const getNextItemStatus = (
  status: InventoryItemStatus,
): InventoryItemStatus | null => {
  const idx = ITEM_STATUS_SEQUENCE.indexOf(status);
  if (idx === -1 || idx >= ITEM_STATUS_SEQUENCE.length - 1) return null;
  return ITEM_STATUS_SEQUENCE[idx + 1];
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

const InventoryItemsTable: React.FC<InventoryItemsTableProps> = ({
  items,
  onRequestStatusChange,
  emptyState,
}) => {
  const columns: TableColumn<InventoryItem>[] = [
    {
      header: "ID",
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
      cell: (value: Finish) => (
        <span
          className={cn(
            "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium",
            finishStyles[value],
          )}
        >
          {finishLabel[value]}
        </span>
      ),
    },
    {
      header: "Series",
      accessor: "series",
      cell: (value: Series) => (
        <span
          className={cn(
            "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold",
            seriesTint[value],
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
      header: "Batch ID",
      accessor: "batchId",
      cell: (value: string) => (
        <span className="text-nl-600 dark:text-nd-200 font-mono text-xs">
          {value}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (value: InventoryItemStatus) => (
        <span
          className={cn(
            "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium",
            itemStatusStyles[value],
          )}
        >
          {ITEM_STATUS_LABEL[value]}
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
      className: "w-40",
      cell: (_value, row) => {
        const next = getNextItemStatus(row.status);
        if (!next) return null;
        return (
          <Button
            size="sm"
            variant="outline"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              onRequestStatusChange(row, next);
            }}
          >
            {ITEM_STATUS_LABEL[next]}
          </Button>
        );
      },
    },
  ];

  if (items.length === 0) {
    if (emptyState) return <>{emptyState}</>;
    return (
      <div className="card fall flex-col gap-3 py-14">
        <div className="bg-pl-50 dark:bg-pd-900/40 text-pl-500 dark:text-pd-400 flex size-14 items-center justify-center rounded-2xl">
          <PackageOpen size={26} />
        </div>
        <div className="text-center">
          <h6 className="text-nl-700 dark:text-nd-100 font-semibold">
            No inventory items yet
          </h6>
          <p className="text-nl-500 dark:text-nd-400 mt-1 text-sm">
            Items are generated when a batch enters production
          </p>
        </div>
      </div>
    );
  }

  return <Table columns={columns} data={items} />;
};

export default InventoryItemsTable;
