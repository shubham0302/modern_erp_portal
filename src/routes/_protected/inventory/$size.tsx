import { Button } from "@/components/base/Button";
import { SingleSelect, type SelectOption } from "@/components/base/Select";
import Dialog from "@/components/compound/Dialog";
import QueryStateHandler from "@/components/compound/QueryStateHandler";
import SearchInput from "@/components/compound/SearchInput";
import { toast } from "@/components/compound/Sonner";
import AddBatchDialog from "@/features/inventory/components/AddBatchDialog";
import BatchesTable, {
  STATUS_LABEL,
} from "@/features/inventory/components/BatchesTable";
import EditBatchDialog from "@/features/inventory/components/EditBatchDialog";
import { formatSize } from "@/features/inventory/constants/inventoryOptions";
import {
  useBatchesBySizeQuery,
  useCompleteBatchProductionMutation,
  useDesignsBySizeQuery,
  useInventorySizesQuery,
  useStartBatchProductionMutation,
} from "@/features/inventory/inventoryQueries";
import type {
  Batch,
  BatchListItem,
  BatchStatus,
  InventoryDesign,
  InventorySize,
  SizeKey,
} from "@/features/inventory/types/inventory.types";
import useDebounce from "@/hooks/useDebounce";
import { usePermissionStore } from "@/store/usePermissions";
import { PermissionFeaturesEnum } from "@/types/permissions.types";
import { getFeaturePermissions } from "@/utils/rbac";
import { createFileRoute } from "@tanstack/react-router";
import { PackageOpen } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/_protected/inventory/$size")({
  component: RouteComponent,
  staticData: {
    pageTitle: "Batch Management",
  },
});

const statusOptions: SelectOption<string>[] = [
  { label: "All statuses", value: "" },
  { label: STATUS_LABEL.pending, value: "pending" },
  { label: STATUS_LABEL.in_production, value: "in_production" },
  { label: STATUS_LABEL.production_completed, value: "production_completed" },
];

interface NamedRecord {
  id: string;
  name: string;
}

const buildFinishOptions = (
  designs: InventoryDesign[],
  sizeId: string,
): NamedRecord[] => {
  const map = new Map<string, NamedRecord>();
  for (const d of designs) {
    for (const sf of d.sizeFinishes) {
      if (sf.size.id === sizeId && !map.has(sf.finish.name)) {
        map.set(sf.finish.name, { id: sf.finish.id, name: sf.finish.name });
      }
    }
  }
  return [...map.values()];
};

const buildSeriesOptions = (
  designs: InventoryDesign[],
  sizeId: string,
  finishName: string,
): NamedRecord[] => {
  const map = new Map<string, NamedRecord>();
  for (const d of designs) {
    if (!d.series) continue;
    const matchesFinish = finishName
      ? d.sizeFinishes.some(
          (sf) => sf.size.id === sizeId && sf.finish.name === finishName,
        )
      : d.sizeFinishes.some((sf) => sf.size.id === sizeId);
    if (matchesFinish && !map.has(d.series.name)) {
      map.set(d.series.name, { id: d.series.id, name: d.series.name });
    }
  }
  return [...map.values()];
};

const buildDesignOptions = (
  designs: InventoryDesign[],
  sizeId: string,
  finishName: string,
  seriesName: string,
): NamedRecord[] => {
  const map = new Map<string, NamedRecord>();
  for (const d of designs) {
    const matchesSize = d.sizeFinishes.some((sf) => sf.size.id === sizeId);
    if (!matchesSize) continue;
    if (seriesName && d.series?.name !== seriesName) continue;
    if (
      finishName &&
      !d.sizeFinishes.some(
        (sf) => sf.size.id === sizeId && sf.finish.name === finishName,
      )
    ) {
      continue;
    }
    if (!map.has(d.name)) map.set(d.name, { id: d.id, name: d.name });
  }
  return [...map.values()];
};

const toSelectOptions = (
  records: NamedRecord[],
  allLabel: string,
): SelectOption<string>[] => [
  { label: allLabel, value: "" },
  ...records.map((r) => ({ label: r.name, value: r.name })),
];

interface PendingTransition {
  batch: Batch;
  next: BatchStatus;
}

const toFlatBatch = (item: BatchListItem, size: SizeKey): Batch => ({
  apiId: item.id,
  id: item.batchId,
  size,
  finish: item.sizeFinish?.finish?.name ?? "—",
  series: item.design?.series?.name ?? "—",
  designCode: item.design?.name ?? "—",
  boxes: item.numberOfBoxes,
  status: item.status,
  createdAt: item.createdAt,
});

function RouteComponent() {
  const { size: sizeId } = Route.useParams();
  const sizesQuery = useInventorySizesQuery();
  const sizeRecord = sizesQuery.data?.data.find((s) => s.id === sizeId) ?? null;

  return (
    <QueryStateHandler
      query={sizesQuery}
      loadingSkeleton={<BatchPageSkeleton />}
      emptyTitle="Tile size not found"
      isEmpty={!sizesQuery.isLoading && sizeRecord === null}
    >
      {sizeRecord && <BatchManagementView sizeRecord={sizeRecord} />}
    </QueryStateHandler>
  );
}

interface BatchManagementViewProps {
  sizeRecord: InventorySize;
}

function BatchManagementView({ sizeRecord }: BatchManagementViewProps) {
  const typedSize = sizeRecord.name as SizeKey;

  const permissions = usePermissionStore((s) => s.permissions);
  const { canWrite } = getFeaturePermissions(
    PermissionFeaturesEnum.inventory,
    permissions,
  );

  const designsQuery = useDesignsBySizeQuery(sizeRecord.id);
  const designs = useMemo(
    () => designsQuery.data?.data ?? [],
    [designsQuery.data],
  );

  const batchesQuery = useBatchesBySizeQuery(sizeRecord.id);
  const startProductionMutation = useStartBatchProductionMutation();
  const completeProductionMutation = useCompleteBatchProductionMutation();
  const sizeBatches = useMemo<Batch[]>(
    () =>
      (batchesQuery.data?.data ?? []).map((item) =>
        toFlatBatch(item, typedSize),
      ),
    [batchesQuery.data, typedSize],
  );

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [finishFilter, setFinishFilter] = useState("");
  const [seriesFilter, setSeriesFilter] = useState("");
  const [designFilter, setDesignFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const finishOptions = useMemo(
    () => toSelectOptions(buildFinishOptions(designs, sizeRecord.id), "All finishes"),
    [designs, sizeRecord.id],
  );

  const seriesOptions = useMemo(
    () =>
      toSelectOptions(
        buildSeriesOptions(designs, sizeRecord.id, finishFilter),
        "All series",
      ),
    [designs, sizeRecord.id, finishFilter],
  );

  const designOptions = useMemo(
    () =>
      toSelectOptions(
        buildDesignOptions(designs, sizeRecord.id, finishFilter, seriesFilter),
        "All designs",
      ),
    [designs, sizeRecord.id, finishFilter, seriesFilter],
  );

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [batchToEdit, setBatchToEdit] = useState<Batch | null>(null);
  const [pendingTransition, setPendingTransition] =
    useState<PendingTransition | null>(null);

  const filteredBatches = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    return sizeBatches.filter((b) => {
      if (term && !b.id.toLowerCase().includes(term)) return false;
      if (finishFilter && b.finish !== finishFilter) return false;
      if (seriesFilter && b.series !== seriesFilter) return false;
      if (designFilter && b.designCode !== designFilter) return false;
      if (statusFilter && b.status !== statusFilter) return false;
      return true;
    });
  }, [
    sizeBatches,
    debouncedSearch,
    finishFilter,
    seriesFilter,
    designFilter,
    statusFilter,
  ]);

  const totalBoxes = sizeBatches.reduce((sum, b) => sum + b.boxes, 0);

  const isTransitionPending =
    startProductionMutation.isPending || completeProductionMutation.isPending;

  const handleConfirmTransition = () => {
    if (!pendingTransition) return;
    const { batch, next } = pendingTransition;

    const onTransitionSuccess = () => {
      toast.success(`Batch ${batch.id} moved to ${STATUS_LABEL[next]}`);
      setPendingTransition(null);
    };

    if (next === "in_production") {
      startProductionMutation.mutate(batch.apiId, {
        onSuccess: onTransitionSuccess,
      });
      return;
    }

    if (next === "production_completed") {
      completeProductionMutation.mutate(batch.apiId, {
        onSuccess: onTransitionSuccess,
      });
      return;
    }

    setPendingTransition(null);
  };

  const hasActiveFilters =
    debouncedSearch.trim() !== "" ||
    finishFilter !== "" ||
    seriesFilter !== "" ||
    designFilter !== "" ||
    statusFilter !== "";

  const filteredEmptyState = hasActiveFilters ? (
    <div className="card fall flex-col gap-3 py-14">
      <div className="bg-nl-100 dark:bg-nd-700 text-nl-500 dark:text-nd-300 flex size-14 items-center justify-center rounded-2xl">
        <PackageOpen size={26} />
      </div>
      <div className="text-center">
        <h6 className="text-nl-700 dark:text-nd-100 font-semibold">
          No batches match your filters
        </h6>
        <p className="text-nl-500 dark:text-nd-400 mt-1 text-sm">
          Try adjusting your search or filter criteria
        </p>
      </div>
    </div>
  ) : undefined;

  return (
    <div className="page-enter space-y-6 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h4 className="text-nl-800 dark:text-nd-100 font-bold">
            {formatSize(typedSize)} Batch Management
          </h4>
          <p className="text-nl-500 dark:text-nd-300 mt-1 text-sm">
            Manage batches for {formatSize(typedSize)} tiles
          </p>
        </div>

        <div className="flex items-center gap-3">
          <SummaryChip label="Batches" value={sizeBatches.length} />
          <SummaryChip label="Boxes" value={totalBoxes} />
          {canWrite && (
            <Button startIcon="Plus" onClick={() => setIsAddOpen(true)}>
              Add Batch
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="sm:flex-1">
          <SearchInput
            val={search}
            setVal={setSearch}
            placeholder="Search by batch number"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <SingleSelect
            options={finishOptions}
            value={
              finishOptions.find((o) => o.value === finishFilter) ?? null
            }
            onChange={(v) => {
              const val = (v as SelectOption<string> | null)?.value ?? "";
              setFinishFilter(val);
              setSeriesFilter("");
              setDesignFilter("");
            }}
            placeholder="Finish"
            isSearchable={false}
            width={160}
          />
          <SingleSelect
            options={seriesOptions}
            value={
              seriesOptions.find((o) => o.value === seriesFilter) ?? null
            }
            onChange={(v) => {
              setSeriesFilter(
                (v as SelectOption<string> | null)?.value ?? "",
              );
              setDesignFilter("");
            }}
            placeholder="Series"
            isSearchable={false}
            width={160}
          />
          <SingleSelect
            options={designOptions}
            value={
              designOptions.find((o) => o.value === designFilter) ?? null
            }
            onChange={(v) =>
              setDesignFilter(
                (v as SelectOption<string> | null)?.value ?? "",
              )
            }
            placeholder="Design"
            isSearchable={false}
            width={160}
          />
          <SingleSelect
            options={statusOptions}
            value={
              statusOptions.find((o) => o.value === statusFilter) ?? null
            }
            onChange={(v) =>
              setStatusFilter(
                (v as SelectOption<string> | null)?.value ?? "",
              )
            }
            placeholder="Status"
            isSearchable={false}
            width={190}
          />
        </div>
      </div>

      <QueryStateHandler
        query={batchesQuery}
        loadingSkeleton={<BatchesTableSkeleton />}
        emptyTitle="No batches yet"
        isEmpty={sizeBatches.length === 0}
      >
        <BatchesTable
          batches={filteredBatches}
          onRequestStatusChange={(batch, next) =>
            setPendingTransition({ batch, next })
          }
          onEdit={(batch) => setBatchToEdit(batch)}
          emptyState={filteredEmptyState}
          canWrite={canWrite}
        />
      </QueryStateHandler>

      <AddBatchDialog
        isOpen={isAddOpen}
        close={() => setIsAddOpen(false)}
        size={typedSize}
        sizeId={sizeRecord.id}
        designs={designs}
      />

      <EditBatchDialog
        isOpen={batchToEdit !== null}
        close={() => setBatchToEdit(null)}
        batch={batchToEdit}
      />

      <Dialog
        isOpen={pendingTransition !== null}
        close={() => setPendingTransition(null)}
        title="Change Batch Status"
        size="sm"
        actions={{
          primary: {
            label: "Confirm",
            onClick: handleConfirmTransition,
            loading: isTransitionPending,
            disabled: isTransitionPending,
          },
          secondary: {
            label: "Cancel",
            onClick: () => setPendingTransition(null),
            variant: "filled",
            color: "neutral",
            disabled: isTransitionPending,
          },
        }}
      >
        {pendingTransition && (
          <p className="text-nl-600 dark:text-nd-200 text-sm">
            Change batch{" "}
            <span className="text-nl-800 dark:text-nd-50 font-mono font-semibold">
              {pendingTransition.batch.id}
            </span>{" "}
            from{" "}
            <span className="font-semibold">
              {STATUS_LABEL[pendingTransition.batch.status]}
            </span>{" "}
            to{" "}
            <span className="font-semibold">
              {STATUS_LABEL[pendingTransition.next]}
            </span>
            ?
          </p>
        )}
      </Dialog>
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

const BatchPageSkeleton = () => (
  <div className="page-enter space-y-6 pb-8">
    <div className="shimmer h-12 w-72 rounded-xl" />
    <div className="shimmer h-12 w-full rounded-xl" />
    <div className="shimmer h-72 w-full rounded-2xl" />
  </div>
);

const BatchesTableSkeleton = () => (
  <div className="shimmer h-72 w-full rounded-2xl" />
);
