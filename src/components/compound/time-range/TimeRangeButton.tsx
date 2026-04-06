import { Button, type ButtonProps } from "@/components/base/Button";
import { useToggle } from "@/hooks/useToggle";
import { prettyDateRange } from "@/utils/formatDateTime";
import { useRouter, useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
import Dialog from "../Dialog";
import type { TimeRange } from "./timeRange.types";
import { TimeRangeSelector } from "./TimeRangeSelector";

type TimeRangeButtonProps = Pick<ButtonProps, "variant" | "color" | "size"> & {
  classname?: string;
  buttonPlaceholder?: string;
};

export const TimeRangeButton: React.FC<TimeRangeButtonProps> = (props) => {
  const { buttonPlaceholder = "", ...restProps } = props;
  const search = useSearch({ strict: false }) as Record<string, any>;
  const { startDate, endDate } = search;

  const range = useMemo(() => {
    if (startDate && endDate) {
      return {
        startDate: Number(startDate),
        endDate: Number(endDate),
      };
    }
    return null;
  }, [startDate, endDate]);

  const { close, isOpen, open } = useToggle();

  const router = useRouter();

  const formattedLabel = useMemo(() => {
    if (!range) return buttonPlaceholder || "Time Range";
    return prettyDateRange(range.startDate, range.endDate, {
      showDate: true,
      showTime: false,
    });
  }, [range, buttonPlaceholder]);

  const handleChange = (r: TimeRange) => {
    router.navigate({
      search: {
        ...router.state.location.search,
        startDate: r.startDate.toString() || undefined,
        endDate: r.endDate.toString() || undefined,
        currentPage: 1,
      } as any,
      replace: true,
    });
    close();
  };

  return (
    <>
      <Button
        variant="filled"
        color="neutral"
        startIcon="Clock5"
        onClick={open}
        {...restProps}
      >
        {formattedLabel}
      </Button>
      <Dialog
        isOpen={isOpen}
        close={close}
        title={`Select Time Range ${buttonPlaceholder && `for ${buttonPlaceholder}`}`}
      >
        <TimeRangeSelector value={range ?? undefined} onChange={handleChange} />
      </Dialog>
    </>
  );
};
