import { SingleSelect, type SelectOption } from "@/components/base/Select";
import Dialog from "@/components/compound/Dialog";
import SearchInput from "@/components/compound/SearchInput";
import { toast } from "@/components/compound/Sonner";
import InventoryItemsTable, {
  ITEM_STATUS_LABEL,
} from "@/features/inventory/components/InventoryItemsTable";
import {
  DESIGN_CODES,
  FINISHES,
  FINISH_SERIES_MAP,
} from "@/features/inventory/constants/inventoryOptions";
import { useInventoryStore } from "@/features/inventory/store/useInventoryStore";
import type {
  Finish,
  InventoryItem,
  InventoryItemStatus,
  Series,
} from "@/features/inventory/types/inventory.types";
import useDebounce from "@/hooks/useDebounce";
import { createFileRoute } from "@tanstack/react-router";
import { PackageOpen } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/_protected/inventory-items/")({
  component: RouteComponent,
  staticData: {
    pageTitle: "Inventory",
    hideBackButton: true,
  },
});

const ALL_SERIES: Series[] = [
  ...FINISH_SERIES_MAP.glossy,
  ...FINISH_SERIES_MAP.matt,
];

const finishOptions: SelectOption<string>[] = [
  { label: "All finishes", value: "" },
  ...FINISHES.map((f) => ({ label: f.label, value: f.value })),
];

const buildSeriesOptions = (
  finish: Finish | "",
): SelectOption<string>[] => {
  const list = finish ? FINISH_SERIES_MAP[finish] : ALL_SERIES;
  return [
    { label: "All series", value: "" },
    ...list.map((s) => ({ label: s, value: s })),
  ];
};

const designOptions: SelectOption<string>[] = [
  { label: "All designs", value: "" },
  ...DESIGN_CODES.map((d) => ({ label: d, value: d })),
];

const statusOptions: SelectOption<string>[] = [
  { label: "All statuses", value: "" },
  { label: ITEM_STATUS_LABEL.unverified, value: "unverified" },
  { label: ITEM_STATUS_LABEL.verified, value: "verified" },
  { label: ITEM_STATUS_LABEL.on_the_way, value: "on_the_way" },
  { label: ITEM_STATUS_LABEL.in_depot, value: "in_depot" },
  { label: ITEM_STATUS_LABEL.sold, value: "sold" },
];

interface PendingItemTransition {
  item: InventoryItem;
  next: InventoryItemStatus;
}

function RouteComponent() {
  const items = useInventoryStore((s) => s.items);
  const batches = useInventoryStore((s) => s.batches);
  const updateItemStatus = useInventoryStore((s) => s.updateItemStatus);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [batchFilter, setBatchFilter] = useState("");
  const [finishFilter, setFinishFilter] = useState<Finish | "">("");
  const [seriesFilter, setSeriesFilter] = useState("");
  const [designFilter, setDesignFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [pendingTransition, setPendingTransition] =
    useState<PendingItemTransition | null>(null);

  const batchOptions = useMemo<SelectOption<string>[]>(
    () => [
      { label: "All batches", value: "" },
      ...batches.map((b) => ({ label: b.id, value: b.id })),
    ],
    [batches],
  );

  const seriesOptions = useMemo(
    () => buildSeriesOptions(finishFilter),
    [finishFilter],
  );

  const filteredItems = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    return items.filter((it) => {
      if (term && !it.id.toLowerCase().includes(term)) return false;
      if (batchFilter && it.batchId !== batchFilter) return false;
      if (finishFilter && it.finish !== finishFilter) return false;
      if (seriesFilter && it.series !== seriesFilter) return false;
      if (designFilter && it.designCode !== designFilter) return false;
      if (statusFilter && it.status !== statusFilter) return false;
      return true;
    });
  }, [
    items,
    debouncedSearch,
    batchFilter,
    finishFilter,
    seriesFilter,
    designFilter,
    statusFilter,
  ]);

  const handleConfirmTransition = () => {
    if (!pendingTransition) return;
    const { item, next } = pendingTransition;
    updateItemStatus(item.id, next);
    toast.success(`Item ${item.id} marked as ${ITEM_STATUS_LABEL[next]}`);
    setPendingTransition(null);
  };

  const hasActiveFilters =
    debouncedSearch.trim() !== "" ||
    batchFilter !== "" ||
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
          No items match your filters
        </h6>
        <p className="text-nl-500 dark:text-nd-400 mt-1 text-sm">
          Try adjusting your search or filter criteria
        </p>
      </div>
    </div>
  ) : undefined;

  return (
    <div className="page-enter space-y-6 pb-8">
      <div>
        <h4 className="text-nl-800 dark:text-nd-100 font-bold">Inventory</h4>
        <p className="text-nl-500 dark:text-nd-300 mt-1 text-sm">
          Track inventory items through their lifecycle
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="sm:flex-1">
          <SearchInput
            val={search}
            setVal={setSearch}
            placeholder="Search by id"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <SingleSelect
            options={batchOptions}
            value={
              batchOptions.find((o) => o.value === batchFilter) ?? null
            }
            onChange={(v) =>
              setBatchFilter(
                (v as SelectOption<string> | null)?.value ?? "",
              )
            }
            placeholder="Batch"
            isSearchable
            width={200}
          />
          <SingleSelect
            options={finishOptions}
            value={
              finishOptions.find((o) => o.value === finishFilter) ?? null
            }
            onChange={(v) => {
              const val = (v as SelectOption<string> | null)?.value ?? "";
              setFinishFilter(val as Finish | "");
              setSeriesFilter("");
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
            onChange={(v) =>
              setSeriesFilter(
                (v as SelectOption<string> | null)?.value ?? "",
              )
            }
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
            width={170}
          />
        </div>
      </div>

      <InventoryItemsTable
        items={filteredItems}
        onRequestStatusChange={(item, next) =>
          setPendingTransition({ item, next })
        }
        emptyState={filteredEmptyState}
      />

      <Dialog
        isOpen={pendingTransition !== null}
        close={() => setPendingTransition(null)}
        title="Change Item Status"
        size="sm"
        actions={{
          primary: {
            label: "Confirm",
            onClick: handleConfirmTransition,
          },
          secondary: {
            label: "Cancel",
            onClick: () => setPendingTransition(null),
            variant: "filled",
            color: "neutral",
          },
        }}
      >
        {pendingTransition && (
          <p className="text-nl-600 dark:text-nd-200 text-sm">
            Change item{" "}
            <span className="text-nl-800 dark:text-nd-50 font-mono font-semibold">
              {pendingTransition.item.id}
            </span>{" "}
            from{" "}
            <span className="font-semibold">
              {ITEM_STATUS_LABEL[pendingTransition.item.status]}
            </span>{" "}
            to{" "}
            <span className="font-semibold">
              {ITEM_STATUS_LABEL[pendingTransition.next]}
            </span>
            ?
          </p>
        )}
      </Dialog>
    </div>
  );
}
