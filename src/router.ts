import type { UserPermissions } from "@/types/permissions.types";
import type { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { queryClient } from "./queryClient";
import { routeTree } from "./routeTree.gen";

export const router = createRouter({
  routeTree,
  context: {
    isLoggedIn: false,
    queryClient,
    permissions: {} as UserPermissions,
  },
  scrollRestoration: true,
});

export type AppRouter = typeof router;

export interface ERPRouterContext {
  isLoggedIn: boolean;
  queryClient: QueryClient;
  permissions: UserPermissions;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
