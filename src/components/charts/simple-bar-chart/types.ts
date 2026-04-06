import type { ChartDatum, ChartStyleConfig } from "../types";

/**
 * Data structure specific to SimpleBarChart
 * Extends base ChartDatum with active state for highlighting
 */
export interface BarDatum extends ChartDatum {
  active?: boolean; // highlight bar
}

/**
 * Props for SimpleBarChart component
 */
export interface SimpleBarChartProps extends ChartStyleConfig {
  data: BarDatum[];
  barRadius?: number;
  renderTooltip?: (label: string | number, value: number, datum: BarDatum) => React.ReactNode;
  xAxisTickFormatter?: (value: string, index: number) => string;
}
