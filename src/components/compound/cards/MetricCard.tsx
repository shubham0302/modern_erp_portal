import { cn } from "@/utils/helpers";
import * as LucideIcons from "lucide-react";

interface MetricCardProps {
  title: string | number;
  icon: keyof typeof LucideIcons;
  subTitle?: string;
  titleClassName?: string;
}

const MetricCard: React.FC<MetricCardProps> = (props) => {
  const { title, icon, subTitle, titleClassName } = props;

  const Icon = icon ? (LucideIcons[icon] as LucideIcons.LucideIcon) : null;

  return (
    <div className="card flex items-center gap-4 rounded-2xl px-4 py-3">
      {Icon && (
        <div className="fall bg-pl-500 dark:bg-pd-500 relative size-13 overflow-hidden rounded-full">
          <div className="bg-pl-50 dark:bg-pd-100 fall absolute bottom-0 size-9 overflow-hidden rounded-md">
            {<Icon className="text-pl-600 dark:text-pd-600 z-10" size={22} />}
            <div className="bg-pl-50 dark:bg-pd-50 absolute top-0 left-0 size-8 -translate-1/2 rounded-full" />
          </div>
        </div>
      )}
      <div>
        <h5
          className={cn(
            "text-nl-800 dark:text-nd-50 leading-tight font-semibold",
            titleClassName,
          )}
        >
          {" "}
          {title}{" "}
        </h5>
        {subTitle && <p className="text-nl-400 dark:text-nd-200">{subTitle}</p>}
      </div>
    </div>
  );
};

export default MetricCard;
