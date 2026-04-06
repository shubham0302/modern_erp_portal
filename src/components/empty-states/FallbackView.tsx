import { cn } from "@/utils/helpers";
import * as LucideIcons from "lucide-react";
import type { ReactNode } from "react";

export interface FallbackViewProps {
  title: string;
  icon?: keyof typeof LucideIcons;
  footer?: ReactNode;
  classname?: string;
  version?: "default" | "compact";
}

const FallbackView: React.FC<FallbackViewProps> = (props) => {
  const { title, footer, icon, classname, version = "default" } = props;

  const Icon = icon ? (LucideIcons[icon] as LucideIcons.LucideIcon) : null;

  const isCompact = version === "compact";

  return (
    <div
      className={cn(
        "bg-nl-50 dark:bg-nd-700 flex w-full rounded-xl",
        isCompact
          ? "flex-row items-center gap-3 p-3"
          : "fall flex-col gap-4 p-8",
        classname,
      )}
    >
      {Icon && (
        <Icon size={isCompact ? 20 : 48} strokeWidth={1.5} />
      )}
      <p
        className={cn(
          "text-nl-600 dark:text-nd-200",
          !isCompact && "text-center",
        )}
      >
        {title || "No data found"}
      </p>
      {footer && footer}
    </div>
  );
};

export default FallbackView;
