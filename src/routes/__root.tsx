import { ROUTES } from "@/constants/routes";
import type { ERPRouterContext } from "@/router";
import useThemeStore from "@/store/useTheme";
import {
  createRootRouteWithContext,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import "../styles/index.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const Route = createRootRouteWithContext<ERPRouterContext>()({
  component: Root,
  beforeLoad: ({ location }) => {
    if (location.pathname === "" || location.pathname === "/") {
      throw redirect({
        to: ROUTES.DASHBOARD,
      });
    }
  },
  pendingMs: 0,
});

function Root() {
  useThemeStore();

  return (
    <div className="dark:bg-nd-900 h-screen w-screen bg-[#FAFAFA]">
      <Toaster visibleToasts={6} />
      <Outlet />
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  );
}
