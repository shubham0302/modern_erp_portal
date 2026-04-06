import type { LucideIcon } from "lucide-react";
import { Hammer } from "lucide-react";

interface ComingSoonProps {
  title: string;
  icon: LucideIcon;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title, icon: Icon }) => {
  return (
    <div className="page-enter fall h-full min-h-[60vh] flex-col gap-6">
      {/* Icon stack */}
      <div className="relative">
        <div className="bg-pl-50 dark:bg-pd-900/20 size-24 rounded-full" />
        <div className="fall absolute inset-0">
          <Icon className="text-pl-500 dark:text-pd-400 size-10 drop-shadow-sm" />
        </div>
        <div className="bg-pl-500 dark:bg-pd-500 absolute -right-1 bottom-0 flex size-9 items-center justify-center rounded-full shadow-md">
          <Hammer className="size-4.5 text-white" />
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col items-center gap-3">
        <h4 className="text-nl-800 dark:text-nd-100 font-bold">{title}</h4>
        <div className="bg-pl-50 dark:bg-pd-900/20 rounded-full px-4 py-1.5">
          <span className="text-pl-600 dark:text-pd-400 text-sm font-semibold">
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
