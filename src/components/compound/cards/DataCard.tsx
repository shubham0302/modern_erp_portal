import { IconButton } from "@/components/base/IconButton";
import * as LucideIcons from "lucide-react";

interface DataCardProps {
  title: string;
  icon: keyof typeof LucideIcons;
  subtitle: string;
  value: string | number;
  onOptionClick?: () => void;
}

export default function DataCard({
  title,
  icon,
  subtitle,
  value,
  onOptionClick,
}: DataCardProps) {
  const Icon = LucideIcons[icon] as LucideIcons.LucideIcon;

  const handleOnOptionClick = () => {
    if (onOptionClick) {
      onOptionClick();
    }
  };

  return (
    <div className="card flex items-center justify-between gap-4 rounded-xl p-2">
      <div className={`bg-pl-50 dark:bg-pd-600/50 fall rounded-xl p-3.5`}>
        <Icon className="text-pl-500 dark:text-pd-200" size={20} />
      </div>
      <div className="flex flex-1 flex-col">
        <h6 className="text-nl-700 dark:text-nd-100 font-medium">{title}</h6>
        <p className="text-nl-500 dark:text-nd-300">{subtitle}</p>
      </div>
      <h6 className="text-nl-800 dark:text-nd-50 pr-2 font-semibold">
        {value}
      </h6>
      {onOptionClick && (
        <IconButton onClick={handleOnOptionClick} icon={LucideIcons.Ellipsis} />
      )}
    </div>
  );
}
