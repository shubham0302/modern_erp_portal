import type { ChartDatum, ChartStyleConfig } from "../types";

export type AreaChartProps = ChartStyleConfig & {
  data: ChartDatum[];
  renderTooltip?: (label: string | number, value: number) => React.ReactNode;
  tickFormatter?: (value: number) => string;
  xAxisTickFormatter?: (value: string, index: number) => string;
};
