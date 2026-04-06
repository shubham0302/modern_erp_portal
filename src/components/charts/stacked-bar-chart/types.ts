import type { ChartStyleConfig } from "../types";

/**
 * Segment data for a single stack in the bar
 */
export interface StackSegment {
  name: string;
  value: number;
  color: string;
}

/**
 * Data structure for StackedBarChart
 * Each datum represents one bar with multiple stacked segments
 */
export interface StackedBarDatum {
  label: string | number;
  segments: StackSegment[];
}

/**
 * Props for StackedBarChart component
 */
export interface StackedBarChartProps extends ChartStyleConfig {
  data: StackedBarDatum[];
  barRadius?: number;
  renderTooltip?: (
    label: string | number,
    segments: StackSegment[],
  ) => React.ReactNode;
}
