import { useCurrentUser } from "@/hooks/useCurrentUser";
import { forwardRef } from "react";

const ProfileTrigger = forwardRef<HTMLButtonElement>((props, ref) => {
  const { user, displayRole } = useCurrentUser();

  return (
    <button
      ref={ref}
      {...props}
      className="bg-white dark:bg-nd-800 flex cursor-pointer items-center gap-2 rounded-full py-1 pl-1 pr-3 shadow-xs transition-colors hover:bg-nl-50 dark:shadow-sm dark:hover:bg-nd-700"
    >
      <img
        src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${user?.name || "User"}`}
        alt="avatar"
        className="size-8 rounded-full bg-nl-200 dark:bg-nd-600"
      />
      <span className="text-nl-700 dark:text-nd-100 hidden text-xs font-semibold lg:block">
        {displayRole}
      </span>
      <svg
        className="text-nl-400 dark:text-nd-400 hidden size-3 lg:block"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M3 4.5L6 7.5L9 4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
});
ProfileTrigger.displayName = "ProfileTrigger";

export default ProfileTrigger;
