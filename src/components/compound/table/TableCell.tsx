import React from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/utils/helpers";

const paddingMap = {
  sm: "px-3 py-2",
  md: "px-6 py-3",
  lg: "px-7 py-4",
};

const tableBodyCellClassName =
  "text-nl-600 dark:text-nd-200 text-sm font-normal whitespace-nowrap";

interface TableCellProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: (e: any) => void;
  isMuted?: boolean;
  link?: string;
  linkClassName?: string;
}

const TableCell: React.FC<TableCellProps> = ({
  children,
  size = "md",
  className = "",
  isMuted = false,
  onClick,
  link,
  linkClassName = "",
}) => {
  const content = link ? (
    <Link to={link} className={cn("block w-full h-full underline", linkClassName)}>
      {children}
    </Link>
  ) : (
    children
  );

  return (
    <td
      className={cn(
        isMuted && "pointer-events-none opacity-50",
        tableBodyCellClassName,
        paddingMap[size],
        className,
        "has-[div[aria-label='image-component']]:py-2",
      )}
      onClick={onClick}
    >
      {content}
    </td>
  );
};

export default TableCell;
