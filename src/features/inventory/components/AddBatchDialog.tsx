import { Input } from "@/components/base/Input";
import Dialog from "@/components/compound/Dialog";
import { toast } from "@/components/compound/Sonner";
import { cn } from "@/utils/helpers";
import { Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { formatSize } from "../constants/inventoryOptions";
import { useCreateBatchMutation } from "../inventoryQueries";
import type { InventoryDesign, SizeKey } from "../types/inventory.types";

interface AddBatchDialogProps {
  isOpen: boolean;
  close: () => void;
  size: SizeKey;
  sizeId: string;
  designs: InventoryDesign[];
}

interface NamedRecord {
  id: string;
  name: string;
}

const AddBatchDialog: React.FC<AddBatchDialogProps> = ({
  isOpen,
  close,
  size,
  sizeId,
  designs,
}) => {
  const createBatchMutation = useCreateBatchMutation();

  const [finishId, setFinishId] = useState<string | null>(null);
  const [seriesId, setSeriesId] = useState<string | null>(null);
  const [designId, setDesignId] = useState<string | null>(null);
  const [boxesInput, setBoxesInput] = useState<string>("");
  const [boxesError, setBoxesError] = useState<string>("");

  // Reset state whenever the dialog closes
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setFinishId(null);
        setSeriesId(null);
        setDesignId(null);
        setBoxesInput("");
        setBoxesError("");
      }, 200);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const finishOptions = useMemo<NamedRecord[]>(() => {
    const map = new Map<string, NamedRecord>();
    for (const d of designs) {
      for (const sf of d.sizeFinishes) {
        if (sf.size.id === sizeId && !map.has(sf.finish.id)) {
          map.set(sf.finish.id, { id: sf.finish.id, name: sf.finish.name });
        }
      }
    }
    return [...map.values()];
  }, [designs, sizeId]);

  const seriesOptions = useMemo<NamedRecord[]>(() => {
    if (!finishId) return [];
    const map = new Map<string, NamedRecord>();
    for (const d of designs) {
      const matches = d.sizeFinishes.some(
        (sf) => sf.size.id === sizeId && sf.finish.id === finishId,
      );
      if (matches && !map.has(d.series.id)) {
        map.set(d.series.id, { id: d.series.id, name: d.series.name });
      }
    }
    return [...map.values()];
  }, [designs, finishId, sizeId]);

  const designOptions = useMemo<NamedRecord[]>(() => {
    if (!finishId || !seriesId) return [];
    return designs
      .filter(
        (d) =>
          d.series.id === seriesId &&
          d.sizeFinishes.some(
            (sf) => sf.size.id === sizeId && sf.finish.id === finishId,
          ),
      )
      .map((d) => ({ id: d.id, name: d.name }));
  }, [designs, finishId, seriesId, sizeId]);

  const handleFinishChange = (value: string) => {
    if (value === finishId) return;
    setFinishId(value);
    setSeriesId(null);
    setDesignId(null);
    setBoxesInput("");
    setBoxesError("");
  };

  const handleSeriesChange = (value: string) => {
    if (value === seriesId) return;
    setSeriesId(value);
    setDesignId(null);
    setBoxesInput("");
    setBoxesError("");
  };

  const handleDesignChange = (value: string) => {
    if (value === designId) return;
    setDesignId(value);
    setBoxesInput("");
    setBoxesError("");
  };

  const boxesValue = Number(boxesInput);
  const isBoxesValid =
    boxesInput !== "" && Number.isInteger(boxesValue) && boxesValue >= 1;

  const canSubmit =
    finishId !== null &&
    seriesId !== null &&
    designId !== null &&
    isBoxesValid;

  const handleSubmit = () => {
    if (!canSubmit) {
      if (!isBoxesValid) {
        setBoxesError("Enter a whole number (1 or more)");
      }
      return;
    }

    const design = designs.find((d) => d.id === designId);
    if (!design) return;

    const sizeFinish = design.sizeFinishes.find(
      (sf) => sf.size.id === sizeId && sf.finish.id === finishId,
    );
    if (!sizeFinish) {
      toast.error("Selected size and finish are not available for this design");
      return;
    }

    createBatchMutation.mutate(
      {
        designId: design.id,
        sizeFinishId: sizeFinish.id,
        sizeId,
        numberOfBoxes: boxesValue,
      },
      {
        onSuccess: () => {
          toast.success("Batch added");
          close();
        },
      },
    );
  };

  const isEmpty = finishOptions.length === 0;
  const isSubmitting = createBatchMutation.isPending;

  return (
    <Dialog
      isOpen={isOpen}
      close={close}
      title="Add New Batch"
      subTitle={`For size ${formatSize(size)}`}
      size="md"
      disableBackdropClose
      actions={{
        primary: {
          label: "Add Batch",
          onClick: handleSubmit,
          disabled: !canSubmit || isSubmitting,
          loading: isSubmitting,
        },
        secondary: {
          label: "Cancel",
          onClick: close,
          variant: "filled",
          color: "neutral",
          disabled: isSubmitting,
        },
      }}
    >
      <div className="space-y-5">
        {isEmpty && (
          <div className="text-nl-500 dark:text-nd-300 py-8 text-center text-sm">
            No approved designs are available for this size yet.
          </div>
        )}

        {!isEmpty && (
          <>
            {/* Step 1: Finish */}
            <FieldGroup label="Finish" step={1}>
              <div className="flex flex-wrap gap-2">
                {finishOptions.map((opt) => (
                  <PillButton
                    key={opt.id}
                    label={opt.name}
                    selected={finishId === opt.id}
                    onClick={() => handleFinishChange(opt.id)}
                  />
                ))}
              </div>
            </FieldGroup>

            {/* Step 2: Series */}
            {finishId && (
              <div className="page-enter">
                <FieldGroup label="Series" step={2}>
                  <div className="flex flex-wrap gap-2">
                    {seriesOptions.map((opt) => (
                      <PillButton
                        key={opt.id}
                        label={opt.name}
                        selected={seriesId === opt.id}
                        onClick={() => handleSeriesChange(opt.id)}
                      />
                    ))}
                  </div>
                </FieldGroup>
              </div>
            )}

            {/* Step 3: Design */}
            {seriesId && (
              <div className="page-enter">
                <FieldGroup label="Design Code" step={3}>
                  <div className="flex flex-wrap gap-2">
                    {designOptions.map((opt) => (
                      <PillButton
                        key={opt.id}
                        label={opt.name}
                        selected={designId === opt.id}
                        onClick={() => handleDesignChange(opt.id)}
                      />
                    ))}
                  </div>
                </FieldGroup>
              </div>
            )}

            {/* Step 4: Boxes */}
            {designId && (
              <div className="page-enter">
                <FieldGroup label="Expected Boxes" step={4}>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    step={1}
                    placeholder="e.g. 25"
                    value={boxesInput}
                    onChange={(e) => {
                      setBoxesInput(e.target.value);
                      if (boxesError) setBoxesError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && boxesInput.trim() !== "") {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                    error={boxesError}
                    fullWidth
                  />
                </FieldGroup>
              </div>
            )}
          </>
        )}
      </div>
    </Dialog>
  );
};

export default AddBatchDialog;

// ─── Internal helpers ───

interface FieldGroupProps {
  label: string;
  step: number;
  children: React.ReactNode;
}

const FieldGroup: React.FC<FieldGroupProps> = ({ label, step, children }) => (
  <div>
    <div className="mb-2 flex items-center gap-2">
      <span className="bg-pl-50 dark:bg-pd-900/40 text-pl-600 dark:text-pd-300 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold">
        {step}
      </span>
      <label className="text-nl-700 dark:text-nd-100 text-sm font-medium">
        {label}
      </label>
    </div>
    {children}
  </div>
);

interface PillButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const PillButton: React.FC<PillButtonProps> = ({
  label,
  selected,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all",
      selected
        ? "bg-pl-500 dark:bg-pd-500 border-pl-500 dark:border-pd-500 text-white shadow-sm"
        : "border-nl-200 dark:border-nd-500 text-nl-700 dark:text-nd-100 hover:border-pl-400 dark:hover:border-pd-400 hover:bg-nl-50 dark:hover:bg-nd-700 bg-white dark:bg-nd-800",
    )}
  >
    {selected && <Check size={14} strokeWidth={3} />}
    {label}
  </button>
);
