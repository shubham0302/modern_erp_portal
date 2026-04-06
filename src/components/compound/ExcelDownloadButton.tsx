import { useToggle } from "@/hooks/useToggle";
import { Button, type ButtonProps } from "../base/Button";
import Tooltip from "./Tooltip";
import Dialog from "./Dialog";
import { CheckCircle } from "lucide-react";
import Spinner from "./spinner/Spinner";
import type { UseMutationResult } from "@tanstack/react-query";
import { ListItem } from "./ListItem";

interface ExcelDownloadButtonProps {
  mutation: Pick<
    UseMutationResult<any, any, any, any>,
    "mutate" | "isPending" | "isSuccess" | "reset"
  >;
  params?: Record<string, any>;
  tooltip?: string;
  label?: string;
  hideIcon?: boolean;
  hideLabel?: boolean;
  buttonProps?: Omit<ButtonProps, "onClick" | "isLoading">;
  /** When true, skips filter display and always passes params directly to the mutation */
  skipFilters?: boolean;
}

const ExcelDownloadButton: React.FC<ExcelDownloadButtonProps> = ({
  mutation,
  params,
  tooltip = "Download Excel",
  label = "Excel",
  hideIcon = false,
  hideLabel = false,
  buttonProps,
  skipFilters = false,
}) => {
  const dialog = useToggle();

  const activeParams = params
    ? Object.entries(params).filter(
        ([, v]) => v !== undefined && v !== null && v !== "",
      )
    : [];
  const hasAnyFilters = !skipFilters && activeParams.length > 0;

  const handleCancel = () => {
    mutation.reset();
    dialog.close();
  };

  return (
    <>
      <Tooltip content={tooltip}>
        <Button
          onClick={dialog.open}
          color="neutral"
          endIcon={hideIcon ? undefined : "Download"}
          {...buttonProps}
        >
          {!hideLabel && label}
        </Button>
      </Tooltip>

      <Dialog
        title="Download Excel"
        isOpen={dialog.isOpen}
        close={handleCancel}
        size="sm"
        actions={
          mutation.isPending || mutation.isSuccess
            ? {
                secondary: {
                  label: mutation.isSuccess ? "Close" : "Cancel",
                  onClick: handleCancel,
                },
              }
            : hasAnyFilters
              ? {
                  tertiary: { label: "Cancel", onClick: handleCancel },
                  secondary: {
                    label: "Download without filters",
                    onClick: () => mutation.mutate({}),
                  },
                  primary: {
                    label: "Download with filters",
                    onClick: () => mutation.mutate(params),
                  },
                }
              : {
                  secondary: { label: "Cancel", onClick: handleCancel },
                  primary: {
                    label: "Download",
                    onClick: () => mutation.mutate(params),
                  },
                }
        }
      >
        {mutation.isSuccess ? (
          <div className="fall flex-col gap-3 py-4">
            <CheckCircle size={40} className="text-sl-500 dark:text-sd-500" />
            <h6 className="text-nl-600 dark:text-nd-200">
              Excel downloaded successfully!
            </h6>
          </div>
        ) : mutation.isPending ? (
          <div className="fall flex-col gap-3 py-4">
            <Spinner size={36} />
            <h6 className="text-nl-600 dark:text-nd-200">
              Preparing your Excel file...
            </h6>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <h6 className="text-nl-600 dark:text-nd-200">
              {hasAnyFilters
                ? "Download with all the below filters?"
                : "Are you sure you want to download all the data in Excel format?"}
            </h6>
            {hasAnyFilters && (
              <div className="card mt-2 flex flex-col gap-1 p-3">
                {activeParams.map(([key, value]) => (
                  <ListItem key={key} label={key} value={String(value)} />
                ))}
              </div>
            )}
          </div>
        )}
      </Dialog>
    </>
  );
};

export default ExcelDownloadButton;
