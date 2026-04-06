import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Sun } from "lucide-react";
import Avatar from "../compound/Avatar";
import MenuItem from "../compound/MenuItem";
import ThemeToggle from "../compound/ThemeToggle";

interface ProfilePopoverProps {
  onLogoutClick: () => void;
}

const ProfilePopover: React.FC<ProfilePopoverProps> = ({ onLogoutClick }) => {
  const { user, isLoggedIn } = useCurrentUser();

  if (!user && isLoggedIn) {
    return (
      <div className="flex gap-3 p-2">
        <div className="shimmer size-10 shrink-0 !rounded-full" />
        <div className="flex w-full flex-col gap-y-1">
          <div className="shimmer h-5 w-full" />
          <div className="shimmer h-4 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-48">
      <div className="flex items-center gap-x-3 p-2 pb-0">
        <Avatar
          size="lg"
          fallback={user?.name?.[0] || "U"}
          classname="bg-t-peach"
        />
        <div>
          <h6 className="text-nl-700 dark:text-nd-50 font-semibold">
            {user?.name}
          </h6>
          <p className="text-nl-500 dark:text-nd-200">
            {user?.email || "User"}
          </p>
        </div>
      </div>
      <div className="menu-items mt-4">
        <div className="flex items-center gap-2 px-2 py-1">
          <Sun size={16} className="dark:text-nd-100 text-nl-600" />
          <p className="text-nl-700 dark:text-nd-100 mr-auto">Theme</p>
          <ThemeToggle />
        </div>
        <MenuItem onClick={onLogoutClick} startIcon="LogOut">
          Sign Out
        </MenuItem>
      </div>
    </div>
  );
};

export default ProfilePopover;
