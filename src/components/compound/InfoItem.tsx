import { cn, formatCurrencyINR } from "@/utils/helpers";
import type { ReactNode } from "react";
import * as LucideIcons from "lucide-react";
import { Link } from "@tanstack/react-router";

interface InfoItemProps {
  label: string;
  value: ReactNode;
  classname?: string;
  trailingLabel?: ReactNode;
  isCurrency?: boolean;
  direction?: "vertical" | "horizontal";
  labelClassName?: string;
  valueClassName?: string;
  icon?: keyof typeof LucideIcons;
  link?: string;
  linkClassName?: string;
}

const InfoItem: React.FC<InfoItemProps> = (props) => {
  const {
    label,
    value,
    classname,
    trailingLabel,
    isCurrency = false,
    direction = "vertical",
    icon,
    labelClassName,
    valueClassName,
    link,
    linkClassName = "",
  } = props;

  const Icon = icon ? (LucideIcons[icon] as LucideIcons.LucideIcon) : null;

  const renderValue = () => {
    const content =
      typeof value === "string" || typeof value === "number" ? (
        <p
          className={cn(
            "text-nl-700 dark:text-nd-100 font-medium",
            link && "underline",
            valueClassName,
          )}
        >
          {isCurrency ? formatCurrencyINR(Number(value)) : value}{" "}
        </p>
      ) : (
        value
      );

    if (link) {
      return (
        <Link to={link} className={cn("block underline", linkClassName)}>
          {content}
        </Link>
      );
    }

    return content;
  };

  return (
    <div
      className={cn(
        "flex gap-3",
        direction === "vertical"
          ? "flex-row items-start"
          : "flex-row items-center",
        classname,
      )}
    >
      {Icon && (
        <Icon
          className="text-nl-500 dark:text-nd-400 mt-0.5 size-5"
          strokeWidth={1.5}
        />
      )}
      <div className="flex flex-1 flex-col gap-y-1.5">
        {label && (
          <div className="flex items-center">
            <p
              className={cn(
                "text-nl-500 dark:text-nd-300 mr-auto",
                labelClassName,
              )}
            >
              {" "}
              {label}{" "}
            </p>
            {trailingLabel && trailingLabel}
          </div>
        )}
        {renderValue()}
      </div>
    </div>
  );
};

export default InfoItem;
