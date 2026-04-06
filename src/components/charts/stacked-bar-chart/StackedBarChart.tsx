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
import type { StackedBarChartProps, StackSegment } from "./types";

/**
 * StackedBarChart - A stacked bar chart for displaying multi-segment data
 * Used for showing breakdown of values across multiple categories per bar
 **/

export default function StackedBarChart({
  data,
  height = 280,
  barRadius = 12,
  renderTooltip,
}: StackedBarChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Transform data for Recharts stacked format
  const transformedData = data.map((item) => {
    const obj: any = { label: item.label };
    item.segments.forEach((segment) => {
      obj[segment.name] = segment.value;
    });
    return obj;
  });

  // Get unique segment names for creating Bar components
  const segmentNames = data[0]?.segments.map((s) => s.name) || [];

  // Get color mapping from original data
  const colorMap: Record<string, string> = {};
  data[0]?.segments.forEach((segment) => {
    colorMap[segment.name] = segment.color;
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const label = payload[0].payload.label;
      const segments: StackSegment[] = data
        .find((d) => d.label === label)
        ?.segments.map((s) => ({
          name: s.name,
          value: payload.find((p: any) => p.dataKey === s.name)?.value || 0,
          color: s.color,
        })) || [];

      if (renderTooltip) {
        return (
          <div className="animate-in fade-in-0 zoom-in-95 dark:bg-nd-500 bg-nl-100 text-nl-700 dark:text-nd-100 z-50 rounded-lg px-3 py-2 text-sm shadow-xs">
            {renderTooltip(label, segments)}
          </div>
        );
      }

      // Default tooltip
      return (
        <div className="animate-in fade-in-0 zoom-in-95 dark:bg-nd-500 bg-nl-100 text-nl-700 dark:text-nd-100 z-50 rounded-lg px-3 py-2 text-sm shadow-xs">
          <div className="font-semibold mb-1.5">{label}</div>
          {segments.map((segment, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <div
                className="size-2.5 rounded-sm"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-nl-600 dark:text-nd-300">{segment.name}:</span>
              <span className="font-medium">{segment.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-colors">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={transformedData}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <YAxis
            tick={{ fill: "var(--chart-text)", fontSize: 14 }}
            axisLine={false}
            tickLine={false}
            domain={[0, "auto"]}
            width={30}
          />
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--chart-text)", fontSize: 14 }}
            axisLine={false}
            tickLine={false}
            height={18}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "transparent" }}
          />
          {segmentNames.map((segmentName, segmentIndex) => (
            <Bar
              key={segmentName}
              dataKey={segmentName}
              stackId="stack"
              radius={
                segmentIndex === segmentNames.length - 1
                  ? [barRadius, barRadius, 0, 0]
                  : [0, 0, 0, 0]
              }
              isAnimationActive={true}
              animationDuration={300}
              animationEasing="ease-in-out"
              onMouseEnter={(_, index) => setActiveIndex(index)}
            >
              {transformedData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colorMap[segmentName]}
                  opacity={
                    activeIndex === null || activeIndex === index ? 1 : 0.3
                  }
                  style={{ transition: "opacity 0.2s ease-in-out" }}
                />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Re-export types for convenience
export type { StackedBarDatum, StackedBarChartProps, StackSegment } from "./types";
