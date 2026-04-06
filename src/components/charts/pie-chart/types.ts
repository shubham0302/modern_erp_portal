import type { ChartDatum, ChartStyleConfig } from "../types";

/**
 * Data structure specific to PieChart
 * Extends base ChartDatum with optional color customization
 */
export interface PieDatum extends ChartDatum, Record<string, unknown> {
  label: string;
  value: number;
  color?: string; // Optional custom color for this segment
}

/**
 * Center content configuration for donut charts
 */
export interface PieCenterContent {
  label: string; // Top text (e.g., "Total Riders")
  value: string | number; // Bottom text (e.g., "872")
}

/**
 * Legend layout options
 */
export type LegendLayout = "vertical" | "horizontal";

/**
 * Legend sort options
 */
export type LegendSort = "none" | "value-desc" | "value-asc" | "label-asc" | "label-desc";

/**
 * Props for PieChart component
 */
export interface PieChartProps extends ChartStyleConfig {
  data: PieDatum[];
  innerRadius?: number; // For donut chart effect (0-100, default 0 for full pie)
  showPercentage?: boolean; // Show percentage in tooltip (default true)
  showLabel?: boolean; // Show labels on segments (default false)
  colors?: string[]; // Optional array of colors to cycle through
  renderTooltip?: (
    label: string,
    value: number,
    percentage: string
  ) => React.ReactNode;
  center?: PieCenterContent; // Optional center content for donut charts
  legendColumns?: number; // Number of columns for legend grid (default 1)
  legendLayout?: LegendLayout; // Legend item layout: 'vertical' (stacked) or 'horizontal' (spread) (default 'vertical')
  legendSort?: LegendSort; // Sort legend items: 'none' (original order), 'value-desc', 'value-asc', 'label-asc', 'label-desc' (default 'none')
  showLegend?: boolean; // Show legend (default true)
  chartToLegendRatio?: number; // Flex ratio for chart vs legend (default 2 = 2:1 ratio, chart takes 2/3)
}
