import { Input } from "@/components/base/Input";
import Dialog from "@/components/compound/Dialog";
import { toast } from "@/components/compound/Sonner";
import { useEffect, useState } from "react";
import { useUpdateBatchMutation } from "../inventoryQueries";
import type { Batch } from "../types/inventory.types";

interface EditBatchDialogProps {
  isOpen: boolean;
  close: () => void;
  batch: Batch | null;
}

const EditBatchDialog: React.FC<EditBatchDialogProps> = ({
  isOpen,
  close,
  batch,
}) => {
  const updateBatchMutation = useUpdateBatchMutation();

  const [boxesInput, setBoxesInput] = useState<string>("");
  const [boxesError, setBoxesError] = useState<string>("");

  useEffect(() => {
    if (isOpen && batch) {
      setBoxesInput(String(batch.boxes));
      setBoxesError("");
    }
  }, [isOpen, batch]);

  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setBoxesInput("");
        setBoxesError("");
      }, 200);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const boxesValue = Number(boxesInput);
  const isBoxesValid =
    boxesInput !== "" && Number.isInteger(boxesValue) && boxesValue >= 1;
  const isUnchanged = batch !== null && boxesValue === batch.boxes;
  const isSubmitting = updateBatchMutation.isPending;
  const canSubmit = isBoxesValid && !isUnchanged && !isSubmitting;

  const handleSubmit = () => {
    if (!batch) return;
    if (!isBoxesValid) {
      setBoxesError("Enter a whole number (1 or more)");
      return;
    }
    if (isUnchanged) return;

    updateBatchMutation.mutate(
      { id: batch.apiId, data: { numberOfBoxes: boxesValue } },
      {
        onSuccess: () => {
          toast.success("Batch updated");
          close();
        },
      },
    );
  };

  return (
    <Dialog
      isOpen={isOpen}
      close={close}
      title="Edit Batch"
      subTitle={batch ? `Batch ${batch.id}` : undefined}
      size="sm"
      disableBackdropClose
      actions={{
        primary: {
          label: "Save Changes",
          onClick: handleSubmit,
          disabled: !canSubmit,
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
      <div className="space-y-4">
        <Input
          label="Expected Boxes"
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
      </div>
    </Dialog>
  );
};

export default EditBatchDialog;
