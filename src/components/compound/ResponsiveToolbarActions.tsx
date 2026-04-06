import { IconButton } from "@/components/base/IconButton";
import Sheet, { type SheetAction } from "@/components/compound/Sheet";
import { useToggle } from "@/hooks/useToggle";
import { cn } from "@/utils/helpers";
import { SlidersHorizontal } from "lucide-react";
import type { ReactNode } from "react";

interface ResponsiveToolbarActionsProps {
  children: ReactNode;
  sheetTitle?: string;
  sheetActions?: SheetAction[];
  desktopClassName?: string;
  mobileClassName?: string;
}

const ResponsiveToolbarActions: React.FC<ResponsiveToolbarActionsProps> = ({
  children,
  sheetTitle = "Actions",
  sheetActions,
  desktopClassName,
  mobileClassName,
}) => {
  const { isOpen, open, close } = useToggle();

  return (
    <>
      {/* Desktop xl+: render children inline */}
      <div
        className={cn(
          "ml-auto hidden items-center gap-x-3 xl:flex",
          desktopClassName,
        )}
      >
        {children}
      </div>

      {/* Below xl: icon trigger */}
      <div className={cn("ml-auto flex xl:hidden", mobileClassName)}>
        <IconButton icon={SlidersHorizontal} size="sm" onClick={open} />
      </div>

      <Sheet
        isOpen={isOpen}
        close={close}
        title={sheetTitle}
        size="sm"
        actions={sheetActions}
      >
        <div className="flex flex-col gap-4">{children}</div>
      </Sheet>
    </>
  );
};

export default ResponsiveToolbarActions;
