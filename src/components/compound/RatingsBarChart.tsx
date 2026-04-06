import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/utils/helpers";

interface RatingsBarChartProps {
  ratings: {
    star: number; // Star level (1-5)
    count: number; // Number of ratings at this level
  }[];
  maxValue?: number; // Optional max value for percentage calculation
  showCount?: boolean; // Show count numbers (default: true)
  showPercentage?: boolean; // Show percentage (default: false)
  height?: "sm" | "md" | "lg"; // Bar height variant
  className?: string; // Custom className for container
}

const RatingsBarChart: React.FC<RatingsBarChartProps> = ({
  ratings,
  maxValue,
  showCount = true,
  showPercentage = false,
  height = "md",
  className,
}) => {
  // Calculate max value from ratings if not provided
  const calculatedMaxValue =
    maxValue ?? Math.max(...ratings.map((r) => r.count), 1);

  // Calculate total for percentage
  const totalCount = ratings.reduce((sum, r) => sum + r.count, 0);

  // Height variant map
  const heightClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-3",
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {ratings.map((rating) => {
        const percentage = calculatedMaxValue
          ? (rating.count / calculatedMaxValue) * 100
          : 0;
        const displayPercentage =
          totalCount > 0 ? ((rating.count / totalCount) * 100).toFixed(1) : "0";

        return (
          <div
            key={rating.star}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-4"
          >
            {/* Star label with icon */}
            <div className="text-nl-700 dark:text-nd-200 flex items-center gap-1.5">
              <span className="text-sm font-medium tabular-nums">
                {rating.star}
              </span>
              <Star className="t-yellow size-4" fill="currentColor" />
            </div>

            {/* Progress bar */}
            <div className="bg-nl-200 dark:bg-nd-600 h-2.5 overflow-hidden rounded-full">
              <div
                className={cn(
                  "bg-nl-400 dark:bg-nd-300 rounded-full transition-all duration-300",
                  heightClasses[height],
                )}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>

            {/* Count/Percentage */}
            {(showCount || showPercentage) && (
              <span className="text-nl-600 dark:text-nd-300 min-w-12 text-right text-sm tabular-nums">
                {showPercentage
                  ? `${displayPercentage}%`
                  : rating.count.toLocaleString()}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

RatingsBarChart.displayName = "RatingsBarChart";

export default RatingsBarChart;
