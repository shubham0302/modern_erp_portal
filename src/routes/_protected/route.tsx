import TopNav from "@/components/shared/TopNav";
import { NAV_ITEMS } from "@/constants/navItems";
import { usePermissionStore } from "@/store/usePermissions";
import { filterNavItemsByPermissions } from "@/utils/navFilter";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createFileRoute("/_protected")({
  component: RouteComponent,
  beforeLoad: async ({ context, location }) => {
    const { isLoggedIn } = context;
    const path = location.pathname;
    if (!isLoggedIn) {
      throw redirect({
        to: "/login",
        search: {
          redirectTo: path,
        },
      });
    }
  },
});

function RouteComponent() {
  const permissions = usePermissionStore((s) => s.permissions);
  const filteredNavItems = useMemo(
    () => filterNavItemsByPermissions(NAV_ITEMS, permissions),
    [permissions],
  );

  return (
    <div className="flex h-dvh w-dvw flex-col">
      <TopNav navItems={filteredNavItems} />
      <div className="protected-layout-container">
        <Outlet />
      </div>
    </div>
  );
}
