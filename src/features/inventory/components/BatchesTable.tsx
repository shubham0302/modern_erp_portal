import { IconButton } from "@/components/base/IconButton";
import { Table, type TableColumn } from "@/components/compound/table/Table";
import { cn } from "@/utils/helpers";
import { PackageOpen, Trash2 } from "lucide-react";
import type { Batch, Finish, Series } from "../types/inventory.types";

interface BatchesTableProps {
  batches: Batch[];
  onDelete: (batch: Batch) => void;
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

const BatchesTable: React.FC<BatchesTableProps> = ({ batches, onDelete }) => {
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
      header: "Boxes",
      accessor: "boxes",
      cell: (value: number) => (
        <span className="text-nl-700 dark:text-nd-100 font-medium">
          {value}
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
      header: "",
      accessor: (row) => row.id,
      className: "w-10",
      cell: (_value, row) => (
        <IconButton
          icon={Trash2}
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(row);
          }}
        />
      ),
    },
  ];

  if (batches.length === 0) {
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
