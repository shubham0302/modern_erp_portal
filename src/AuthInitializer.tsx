import { RouterProvider } from "@tanstack/react-router";
import { createFullPermissions, DEMO_TOKEN, DEMO_USER } from "./constants/demoAuth";
import { router } from "./router";
import { useAuthStore } from "./store/useAuthStore";
import { usePermissionStore } from "./store/usePermissions";
import { TokenUtil } from "./utils/tokenUtil";

// ─── Demo bootstrap (guarded, runs at most once) ───

let demoInitialized = false;

function ensureDemoBootstrap() {
  if (demoInitialized) return;
  demoInitialized = true;

  useAuthStore.getState().setUser(DEMO_USER);
  usePermissionStore.getState().setPermissions(createFullPermissions());
}

const token = TokenUtil.getToken();
if (token === DEMO_TOKEN) {
  ensureDemoBootstrap();
}

router.update({
  context: {
    ...router.options.context,
    isLoggedIn: useAuthStore.getState().isLoggedIn,
    permissions: usePermissionStore.getState().permissions,
  },
});

// ─── Component ───

const AuthInitializer = () => {
  return <RouterProvider router={router} />;
};

export default AuthInitializer;
