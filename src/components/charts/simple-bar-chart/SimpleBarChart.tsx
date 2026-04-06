import { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartTooltip from "../components/ChartTooltip";
import type { SimpleBarChartProps } from "./types";

/**
 * SimpleBarChart - A clean bar chart with customizable colors and hover effects
 * Used for displaying time-series or categorical data with interactive highlighting
 **/

export default function SimpleBarChart({
  data,
  height = 260,
  barRadius = 12,
  renderTooltip,
  xAxisTickFormatter,
}: SimpleBarChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { value, payload: p } = payload[0];
      if (renderTooltip) {
        return (
          <div className="animate-in fade-in-0 zoom-in-95 dark:bg-nd-500 bg-nl-100 text-nl-700 dark:text-nd-100 z-50 rounded-lg px-2.5 py-1 text-sm shadow-xs">
            {renderTooltip(p.label, value, p)}
          </div>
        );
      }
      return <ChartTooltip active={active} payload={payload} />;
    }
    return null;
  };

  return (
    <div className="chart-colors">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} onMouseLeave={() => setActiveIndex(null)}>
          <YAxis
            tick={{ fill: "var(--chart-text)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            domain={[0, "auto"]}
            width={30}
          />
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--chart-text)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            height={18}
            tickFormatter={xAxisTickFormatter}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "transparent" }}
          />
          <Bar
            dataKey="value"
            radius={[barRadius, barRadius, 0, 0]}
            isAnimationActive={true}
            animationDuration={300}
            animationEasing="ease-in-out"
            onMouseEnter={(_, index) => setActiveIndex(index)}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill="var(--chart-active)"
                opacity={
                  activeIndex === null || activeIndex === index ? 1 : 0.3
                }
                style={{ transition: "opacity 0.2s ease-in-out" }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Re-export types for convenience
export type { BarDatum, SimpleBarChartProps } from "./types";
