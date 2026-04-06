import type { NavItemTypes } from "@/types/nav.types";
import { cn } from "@/utils/helpers";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { useLayoutEffect, useRef } from "react";

interface NavTabsProps {
  navItems: NavItemTypes[];
}

const NavTabs: React.FC<NavTabsProps> = ({ navItems }) => {
  const matchRoute = useMatchRoute();
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  // Find the active path to use as dependency
  const activePath = navItems.find(
    (item) => "path" in item && matchRoute({ to: item.path, fuzzy: true }),
  );
  const activeKey = activePath?.label ?? "";

  useLayoutEffect(() => {
    const container = containerRef.current;
    const indicator = indicatorRef.current;
    if (!container || !indicator) return;

    const activeEl = container.querySelector(
      "[data-active='true']",
    ) as HTMLElement | null;

    if (activeEl) {
      indicator.style.left = `${activeEl.offsetLeft}px`;
      indicator.style.width = `${activeEl.offsetWidth}px`;

      if (!hasInitialized.current) {
        hasInitialized.current = true;
        // Enable transitions after first position is set
        requestAnimationFrame(() => {
          if (indicator) {
            indicator.style.transition = "left 0.3s ease-in-out, width 0.3s ease-in-out";
          }
        });
      }
    }
  }, [activeKey]);

  return (
    <div
      ref={containerRef}
      className="dark:bg-nd-800 no-scrollbar relative hidden items-center gap-0.5 overflow-x-auto rounded-full bg-white p-1 shadow-xs dark:shadow-nd-900/30 dark:shadow-sm lg:flex"
    >
      {/* Sliding pill indicator */}
      <div
        ref={indicatorRef}
        className="bg-nl-800 dark:bg-nd-600 absolute top-1 h-[calc(100%-8px)] rounded-full shadow-sm"
      />

      {navItems.map((item) => {
        if (!("path" in item)) return null;
        const isActive = !!matchRoute({ to: item.path, fuzzy: true });

        return (
          <Link
            key={item.label}
            to={item.path}
            data-active={isActive}
            className={cn(
              "relative z-10 whitespace-nowrap rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors duration-200",
              isActive
                ? "text-white dark:text-pd-400"
                : "text-nl-500 hover:bg-nl-100 dark:text-nd-300 dark:hover:bg-nd-600",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
};

export default NavTabs;
