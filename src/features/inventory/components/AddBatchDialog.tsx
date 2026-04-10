import { Input } from "@/components/base/Input";
import Dialog from "@/components/compound/Dialog";
import { toast } from "@/components/compound/Sonner";
import { cn } from "@/utils/helpers";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DESIGN_CODES,
  FINISHES,
  formatSize,
  getSeriesForFinish,
} from "../constants/inventoryOptions";
import { useInventoryStore } from "../store/useInventoryStore";
import type { Finish, Series, SizeKey } from "../types/inventory.types";

interface AddBatchDialogProps {
  isOpen: boolean;
  close: () => void;
  size: SizeKey;
}

const AddBatchDialog: React.FC<AddBatchDialogProps> = ({
  isOpen,
  close,
  size,
}) => {
  const addBatch = useInventoryStore((s) => s.addBatch);

  const [finish, setFinish] = useState<Finish | null>(null);
  const [series, setSeries] = useState<Series | null>(null);
  const [designCode, setDesignCode] = useState<string | null>(null);
  const [boxesInput, setBoxesInput] = useState<string>("");
  const [boxesError, setBoxesError] = useState<string>("");

  // Reset state whenever the dialog closes
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setFinish(null);
        setSeries(null);
        setDesignCode(null);
        setBoxesInput("");
        setBoxesError("");
      }, 200);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const handleFinishChange = (value: Finish) => {
    if (value === finish) return;
    setFinish(value);
    setSeries(null);
    setDesignCode(null);
    setBoxesInput("");
    setBoxesError("");
  };

  const handleSeriesChange = (value: Series) => {
    if (value === series) return;
    setSeries(value);
    setDesignCode(null);
    setBoxesInput("");
    setBoxesError("");
  };

  const handleDesignChange = (value: string) => {
    if (value === designCode) return;
    setDesignCode(value);
    setBoxesInput("");
    setBoxesError("");
  };

  const boxesValue = Number(boxesInput);
  const isBoxesValid =
    boxesInput !== "" && Number.isInteger(boxesValue) && boxesValue >= 1;

  const canSubmit =
    finish !== null && series !== null && designCode !== null && isBoxesValid;

  const handleSubmit = () => {
    if (!canSubmit) {
      if (!isBoxesValid) {
        setBoxesError("Enter a whole number (1 or more)");
      }
      return;
    }

    const batch = addBatch({
      size,
      finish: finish!,
      series: series!,
      designCode: designCode!,
      boxes: boxesValue,
    });

    toast.success(`Batch ${batch.id} added`);
    close();
  };

  const seriesOptions = finish ? getSeriesForFinish(finish) : [];

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
          disabled: !canSubmit,
        },
        secondary: {
          label: "Cancel",
          onClick: close,
          variant: "filled",
          color: "neutral",
        },
      }}
    >
      <div className="space-y-5">
        {/* Step 1: Finish */}
        <FieldGroup label="Finish" step={1}>
          <div className="flex flex-wrap gap-2">
            {FINISHES.map((opt) => (
              <PillButton
                key={opt.value}
                label={opt.label}
                selected={finish === opt.value}
                onClick={() => handleFinishChange(opt.value)}
              />
            ))}
          </div>
        </FieldGroup>

        {/* Step 2: Series */}
        {finish && (
          <div className="page-enter">
            <FieldGroup label="Series" step={2}>
              <div className="flex flex-wrap gap-2">
                {seriesOptions.map((opt) => (
                  <PillButton
                    key={opt}
                    label={opt}
                    selected={series === opt}
                    onClick={() => handleSeriesChange(opt)}
                  />
                ))}
              </div>
            </FieldGroup>
          </div>
        )}

        {/* Step 3: Design Code */}
        {series && (
          <div className="page-enter">
            <FieldGroup label="Design Code" step={3}>
              <div className="flex flex-wrap gap-2">
                {DESIGN_CODES.map((opt) => (
                  <PillButton
                    key={opt}
                    label={opt}
                    selected={designCode === opt}
                    onClick={() => handleDesignChange(opt)}
                  />
                ))}
              </div>
            </FieldGroup>
          </div>
        )}

        {/* Step 4: Boxes */}
        {designCode && (
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
                error={boxesError}
                fullWidth
              />
            </FieldGroup>
          </div>
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
