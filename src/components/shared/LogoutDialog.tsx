import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/useAuthStore";
import {
  getDefaultPermissions,
  usePermissionStore,
} from "@/store/usePermissions";
import { TokenUtil } from "@/utils/tokenUtil";
import { useRouter } from "@tanstack/react-router";
import Dialog from "../compound/Dialog";

interface LogoutProps {
  isOpen: boolean;
  close: () => void;
}

const LogoutDialog: React.FC<LogoutProps> = (props) => {
  const { close, isOpen } = props;

  const clearAuth = useAuthStore((s) => s.clearAuth);
  const router = useRouter();

  const handleLogout = () => {
    TokenUtil.clearTokens();
    clearAuth();

    router.options.context.queryClient.clear();

    const defaultPermissions = getDefaultPermissions();
    usePermissionStore.getState().setPermissions(defaultPermissions);

    router.update({
      context: {
        ...router.options.context,
        isLoggedIn: false,
        permissions: defaultPermissions,
      },
    });

    router.invalidate();

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
