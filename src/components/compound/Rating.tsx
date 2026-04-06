import { Star } from "lucide-react";
import { useState } from "react";

export default function Rating({
  rating,
  value,
  onChange,
  maxStars = 5,
  showValue = true,
  size = "md",
  variant = "default",
  editable = false,
  className = "",
}: RatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Use controlled value if provided, otherwise fall back to rating prop
  const displayRating = value ?? rating ?? 0;
  const effectiveRating = hoverRating ?? displayRating;

  const handleStarClick = (starIndex: number) => {
    if (editable && onChange) {
      onChange(starIndex + 1);
    }
  };

  const handleStarHover = (starIndex: number) => {
    if (editable) {
      setHoverRating(starIndex + 1);
    }
  };

  const handleMouseLeave = () => {
    if (editable) {
      setHoverRating(null);
    }
  };

  // Badge variant - compact display with background
  if (variant === "badge") {
    return (
      <div
        className={`bg-t-yellow/20 dark:bg-t-yellow/10 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 ${className}`}
      >
        <p className="text-t-amber dark:text-t-yellow font-semibold">
          {displayRating.toFixed(1)}
        </p>
        <Star className="fill-t-amber text-t-amber dark:fill-t-yellow dark:text-t-yellow size-3.5" />
      </div>
    );
  }

  // Default variant - stars with optional value
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="flex items-center gap-1"
        onMouseLeave={handleMouseLeave}
      >
        {Array.from({ length: maxStars }).map((_, index) => (
          <Star
            key={index}
            className={`${sizeClasses[size]} transition-all duration-200 ${
              index < effectiveRating
                ? "fill-t-yellow text-t-yellow"
                : "text-nl-300 dark:text-nd-500"
            } ${
              editable
                ? "cursor-pointer hover:scale-110"
                : ""
            }`}
            onMouseEnter={() => handleStarHover(index)}
            onClick={() => handleStarClick(index)}
          />
        ))}
      </div>
      {showValue && (
        <span
          className={`font-bold ${textSizeClasses[size]} text-nl-800 dark:text-nd-100`}
        >
          {displayRating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

interface RatingProps {
  /** Display-only rating value (used when not in controlled mode) */
  rating?: number;
  /** Controlled rating value (takes precedence over rating prop) */
  value?: number;
  /** Callback when rating is changed (required when editable is true) */
  onChange?: (rating: number) => void;
  /** Maximum number of stars to display */
  maxStars?: number;
  /** Show numeric rating value next to stars */
  showValue?: boolean;
  /** Size of the stars */
  size?: "sm" | "md" | "lg";
  /** Visual variant of the component */
  variant?: "default" | "badge";
  /** Enable interactive rating selection */
  editable?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const sizeClasses = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

const textSizeClasses = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-xl",
};
