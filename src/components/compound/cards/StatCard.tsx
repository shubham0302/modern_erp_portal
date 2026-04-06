import { cn } from "@/utils/helpers";
import * as LucideIcons from "lucide-react";

export interface StatCardProps {
  title: string | number;
  icon: keyof typeof LucideIcons;
  subTitle?: string;
  titleClassName?: string;
  className?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = (props) => {
  const {
    title,
    icon,
    subTitle,
    titleClassName,
    className = "",
    onClick,
  } = props;
  const Icon = icon ? (LucideIcons[icon] as LucideIcons.LucideIcon) : null;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={cn(
        "bg-nl-50/50 border-nl-200 dark:bg-nd-700 dark:border-nd-500 flex w-full justify-between overflow-hidden rounded-2xl border",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={handleClick}
    >
      <div className="px-4.5 py-3">
        <h5
          className={cn(
            "text-nl-700 dark:text-pd-100 font-semibold",
            titleClassName,
          )}
        >
          {" "}
          {title}{" "}
        </h5>
        {subTitle && (
          <p className="text-nl-400 dark:text-nd-200"> {subTitle} </p>
        )}
      </div>
      {Icon && (
        <div className="fall bg-pl-50 dark:bg-pd-600/50 h-full w-18">
          {<Icon className="text-pl-500 dark:text-pd-200" />}
        </div>
      )}
    </div>
  );
};

export default StatCard;
