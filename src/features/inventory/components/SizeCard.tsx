import { cn } from "@/utils/helpers";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Layers, Package } from "lucide-react";

interface SizeCardProps {
  size: string;
  batchCount: number;
  totalBoxes: number;
}

const SizeCard: React.FC<SizeCardProps> = ({
  size,
  batchCount,
  totalBoxes,
}) => {
  return (
    <Link
      to="/inventory/$size"
      params={{ size }}
      className={cn(
        "group card relative flex flex-col gap-4 p-6 transition-all",
        "hover:-translate-y-0.5 hover:shadow-md",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="bg-pl-50 dark:bg-pd-900/50 text-pl-600 dark:text-pd-400 flex size-11 shrink-0 items-center justify-center rounded-xl">
          <Layers size={20} />
        </div>
        <ArrowUpRight
          size={18}
          className="text-nl-400 dark:text-nd-400 group-hover:text-pl-600 dark:group-hover:text-pd-300 transition-colors"
        />
      </div>

      <div>
        <p className="text-nl-500 dark:text-nd-400 text-xs font-medium tracking-wider uppercase">
          Tile Size
        </p>
        <h3 className="text-nl-800 dark:text-nd-50 mt-1 text-3xl font-bold">
          {size}
        </h3>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Package size={14} className="text-nl-500 dark:text-nd-300" />
          <span className="text-nl-600 dark:text-nd-200 text-sm font-medium">
            {batchCount}
          </span>
          <span className="text-nl-500 dark:text-nd-400 text-xs">
            {batchCount === 1 ? "batch" : "batches"}
          </span>
        </div>
        <div className="bg-nl-300 dark:bg-nd-500 h-3 w-px" />
        <div className="flex items-center gap-1.5">
          <span className="text-nl-600 dark:text-nd-200 text-sm font-medium">
            {totalBoxes}
          </span>
          <span className="text-nl-500 dark:text-nd-400 text-xs">
            {totalBoxes === 1 ? "box" : "boxes"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default SizeCard;
