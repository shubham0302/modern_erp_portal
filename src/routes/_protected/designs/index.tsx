import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import { SingleSelect, type SelectOption } from "@/components/base/Select";
import Dialog from "@/components/compound/Dialog";
import QueryStateHandler from "@/components/compound/QueryStateHandler";
import SearchInput from "@/components/compound/SearchInput";
import { toast } from "@/components/compound/Sonner";
import {
  useCreateDesignMutation,
  useDesignsQuery,
} from "@/features/designs/designsQueries";
import type {
  Design,
  DesignStatus,
} from "@/features/designs/types/designs.types";
import { useInventorySeriesQuery } from "@/features/inventory/inventoryQueries";
import type { InventorySizeFinish } from "@/features/inventory/types/inventory.types";
import { usePermissionStore } from "@/store/usePermissions";
import { PermissionFeaturesEnum } from "@/types/permissions.types";
import { prettyDate } from "@/utils/formatDateTime";
import { cn } from "@/utils/helpers";
import { getFeaturePermissions } from "@/utils/rbac";
import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/_protected/designs/")({
  component: RouteComponent,
  staticData: {
    pageTitle: "Designs",
    hideBackButton: true,
  },
});

interface DesignFormState {
  name: string;
  seriesId: string;
  selectedSizeFinishIds: string[];
  thumbnailUrl: string;
}

const emptyForm: DesignFormState = {
  name: "",
  seriesId: "",
  selectedSizeFinishIds: [],
  thumbnailUrl: "",
};

const statusStyles: Record<DesignStatus, string> = {
  pending:
    "bg-t-amber/10 text-t-amber border-t-amber/30 dark:bg-t-amber/15 dark:border-t-amber/40",
  approved:
    "bg-sl-500/10 text-sl-600 border-sl-500/30 dark:bg-sd-500/15 dark:text-sd-400 dark:border-sd-500/40",
  rejected:
    "bg-dl-500/10 text-dl-600 border-dl-500/30 dark:bg-dd-500/15 dark:text-dd-400 dark:border-dd-500/40",
};

const formatStatus = (status: DesignStatus): string =>
  status.charAt(0).toUpperCase() + status.slice(1);

function RouteComponent() {
  const permissions = usePermissionStore((s) => s.permissions);
  const { canWrite } = getFeaturePermissions(
    PermissionFeaturesEnum.designs,
    permissions,
  );

  const designsQuery = useDesignsQuery();
  const designs = designsQuery.data?.data ?? [];

  const seriesQuery = useInventorySeriesQuery();
  const seriesList = seriesQuery.data?.data ?? [];

  const createDesignMutation = useCreateDesignMutation();

  const [search, setSearch] = useState("");
  const [seriesFilter, setSeriesFilter] = useState("");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<DesignFormState>(emptyForm);
  const [error, setError] = useState("");

  const seriesMap = useMemo(
    () => Object.fromEntries(seriesList.map((s) => [s.id, s])),
    [seriesList],
  );

  const selectedIds = useMemo(
    () => new Set(form.selectedSizeFinishIds),
    [form.selectedSizeFinishIds],
  );

  const selectedSeriesSizeFinishes = useMemo<InventorySizeFinish[]>(() => {
    if (!form.seriesId) return [];
    return seriesMap[form.seriesId]?.sizeFinishes ?? [];
  }, [form.seriesId, seriesMap]);

  const sizeFinishesByFinish = useMemo(() => {
    const grouped = new Map<string, InventorySizeFinish[]>();
    for (const sf of selectedSeriesSizeFinishes) {
      const list = grouped.get(sf.finish.id) ?? [];
      list.push(sf);
      grouped.set(sf.finish.id, list);
    }
    return grouped;
  }, [selectedSeriesSizeFinishes]);

  const filtered = useMemo(() => {
    return designs.filter((d) => {
      if (seriesFilter && d.series?.id !== seriesFilter) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        d.name.toLowerCase().includes(q) ||
        (d.series?.name ?? "").toLowerCase().includes(q)
      );
    });
  }, [designs, search, seriesFilter]);

  const seriesFilterOptions: SelectOption<string>[] = useMemo(
    () => [
      { label: "All Series", value: "" },
      ...seriesList.map((s) => ({ label: s.name, value: s.id })),
    ],
    [seriesList],
  );

  const seriesFormOptions: SelectOption<string>[] = useMemo(
    () => seriesList.map((s) => ({ label: s.name, value: s.id })),
    [seriesList],
  );

  const openAdd = () => {
    if (seriesList.length === 0) {
      toast.error("No series available — load or create one first");
      return;
    }
    setAdding(true);
    setForm(emptyForm);
    setError("");
  };

  const closeDialog = () => {
    setAdding(false);
    setForm(emptyForm);
    setError("");
  };

  const toggleSizeFinish = (id: string) => {
    setForm((prev) => ({
      ...prev,
      selectedSizeFinishIds: prev.selectedSizeFinishIds.includes(id)
        ? prev.selectedSizeFinishIds.filter((x) => x !== id)
        : [...prev.selectedSizeFinishIds, id],
    }));
  };

  const handleSeriesChange = (newSeriesId: string) => {
    setForm((prev) => ({
      ...prev,
      seriesId: newSeriesId,
      selectedSizeFinishIds: [],
    }));
  };

  const handleSave = () => {
    const trimmed = form.name.trim();
    if (!trimmed) {
      setError("Design code is required");
      return;
    }
    if (!form.seriesId) {
      setError("Select a parent series");
      return;
    }
    if (form.selectedSizeFinishIds.length === 0) {
      setError("Select at least one finish–size pair");
      return;
    }

    createDesignMutation.mutate(
      {
        name: trimmed,
        seriesId: form.seriesId,
        sizeFinishIds: form.selectedSizeFinishIds,
        thumbnailUrl: form.thumbnailUrl || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Design code added");
          closeDialog();
        },
      },
    );
  };

  const saveDisabled =
    form.name.trim() === "" ||
    !form.seriesId ||
    form.selectedSizeFinishIds.length === 0;

  const hasActiveFilters = search.trim() !== "" || seriesFilter !== "";

  return (
    <div className="page-enter space-y-6 pb-8">
      <div>
        <h4 className="text-nl-800 dark:text-nd-100 font-bold">Designs</h4>
        <p className="text-nl-500 dark:text-nd-300 mt-1 text-sm">
          Manage SKU design codes linked to a series
        </p>
      </div>

      <div className="card p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="sm:flex-1">
            <SearchInput
              val={search}
              setVal={setSearch}
              placeholder="Search design codes…"
            />
          </div>
          <SingleSelect
            options={seriesFilterOptions}
            value={
              seriesFilterOptions.find((o) => o.value === seriesFilter) ?? null
            }
            onChange={(v) =>
              setSeriesFilter((v as SelectOption<string> | null)?.value ?? "")
            }
            placeholder="Series"
            isSearchable={false}
            width={220}
            isLoading={seriesQuery.isLoading}
          />
          {canWrite && (
            <Button startIcon="Plus" onClick={openAdd}>
              Add Design Code
            </Button>
          )}
        </div>

        <QueryStateHandler
          query={designsQuery}
          loadingSkeleton={<DesignsTableSkeleton />}
          emptyTitle="No design codes"
          isEmpty={designs.length === 0}
        >
          {filtered.length === 0 && hasActiveFilters ? (
            <div className="fall flex-col gap-2 py-14">
              <h6 className="text-nl-700 dark:text-nd-100 font-semibold">
                No designs match your filters
              </h6>
              <p className="text-nl-500 dark:text-nd-400 text-sm">
                Try adjusting your search or series filter.
              </p>
            </div>
          ) : (
            <div className="border-nl-200 dark:border-nd-600 overflow-hidden rounded-xl border">
              <table className="w-full text-sm">
                <thead className="bg-nl-50 dark:bg-nd-800 text-nl-500 dark:text-nd-300 text-left text-xs font-semibold uppercase">
                  <tr>
                    <th className="px-4 py-3">Design Code</th>
                    <th className="px-4 py-3">Series</th>
                    <th className="px-4 py-3">Applicable Pairs</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-nl-100 dark:divide-nd-700 divide-y">
                  {filtered.map((d) => (
                    <DesignRow key={d.id} design={d} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </QueryStateHandler>
      </div>

      <Dialog
        isOpen={adding}
        close={closeDialog}
        title="Add Design Code"
        subTitle="Link the SKU code to a series and pick applicable finish–size pairs"
        actions={{
          primary: {
            label: "Add Design Code",
            onClick: handleSave,
            disabled: saveDisabled,
            loading: createDesignMutation.isPending,
          },
          secondary: {
            label: "Cancel",
            onClick: closeDialog,
            variant: "filled",
            color: "neutral",
          },
        }}
      >
        <div className="space-y-4">
          <Input
            label="Design code"
            placeholder="e.g. 4001"
            value={form.name}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, name: e.target.value }));
              if (error) setError("");
            }}
            autoFocus
          />

          <Input
            label="Thumbnail URL (optional)"
            placeholder="https://…"
            value={form.thumbnailUrl}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, thumbnailUrl: e.target.value }))
            }
          />

          <div>
            <label className="text-nl-700 dark:text-nd-200 mb-1.5 block text-xs font-medium">
              Parent series
            </label>
            <SingleSelect
              options={seriesFormOptions}
              value={
                seriesFormOptions.find((o) => o.value === form.seriesId) ??
                null
              }
              onChange={(v) =>
                handleSeriesChange(
                  (v as SelectOption<string> | null)?.value ?? "",
                )
              }
              placeholder="Select a series"
              isSearchable={false}
              isLoading={seriesQuery.isLoading}
            />
          </div>

          {form.seriesId && (
            <div>
              <label className="text-nl-700 dark:text-nd-200 mb-2 block text-xs font-medium">
                Applicable Finish – Size Pairs
              </label>
              {selectedSeriesSizeFinishes.length === 0 ? (
                <p className="text-nl-500 dark:text-nd-400 text-xs">
                  This series has no finish–size combinations configured.
                </p>
              ) : (
                <div className="max-h-48 space-y-3 overflow-y-auto">
                  {Array.from(sizeFinishesByFinish.entries()).map(
                    ([finishId, items]) => (
                      <div key={finishId}>
                        <div className="text-nl-500 dark:text-nd-300 mb-1.5 text-[11px] font-semibold uppercase">
                          {items[0]?.finish.name ?? finishId}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {items.map((sf) => {
                            const selected = selectedIds.has(sf.id);
                            return (
                              <button
                                key={sf.id}
                                type="button"
                                onClick={() => toggleSizeFinish(sf.id)}
                                className={cn(
                                  "inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all",
                                  selected
                                    ? "border-pl-500 bg-pl-500 dark:border-pd-500 dark:bg-pd-500 text-white"
                                    : "border-nl-200 dark:border-nd-500 text-nl-700 dark:text-nd-200 hover:border-pl-400 hover:bg-pl-50 dark:hover:bg-pd-900/30",
                                )}
                              >
                                {selected && (
                                  <Check size={12} strokeWidth={3} />
                                )}
                                {sf.size.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          )}

          {error && (
            <p className="text-dl-500 dark:text-dd-400 text-xs">{error}</p>
          )}
        </div>
      </Dialog>
    </div>
  );
}

interface DesignRowProps {
  design: Design;
}

const DesignRow: React.FC<DesignRowProps> = ({ design }) => {
  const statusClass = statusStyles[design.status] ?? statusStyles.pending;
  return (
    <tr className="hover:bg-nl-50/60 dark:hover:bg-nd-800/60">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="from-nl-100 to-nl-200 dark:from-nd-700 dark:to-nd-600 text-nl-500 dark:text-nd-200 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br text-[11px] font-bold">
            {design.name.slice(0, 2)}
          </div>
          <div className="text-nl-800 dark:text-nd-50 font-semibold">
            {design.name}
          </div>
        </div>
      </td>
      <td className="text-nl-600 dark:text-nd-200 px-4 py-3">
        {design.series?.name ?? "—"}
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {design.sizeFinishes.length === 0 ? (
            <span className="text-nl-400 dark:text-nd-400 text-xs">—</span>
          ) : (
            design.sizeFinishes.map((sf) => (
              <span
                key={sf.id}
                className="bg-nl-100 dark:bg-nd-700 text-nl-600 dark:text-nd-200 rounded-md px-2 py-0.5 text-[11px] font-medium"
              >
                {sf.finish.name} / {sf.size.name}
              </span>
            ))
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
            statusClass,
          )}
        >
          {formatStatus(design.status)}
        </span>
      </td>
      <td className="text-nl-600 dark:text-nd-200 px-4 py-3 text-xs">
        {prettyDate(design.createdAt)}
      </td>
    </tr>
  );
};

const DesignsTableSkeleton = () => (
  <div className="space-y-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="shimmer h-12 w-full rounded-lg" />
    ))}
  </div>
);
