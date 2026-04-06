import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/useAuthStore";
import { getDefaultPermissions, usePermissionStore } from "@/store/usePermissions";
import { TokenUtil } from "@/utils/tokenUtil";
import { useRouter } from "@tanstack/react-router";
import Dialog from "../compound/Dialog";

interface LogoutProps {
  isOpen: boolean;
  close: () => void;
}

const LogoutDialog: React.FC<LogoutProps> = (props) => {
  const { close, isOpen } = props;

  const loginFail = useAuthStore((s) => s.loginFail);
  const clearUser = useAuthStore((s) => s.clearUser);
  const router = useRouter();

  const handleLogout = () => {
    // Clear token
    TokenUtil.removeToken();

    // Clear auth state
    clearUser();
    loginFail();

    // Clear React Query cache to remove all stale data
    router.options.context.queryClient.clear();

    // Reset permission store to default (no permissions)
    const defaultPermissions = getDefaultPermissions();
    usePermissionStore.getState().setPermissions(defaultPermissions);

    // Update router context so route guards see the new auth state
    router.update({
      context: {
        ...router.options.context,
        isLoggedIn: false,
        permissions: defaultPermissions,
      },
    });

    // Invalidate router to force fresh state evaluation
    router.invalidate();

    // Navigate to login
    router.navigate({ to: ROUTES.LOGIN });
  };

  return (
    <Dialog
      isOpen={isOpen}
      close={close}
      title="Logout?"
      actions={{
        primary: {
          label: "Logout",
          onClick: handleLogout,
        },
        secondary: {
          label: "Cancel",
          onClick: close,
          variant: "ghost",
        },
      }}
    >
      <h6 className="text-nl-500 dark:text-nd-200">
        Are you sure you want to logout?
      </h6>
    </Dialog>
  );
};

export default LogoutDialog;
