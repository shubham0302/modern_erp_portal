import type { NavItemTypes } from "@/types/nav.types";
import { useToggle } from "@/hooks/useToggle";
import { cn } from "@/utils/helpers";
import { Link, useMatchRoute } from "@tanstack/react-router";
import * as LucideIcons from "lucide-react";
const { Menu } = LucideIcons;
import { IconButton } from "../base/IconButton";
import ThemeToggle from "../compound/ThemeToggle";
import Sheet from "../compound/Sheet";

interface MobileNavDrawerProps {
  navItems: NavItemTypes[];
}

const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ navItems }) => {
  const { open, isOpen, close } = useToggle();

  return (
    <div className="lg:hidden">
      <IconButton
        icon={Menu}
        size="sm"
        onClick={open}
        iconClassName="size-[18px] text-nl-500 dark:text-nd-100 stroke-2"
      />
      <Sheet isOpen={isOpen} close={close} title="Menu" size="sm">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <MobileNavLink key={item.label} item={item} onNavigate={close} />
          ))}
          <div className="border-nl-200 dark:border-nd-500 my-2 border-t" />
          <div className="flex items-center justify-between px-3 py-2">
            <p className="text-nl-600 dark:text-nd-200 text-sm font-medium">
              Theme
            </p>
            <ThemeToggle />
          </div>
        </div>
      </Sheet>
    </div>
  );
};

export default MobileNavDrawer;

/* ─── Mobile Nav Link ─── */

const MobileNavLink: React.FC<{
  item: NavItemTypes;
  onNavigate: () => void;
}> = ({ item, onNavigate }) => {
  const matchRoute = useMatchRoute();

  if (!("path" in item)) return null;

  const isActive = matchRoute({ to: item.path, fuzzy: true });

  const NavIcon = item.icon
    ? (LucideIcons[item.icon] as LucideIcons.LucideIcon)
    : null;

  return (
    <Link
      to={item.path}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-pl-50 text-pl-600 dark:bg-pd-500/15 dark:text-pd-400"
          : "text-nl-600 hover:bg-nl-50 dark:text-nd-200 dark:hover:bg-nd-700",
      )}
    >
      {NavIcon && (
        <NavIcon
          className={cn(
            "size-[18px] shrink-0",
            isActive
              ? "text-pl-600 dark:text-pd-400"
              : "text-nl-400 dark:text-nd-400",
          )}
        />
      )}
      {item.label}
    </Link>
  );
};
