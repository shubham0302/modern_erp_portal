import { TrendingDown, TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive,
  icon,
}) => {
  return (
    <div className="card flex items-center gap-4 p-5">
      <div className="bg-pl-50 dark:bg-pd-900/50 text-pl-600 dark:text-pd-400 flex size-11 shrink-0 items-center justify-center rounded-xl">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-nl-500 dark:text-nd-300 text-xs font-medium">
          {title}
        </p>
        <div className="flex items-center gap-2">
          <h5 className="text-nl-800 dark:text-nd-100 font-bold">{value}</h5>
          <div
            className={`flex items-center gap-0.5 text-xs font-medium ${
              isPositive
                ? "text-sl-500 dark:text-sd-400"
                : "text-dl-500 dark:text-dd-400"
            }`}
          >
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {change}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
