import type { ChartTooltipPayload } from "../types";

interface ChartTooltipProps extends ChartTooltipPayload {
  labelFormatter?: (payload: any) => string;
  valueFormatter?: (value: number) => string;
}

/**
 * Reusable tooltip component for Recharts
 * Can be customized with formatters for label and value display
 */
export default function ChartTooltip({
  active,
  payload,
  labelFormatter,
  valueFormatter,
}: ChartTooltipProps) {
  if (active && payload && payload.length) {
    const { value, payload: p } = payload[0];
    const displayValue = valueFormatter ? valueFormatter(value) : value;
    const displayLabel = labelFormatter ? labelFormatter(p) : p.label;

    return (
      <div className="animate-in fade-in-0 zoom-in-95 dark:bg-nd-500 bg-nl-100 text-nl-700 dark:text-nd-100 z-50 rounded-lg px-2.5 py-1 text-sm shadow-xs">
        {displayValue} at {displayLabel}
      </div>
    );
  }
  return null;
}
