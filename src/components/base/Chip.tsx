import * as LucideIcons from "lucide-react";
import { X } from "lucide-react";
import React, { forwardRef } from "react";
import { cn } from "../../utils/helpers";

export type ChipColor =
  | "gray"
  | "blue"
  | "red"
  | "yellow"
  | "purple"
  | "orange"
  | "green"
  | "teal"
  | "pink"
  | "indigo"
  | "sky";

interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string | number | React.ReactNode;
  color?: ChipColor;
  className?: string;
  labelClassName?: string;
  isCollapsible?: boolean;
  onCollapse?: (e: any) => void;
  startIcon?: keyof typeof LucideIcons;
  endIcon?: keyof typeof LucideIcons;
  startIconClassname?: string;
  endIconClassname?: string;
}

const colorMap: Record<ChipColor, { bg: string; text: string }> = {
  gray: {
    bg: "bg-gray-100 dark:bg-neutral-800",
    text: "text-gray-500 dark:text-nd-100/90",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950",
    text: "text-blue-800 dark:text-blue-300",
  },
  red: {
    bg: "bg-red-100/80 dark:bg-red-950/80",
    text: "text-red-800 dark:text-red-300",
  },
  yellow: {
    bg: "bg-yellow-100 dark:bg-yellow-950",
    text: "text-yellow-700 dark:text-yellow-300",
  },
  purple: {
    bg: "bg-purple-100 dark:bg-purple-950",
    text: "text-purple-800 dark:text-purple-300",
  },
  orange: {
    bg: "bg-orange-100 dark:bg-orange-950",
    text: "text-orange-600 dark:text-orange-300",
  },
  green: {
    bg: "bg-green-100/80 dark:bg-green-950/80",
    text: "text-green-800 dark:text-green-500",
  },
  teal: {
    bg: "bg-teal-50 dark:bg-teal-950",
    text: "text-teal-700 dark:text-teal-300",
  },
  pink: {
    bg: "bg-pink-100/80 dark:bg-pink-950/80",
    text: "text-pink-600 dark:text-pink-300",
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-950",
    text: "text-indigo-600 dark:text-indigo-200",
  },
  sky: {
    bg: "bg-sky-50 dark:bg-sky-950",
    text: "text-sky-600 dark:text-sky-200",
  },
};

const Chip = forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      label,
      color = "gray",
      className = "",
      isCollapsible = false,
      onCollapse,
      startIcon,
      endIcon,
      startIconClassname = "",
      endIconClassname = "",
      labelClassName = "",
      ...props
    },
    ref,
  ) => {
    const { bg, text } = colorMap[color];

    const StartIcon = startIcon
      ? (LucideIcons[startIcon] as LucideIcons.LucideIcon)
      : null;
    const EndIcon = endIcon
      ? (LucideIcons[endIcon] as LucideIcons.LucideIcon)
      : null;

    if (!label) return <></>;

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-fit items-center justify-center gap-1 rounded-lg px-1.5 py-1",
          bg,
          className,
        )}
        {...props}
      >
        {StartIcon && (
          <StartIcon
            size={14}
            className={cn(text, startIconClassname)}
            strokeWidth={2}
          />
        )}
        <span className={cn("text-xs font-semibold", text, labelClassName)}>
          {label}
        </span>
        {EndIcon && (
          <EndIcon
            size={14}
            className={cn(text, endIconClassname)}
            strokeWidth={2}
          />
        )}
        {isCollapsible && (
          <X
            size={16}
            onClick={onCollapse}
            className={cn("cursor-pointer", text)}
            strokeWidth={1.2}
          />
        )}
      </div>
    );
  },
);

Chip.displayName = "Chip";

export default Chip;
