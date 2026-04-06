interface ProgressBarProps {
  progress: number;
  total: number;
  height?: number;
  className?: string;
  barClassName?: string;
  bgClassName?: string;
}

/**
 * ProgressBar - A simple SVG-based progress indicator
 * Used for displaying completion or loading progress
 */
export default function ProgressBar({
  progress,
  total,
  height = 20,
  className = "",
  barClassName = "fill-nl-800 dark:fill-nd-100",
  bgClassName = "fill-nl-200 dark:fill-nd-700",
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress / total, 0), 1);

  return (
    <div className={`w-full ${className}`}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemax={total}
      >
        <rect
          x="0"
          y="0"
          width="100"
          height={height}
          rx={height / 2}
          ry={height / 2}
          className={bgClassName}
        />
        <rect
          x="0"
          y="0"
          width={100 * clampedProgress}
          height={height}
          rx={height / 2}
          ry={height / 2}
          className={barClassName}
        />
      </svg>
    </div>
  );
}
