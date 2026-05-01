import { RouterProvider } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { authService } from "./features/login/loginService";
import { router } from "./router";
import { useAuthStore } from "./store/useAuthStore";
import { usePermissionStore } from "./store/usePermissions";
import { TokenUtil } from "./utils/tokenUtil";

const AuthInitializer = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      const accessToken = TokenUtil.getAccessToken();

      if (!accessToken) {
        if (!cancelled) setIsReady(true);
        return;
      }

      try {
        const response = await authService.getProfile();
        if (cancelled) return;

        const staff = response.data;
        useAuthStore.getState().setStaff(staff);
        usePermissionStore
          .getState()
          .setPermissionsFromModuleAccess(staff.moduleAccess);

        router.update({
          context: {
            ...router.options.context,
            isLoggedIn: true,
            permissions: usePermissionStore.getState().permissions,
          },
        });
      } catch {
        // Axios interceptor handles refresh + redirect on terminal failure.
      } finally {
        if (!cancelled) setIsReady(true);
      }
    };

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!isReady) {
    return (
      <div className="bg-nl-50 dark:bg-nd-900 fall h-dvh w-dvw">
        <div className="text-nl-500 dark:text-nd-300 text-sm">Loading...</div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
};

export default AuthInitializer;
