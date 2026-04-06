// Shared chart types that can be used across multiple chart types

/**
 * Base data structure for chart data points
 */
export interface ChartDatum {
  label: string | number;
  value: number;
}

/**
 * Common chart style configuration
 */
export interface ChartStyleConfig {
  height?: number;
}

/**
 * Common tooltip payload structure from Recharts
 */
export interface ChartTooltipPayload<T = any> {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: T;
  }>;
}
