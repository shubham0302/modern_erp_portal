import { cn } from "@/utils/helpers";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface ConditionalLinkProps {
  to: ((id: string) => string) | string;
  id?: string | null;
  children: ReactNode;
  className?: string;
  fallbackClassName?: string;
}

export const ConditionalLink = ({
  to,
  id,
  children,
  className = "",
  fallbackClassName = "",
}: ConditionalLinkProps) => {
  // Check if id is valid (not undefined, null, or empty string)
  const isValidId = id !== undefined && id !== null && id !== "";

  if (!isValidId) {
    return <span className={fallbackClassName}>{children}</span>;
  }

  // If `to` is a function, call it with the id, otherwise use it directly
  const href = typeof to === "function" ? to(id) : to;

  return (
    <Link to={href} className={cn(className)}>
      {children}
    </Link>
  );
};
