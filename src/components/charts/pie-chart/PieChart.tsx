import { useState } from "react";
import {
  Cell,
  Label,
  Pie,
  PieChart as RechartsPie,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { PieChartProps } from "./types";

/**
 * PieChart - A clean pie/donut chart with customizable colors and hover effects
 * Used for displaying proportional data with interactive highlighting
 **/

// Default color palette cycling through theme tints
const DEFAULT_COLORS = [
  "var(--chart-active)",
  "var(--chart-tint-blue)",
  "var(--chart-tint-violet)",
  "var(--chart-tint-indigo)",
  "var(--chart-tint-green)",
  "var(--chart-tint-amber)",
  "var(--chart-tint-pink)",
  "var(--chart-tint-orange)",
];

export default function PieChart({
  data,
  height = 300,
  showPercentage = true,
  colors = DEFAULT_COLORS,
  renderTooltip,
  center,
  legendColumns = 1,
  legendLayout = "vertical",
  legendSort = "none",
  showLegend = true,
  chartToLegendRatio = 2,
}: PieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Calculate total for percentage
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Sort legend data based on legendSort prop
  const getSortedData = () => {
    if (legendSort === "none") return data;

    const sortedData = [...data];
    switch (legendSort) {
      case "value-desc":
        return sortedData.sort((a, b) => b.value - a.value);
      case "value-asc":
        return sortedData.sort((a, b) => a.value - b.value);
      case "label-asc":
        return sortedData.sort((a, b) => a.label.localeCompare(b.label));
      case "label-desc":
        return sortedData.sort((a, b) => b.label.localeCompare(a.label));
      default:
        return sortedData;
    }
  };

  const sortedData = getSortedData();

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { label, value } = payload[0].payload;
      const percentage = ((value / total) * 100).toFixed(1);

      if (renderTooltip) {
        return (
          <div className="animate-in fade-in-0 zoom-in-95 dark:bg-nd-500 bg-nl-100 text-nl-700 dark:text-nd-100 z-50 rounded-lg px-2.5 py-1 text-sm shadow-xs">
            {renderTooltip(label, value, percentage)}
          </div>
        );
      }

      return (
        <div className="animate-in fade-in-0 zoom-in-95 dark:bg-nd-500 bg-nl-100 text-nl-700 dark:text-nd-100 z-50 rounded-lg px-2.5 py-1.5 text-sm shadow-xs">
          <div className="font-medium">{label}</div>
          <div className="text-nl-600 dark:text-nd-300 text-xs">
            {value} {showPercentage && `(${percentage}%)`}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-colors flex items-center gap-8">
      {/* Pie Chart */}
      <div style={{ flex: showLegend ? chartToLegendRatio : 1 }}>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsPie onMouseLeave={() => setActiveIndex(null)}>
            <Pie
              data={data}
              innerRadius="80%"
              outerRadius="100%"
              cornerRadius="2%"
              paddingAngle={1}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              dataKey="value"
            >
              {center && (
                <>
                  <Label
                    value={center.label}
                    position="center"
                    dy={-10}
                    style={{
                      fontSize: "12px",
                      fill: "var(--chart-text)",
                      fontWeight: 500,
                    }}
                  />
                  <Label
                    value={center.value}
                    position="center"
                    dy={10}
                    style={{
                      fontSize: "18px",
                      fill: "var(--chart-text-2)",
                      fontWeight: 600,
                    }}
                  />
                </>
              )}
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || colors[index % colors.length]}
                  stroke="0"
                  opacity={
                    activeIndex === null || activeIndex === index ? 1 : 0.3
                  }
                  style={{
                    transition: "opacity 0.2s ease-in-out",
                    cursor: "pointer",
                  }}
                />
              ))}
            </Pie>

            <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
          </RechartsPie>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      {showLegend && (
        <div
          className="grid gap-x-12 gap-y-2"
          style={{
            flex: 1,
            gridTemplateColumns: `repeat(${legendColumns}, minmax(0, 1fr))`,
          }}
        >
          {sortedData.map((entry) => {
            // Find the original index for color consistency and hover interaction
            const originalIndex = data.findIndex((d) => d === entry);
            const color = entry.color || colors[originalIndex % colors.length];
            const percentage = ((entry.value / total) * 100).toFixed(1);
            const isActive =
              activeIndex === null || activeIndex === originalIndex;

            return legendLayout === "horizontal" ? (
              // Horizontal layout: color+label on left, value on right
              <div
                key={`legend-${originalIndex}`}
                className="flex cursor-pointer items-center justify-between gap-4 transition-opacity duration-200"
                style={{ opacity: isActive ? 1 : 0.3 }}
                onMouseEnter={() => setActiveIndex(originalIndex)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="size-4 flex-shrink-0 rounded-md"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-nl-800 dark:text-nd-100 text-sm font-medium">
                    {entry.label}
                  </span>
                </div>
                <span className="text-nl-600 dark:text-nd-300 text-sm font-medium">
                  {entry.value} {showPercentage && `(${percentage}%)`}
                </span>
              </div>
            ) : (
              // Vertical layout: stacked (original)
              <div
                key={`legend-${originalIndex}`}
                className="flex cursor-pointer items-center gap-2 transition-opacity duration-200"
                style={{ opacity: isActive ? 1 : 0.3 }}
                onMouseEnter={() => setActiveIndex(originalIndex)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div
                  className="h-3 w-3 flex-shrink-0 rounded-sm"
                  style={{ backgroundColor: color }}
                />
                <div className="flex flex-col">
                  <span className="text-nl-800 dark:text-nd-100 text-sm font-medium">
                    {entry.label}
                  </span>
                  <span className="text-nl-600 dark:text-nd-300 text-xs">
                    {entry.value} {showPercentage && `(${percentage}%)`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Re-export types for convenience
export type {
  PieChartProps,
  PieDatum,
  PieCenterContent,
  LegendLayout,
  LegendSort,
} from "./types";
