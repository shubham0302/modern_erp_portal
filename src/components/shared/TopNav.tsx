import type { NavItemTypes } from "@/types/nav.types";
import { useToggle } from "@/hooks/useToggle";
import { Bell } from "lucide-react";
import { Popover } from "../compound/Popover";
import LogoutDialog from "./LogoutDialog";
import MobileNavDrawer from "./MobileNavDrawer";
import NavTabs from "./NavTabs";
import ProfilePopover from "./ProfilePopover";
import ProfileTrigger from "./ProfileTrigger";

interface TopNavProps {
  navItems: NavItemTypes[];
}

const TopNav: React.FC<TopNavProps> = ({ navItems }) => {
  const { isOpen, close, open } = useToggle();

  return (
    <nav className="bg-nl-50 dark:bg-nd-900 flex w-full shrink-0 items-center justify-between px-4 py-3 sm:px-6 md:px-10 lg:px-8">
      {/* Left: Logo */}
      <div className="flex items-center gap-2.5">
        <div className="from-pl-500 to-pl-400 dark:from-pd-500 dark:to-pd-400 flex size-8 items-center justify-center rounded-[10px] bg-gradient-to-br shadow-sm">
          <span className="text-sm font-extrabold text-white">M</span>
        </div>
        <span className="text-nl-800 dark:text-nd-50 hidden text-[15px] font-bold sm:block">
          Modern ERP
        </span>
      </div>

      {/* Right: Nav Tabs + Actions + Profile */}
      <div className="flex items-center gap-3">
        <NavTabs navItems={navItems} />

        <button className="bg-white dark:bg-nd-800 hover:bg-nl-100 dark:hover:bg-nd-700 hidden size-9 cursor-pointer items-center justify-center rounded-full shadow-xs transition-colors dark:shadow-sm lg:flex">
          <Bell className="text-nl-500 dark:text-nd-300 size-[18px]" />
        </button>

        <Popover trigger={<ProfileTrigger />} align="end" sideOffset={10}>
          <ProfilePopover onLogoutClick={open} />
        </Popover>

        <MobileNavDrawer navItems={navItems} />
      </div>

      <LogoutDialog isOpen={isOpen} close={close} />
    </nav>
  );
};

export default TopNav;
