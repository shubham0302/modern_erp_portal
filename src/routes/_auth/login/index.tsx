import {
  applyLoginResponse,
  useLoginMutation,
} from "@/features/login/loginQueries";
import { useToggle } from "@/hooks/useToggle";
import { router } from "@/router";
import { usePermissionStore } from "@/store/usePermissions";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

const loginSearchParams = z.object({
  redirectTo: z.string().optional(),
});

const loginFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormFields = z.infer<typeof loginFormSchema>;

export const Route = createFileRoute("/_auth/login/")({
  component: RouteComponent,
  validateSearch: loginSearchParams,
});

function RouteComponent() {
  const { redirectTo } = Route.useSearch();
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();
  const passwordVisible = useToggle();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormFields>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = handleSubmit((values) => {
    loginMutation.mutate(values, {
      onSuccess: (response) => {
        applyLoginResponse(response.data);

        router.update({
          context: {
            ...router.options.context,
            isLoggedIn: true,
            permissions: usePermissionStore.getState().permissions,
          },
        });

        navigate({ to: redirectTo || "/dashboard" });
      },
    });
  });

  return (
    <div className="bg-nl-50 dark:bg-nd-900 flex h-dvh items-center justify-center">
      <div className="card w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h3 className="text-pl-600 dark:text-pd-400 font-bold">
            Modern ERP Portal
          </h3>
          <p className="text-nl-500 dark:text-nd-300 mt-2">
            Sign in to your account
          </p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <div>
            <label className="text-nl-700 dark:text-nd-100 mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              className="border-nl-200 dark:border-nd-500 dark:bg-nd-700 dark:text-nd-100 focus:border-pl-500 dark:focus:border-pd-400 w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors"
              placeholder="Enter your email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-dl-500 dark:text-dd-400 mt-1 text-xs">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-nl-700 dark:text-nd-100 mb-1 block text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                type={passwordVisible.isOpen ? "text" : "password"}
                autoComplete="current-password"
                className="border-nl-200 dark:border-nd-500 dark:bg-nd-700 dark:text-nd-100 focus:border-pl-500 dark:focus:border-pd-400 w-full rounded-lg border py-2.5 pr-11 pl-4 text-sm outline-none transition-colors"
                placeholder="Enter your password"
                {...register("password")}
              />
              <button
                type="button"
                onClick={passwordVisible.toggle}
                aria-label={
                  passwordVisible.isOpen ? "Hide password" : "Show password"
                }
                className="text-nl-500 hover:text-nl-700 dark:text-nd-300 dark:hover:text-nd-100 absolute top-1/2 right-3 flex -translate-y-1/2 cursor-pointer items-center justify-center transition-colors"
              >
                {passwordVisible.isOpen ? (
                  <EyeOff className="size-[18px]" />
                ) : (
                  <Eye className="size-[18px]" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-dl-500 dark:text-dd-400 mt-1 text-xs">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="bg-pl-500 hover:bg-pl-600 dark:bg-pd-500 dark:hover:bg-pd-600 mt-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loginMutation.isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
