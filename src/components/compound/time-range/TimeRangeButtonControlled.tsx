import { Button, type ButtonProps } from "@/components/base/Button";
import { useToggle } from "@/hooks/useToggle";
import { prettyDateRange } from "@/utils/formatDateTime";
import { useMemo } from "react";
import Dialog from "../Dialog";
import type { TimeRange } from "./timeRange.types";
import { TimeRangeSelector } from "./TimeRangeSelector";

type TimeRangeButtonControlledProps = {
  value?: TimeRange | null;
  onChange: (range: TimeRange) => void;
  buttonPlaceholder?: string;
} & Pick<ButtonProps, "variant" | "color" | "size">;

export const TimeRangeButtonControlled: React.FC<
  TimeRangeButtonControlledProps
> = ({ value, onChange, buttonPlaceholder, ...buttonProps }) => {
  const { close, isOpen, open } = useToggle();

  const formattedLabel = useMemo(() => {
    if (!value) return buttonPlaceholder || "Time Range";
    return prettyDateRange(value.startDate, value.endDate, {
      showDate: true,
      showTime: false,
    });
  }, [value, buttonPlaceholder]);

  const handleChange = (range: TimeRange) => {
    onChange(range);
    close();
  };

  return (
    <>
      <Button
        variant="filled"
        color="neutral"
        startIcon="Clock5"
        onClick={open}
        {...buttonProps}
      >
        {formattedLabel}
      </Button>
      <Dialog
        isOpen={isOpen}
        close={close}
        title={`Select Time Range${buttonPlaceholder ? ` for ${buttonPlaceholder}` : ""}`}
      >
        <TimeRangeSelector value={value ?? undefined} onChange={handleChange} />
      </Dialog>
    </>
  );
};
