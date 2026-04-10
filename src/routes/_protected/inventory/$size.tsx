import { Button } from "@/components/base/Button";
import DeleteDialog from "@/components/compound/DeleteDialog";
import AddBatchDialog from "@/features/inventory/components/AddBatchDialog";
import BatchesTable from "@/features/inventory/components/BatchesTable";
import {
  formatSize,
  isValidSize,
} from "@/features/inventory/constants/inventoryOptions";
import { useInventoryStore } from "@/features/inventory/store/useInventoryStore";
import type { Batch, SizeKey } from "@/features/inventory/types/inventory.types";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/_protected/inventory/$size")({
  component: RouteComponent,
  beforeLoad: ({ params }) => {
    if (!isValidSize(params.size)) {
      throw redirect({ to: "/inventory" });
    }
  },
  staticData: {
    pageTitle: "Inventory",
  },
});

function RouteComponent() {
  const { size } = Route.useParams();
  const typedSize = size as SizeKey;

  const allBatches = useInventoryStore((s) => s.batches);
  const deleteBatch = useInventoryStore((s) => s.deleteBatch);

  const batches = useMemo(
    () => allBatches.filter((b) => b.size === typedSize),
    [allBatches, typedSize],
  );

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<Batch | null>(null);

  const totalBoxes = batches.reduce((sum, b) => sum + b.boxes, 0);

  const handleConfirmDelete = () => {
    if (batchToDelete) {
      deleteBatch(batchToDelete.id);
      setBatchToDelete(null);
    }
  };

  return (
    <div className="page-enter space-y-6 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h4 className="text-nl-800 dark:text-nd-100 font-bold">
            {formatSize(typedSize)} Inventory
          </h4>
          <p className="text-nl-500 dark:text-nd-300 mt-1 text-sm">
            Manage batches for {formatSize(typedSize)} tiles
          </p>
        </div>

        <div className="flex items-center gap-3">
          <SummaryChip label="Batches" value={batches.length} />
          <SummaryChip label="Boxes" value={totalBoxes} />
          <Button startIcon="Plus" onClick={() => setIsAddOpen(true)}>
            Add Batch
          </Button>
        </div>
      </div>

      <BatchesTable
        batches={batches}
        onDelete={(batch) => setBatchToDelete(batch)}
      />

      <AddBatchDialog
        isOpen={isAddOpen}
        close={() => setIsAddOpen(false)}
        size={typedSize}
      />

      <DeleteDialog
        isOpen={batchToDelete !== null}
        close={() => setBatchToDelete(null)}
        onDelete={handleConfirmDelete}
        isDeleting={false}
        name={batchToDelete?.id}
        title="Delete Batch"
      />
    </div>
  );
}

interface SummaryChipProps {
  label: string;
  value: number;
}

const SummaryChip: React.FC<SummaryChipProps> = ({ label, value }) => (
  <div className="bg-nl-50 dark:bg-nd-800 border-nl-200 dark:border-nd-500 flex items-center gap-2 rounded-xl border px-3 py-2">
    <span className="text-nl-500 dark:text-nd-400 text-xs">{label}</span>
    <span className="text-nl-800 dark:text-nd-100 text-sm font-semibold">
      {value}
    </span>
  </div>
);
