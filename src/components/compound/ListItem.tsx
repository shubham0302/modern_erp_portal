import type { ReactNode } from "react";
import * as LucideIcons from "lucide-react";
import { cn, formatCurrencyINR } from "@/utils/helpers";
import { Link } from "@tanstack/react-router";

interface ListItemProps {
  label: string;
  value: ReactNode;
  startIcon?: keyof typeof LucideIcons;
  iconClassName?: string;
  classname?: string;
  labelClassname?: string;
  valueClassname?: string;
  isCurrency?: boolean;
  link?: string;
  linkClassName?: string;
}

export const ListItem: React.FC<ListItemProps> = (props) => {
  const {
    label,
    value,
    startIcon,
    classname,
    iconClassName,
    labelClassname,
    valueClassname,
    isCurrency,
    link,
    linkClassName = "",
  } = props;
  const StartIcon = startIcon
    ? (LucideIcons[startIcon] as LucideIcons.LucideIcon)
    : null;

  const renderValue = () => {
    const content =
      typeof value === "string" || typeof value === "number" ? (
        <p
          className={cn(
            "text-nl-700 dark:text-nd-100 font-medium",
            link && "underline",
            valueClassname,
          )}
        >
          {" "}
          {isCurrency ? formatCurrencyINR(Number(value)) : value}{" "}
        </p>
      ) : (
        value
      );

    if (link) {
      return (
        <Link to={link} className={cn("underline", linkClassName)}>
          {content}
        </Link>
      );
    }

    return content;
  };

  return (
    <div className={cn("flex items-center gap-x-2", classname)}>
      {StartIcon && (
        <StartIcon className={cn(iconClassName)} strokeWidth={1.6} size={16} />
      )}
      <p className={cn("text-nl-500 dark:text-nd-300", labelClassname)}>
        {" "}
        {label}:{" "}
      </p>
      {renderValue()}
    </div>
  );
};
