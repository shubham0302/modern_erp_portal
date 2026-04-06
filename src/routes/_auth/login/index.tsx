import { createFullPermissions, DEMO_TOKEN, DEMO_USER } from "@/constants/demoAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { usePermissionStore } from "@/store/usePermissions";
import { TokenUtil } from "@/utils/tokenUtil";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import z from "zod";

const loginSearchParams = z.object({
  redirectTo: z.string().optional(),
});

export const Route = createFileRoute("/_auth/login/")({
  component: RouteComponent,
  validateSearch: loginSearchParams,
});

function RouteComponent() {
  const { redirectTo } = Route.useSearch();
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const setPermissions = usePermissionStore((s) => s.setPermissions);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPermissions(createFullPermissions());
    TokenUtil.setToken(DEMO_TOKEN);
    setUser(DEMO_USER);
    navigate({ to: redirectTo || "/dashboard" });
  };

  return (
    <div className="flex h-dvh items-center justify-center bg-nl-50 dark:bg-nd-900">
      <div className="card w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h3 className="text-pl-600 dark:text-pd-400 font-bold">
            Modern ERP Portal
          </h3>
          <p className="text-nl-500 dark:text-nd-300 mt-2">
            Sign in to your account
          </p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div>
            <label className="text-nl-700 dark:text-nd-100 mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              className="border-nl-200 dark:border-nd-500 dark:bg-nd-700 dark:text-nd-100 w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-pl-500 dark:focus:border-pd-400"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="text-nl-700 dark:text-nd-100 mb-1 block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              className="border-nl-200 dark:border-nd-500 dark:bg-nd-700 dark:text-nd-100 w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-pl-500 dark:focus:border-pd-400"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="bg-pl-500 hover:bg-pl-600 dark:bg-pd-500 dark:hover:bg-pd-600 mt-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
