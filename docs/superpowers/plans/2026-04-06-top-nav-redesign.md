# Top Navigation Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the sidebar navigation with a horizontal top navigation bar matching the TastyIgniter reference UI — logo left, pill-style nav tabs center, action icons + profile right — while keeping brand colors and supporting dark mode.

**Architecture:** The sidebar + header two-component layout is replaced by a single `TopNav` component. The protected route layout changes from a horizontal flex (sidebar | content) to a vertical flex (topnav / content). Mobile uses a Sheet drawer for nav links instead of sidebar. The `NavItemTypes` type is relocated to its own file since the sidebar NavItem component is deleted.

**Tech Stack:** React 19, TanStack Router, Tailwind CSS v4, Lucide React, Radix Popover, Zustand

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/types/nav.types.ts` | **Create** | `NavItemTypes` type definition (extracted from deleted NavItem.tsx) |
| `src/components/shared/TopNav.tsx` | **Create** | Top navigation bar — logo, nav tabs, action icons, profile |
| `src/components/shared/MobileNavDrawer.tsx` | **Create** | Mobile hamburger + Sheet with vertical nav links (replaces SidebarDrawer) |
| `src/routes/_protected/route.tsx` | **Modify** | Replace sidebar+header layout with TopNav + content |
| `src/styles/index.css` | **Modify** | Update `.card` to `rounded-2xl` + shadow, update `.protected-layout-container` |
| `src/constants/navItems.ts` | **Modify** | Update import path for `NavItemTypes` |
| `src/utils/navFilter.ts` | **Modify** | Update import path for `NavItemTypes` |
| `src/components/shared/sidebar/Sidebar.tsx` | **Delete** | Replaced by TopNav |
| `src/components/shared/sidebar/NavItem.tsx` | **Delete** | Replaced by inline tab links |
| `src/components/shared/SidebarDrawer.tsx` | **Delete** | Replaced by MobileNavDrawer |
| `src/components/shared/Header.tsx` | **Delete** | Replaced by TopNav |
| `src/components/shared/utils/sidebarUtil.ts` | **Delete** | No longer needed (localStorage sidebar state) |

---

### Task 1: Extract NavItemTypes to shared types file

**Files:**
- Create: `src/types/nav.types.ts`

- [ ] **Step 1: Create the nav types file**

Create `src/types/nav.types.ts` with the `NavItemTypes` type extracted from the old `NavItem.tsx`. This type is used by `navItems.ts`, `navFilter.ts`, and the new components, so it needs a standalone home.

```typescript
import type { PermissionFeaturesEnum } from "@/types/permissions.types";
import type * as LucideIcons from "lucide-react";

export type NavItemTypes = {
  label: string;
  icon?: keyof typeof LucideIcons;
  permission?: PermissionFeaturesEnum | PermissionFeaturesEnum[];
} & (
  | { path: string; children?: NavItemTypes[] }
  | { children?: NavItemTypes[] }
);
```

- [ ] **Step 2: Update navItems.ts import**

In `src/constants/navItems.ts`, change the import from:
```typescript
import type { NavItemTypes } from "../components/shared/sidebar/NavItem";
```
to:
```typescript
import type { NavItemTypes } from "@/types/nav.types";
```

- [ ] **Step 3: Update navFilter.ts import**

In `src/utils/navFilter.ts`, change the import from:
```typescript
import type { NavItemTypes } from "@/components/shared/sidebar/NavItem";
```
to:
```typescript
import type { NavItemTypes } from "@/types/nav.types";
```

- [ ] **Step 4: Verify the build compiles**

Run: `npx tsc --noEmit`
Expected: No type errors related to NavItemTypes

- [ ] **Step 5: Commit**

```bash
git add src/types/nav.types.ts src/constants/navItems.ts src/utils/navFilter.ts
git commit -m "refactor: extract NavItemTypes to shared types file"
```

---

### Task 2: Update card styles and layout container

**Files:**
- Modify: `src/styles/index.css:63-66` (`.card` class)
- Modify: `src/styles/index.css:90-91` (`.protected-layout-container`)

- [ ] **Step 1: Update the `.card` class**

In `src/styles/index.css`, change the `.card` class from:
```css
  .card {
    @apply border-nl-200 dark:bg-nd-700 dark:border-nd-500 rounded-xl border bg-white;
  }
```
to:
```css
  .card {
    @apply border-nl-200 dark:bg-nd-700 dark:border-nd-500 rounded-2xl border bg-white shadow-sm dark:shadow-none;
  }
```

- [ ] **Step 2: Update `.card--soft` class**

Change from:
```css
  .card--soft {
    @apply border-nl-100 dark:bg-nd-800 dark:border-nd-700 rounded-xl border bg-white;
  }
```
to:
```css
  .card--soft {
    @apply border-nl-100 dark:bg-nd-800 dark:border-nd-700 rounded-2xl border bg-white shadow-sm dark:shadow-none;
  }
```

- [ ] **Step 3: Update `.protected-layout-container`**

Change from:
```css
.protected-layout-container {
  @apply grow overflow-auto [&>div]:px-4 [&>div]:py-4 sm:[&>div]:px-6 md:[&>div]:px-10;
}
```
to:
```css
.protected-layout-container {
  @apply bg-nl-50 dark:bg-nd-900 grow overflow-auto [&>div]:px-4 [&>div]:py-5 sm:[&>div]:px-6 md:[&>div]:px-10 lg:[&>div]:px-12;
}
```

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/styles/index.css
git commit -m "style: update card to rounded-2xl with shadow, adjust layout container"
```

---

### Task 3: Create TopNav component

**Files:**
- Create: `src/components/shared/TopNav.tsx`

- [ ] **Step 1: Create the TopNav component**

Create `src/components/shared/TopNav.tsx`:

```tsx
import type { NavItemTypes } from "@/types/nav.types";
import { useAuthStore } from "@/store/useAuthStore";
import { useToggle } from "@/hooks/useToggle";
import { cn } from "@/utils/helpers";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { Bell, Settings } from "lucide-react";
import { IconButton } from "../base/IconButton";
import { Popover } from "../compound/Popover";
import ThemeToggle from "../compound/ThemeToggle";
import LogoutDialog from "./LogoutDialog";
import MobileNavDrawer from "./MobileNavDrawer";
import ProfilePopover from "./ProfilePopover";

interface TopNavProps {
  navItems: NavItemTypes[];
}

const TopNav: React.FC<TopNavProps> = ({ navItems }) => {
  const { isOpen, close, open } = useToggle();

  return (
    <nav className="dark:bg-nd-800 border-b-nl-200 dark:border-b-nd-600 flex w-full items-center justify-between border-b bg-white px-4 py-2.5 sm:px-6 md:px-10 lg:px-8">
      {/* Left: Logo */}
      <div className="flex items-center gap-2.5">
        <div className="from-pl-500 to-pl-400 dark:from-pd-500 dark:to-pd-400 flex size-8 items-center justify-center rounded-[10px] bg-gradient-to-br shadow-sm">
          <span className="text-sm font-extrabold text-white">M</span>
        </div>
        <span className="text-nl-800 dark:text-nd-50 hidden text-[15px] font-bold sm:block">
          Modern ERP
        </span>
      </div>

      {/* Center: Nav Tabs (desktop only) */}
      <div className="bg-nl-50 dark:bg-nd-700 no-scrollbar hidden items-center gap-1 overflow-x-auto rounded-xl p-1 lg:flex">
        {navItems.map((item) => (
          <NavTab key={item.label} item={item} />
        ))}
      </div>

      {/* Right: Actions + Profile */}
      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-1.5 lg:flex">
          <IconButton
            icon={Bell}
            size="sm"
            noDefaultFill
            iconClassName="text-nl-500 dark:text-nd-300 size-[18px]"
            className="hover:bg-nl-100 dark:hover:bg-nd-600 rounded-[10px]"
          />
          <IconButton
            icon={Settings}
            size="sm"
            noDefaultFill
            iconClassName="text-nl-500 dark:text-nd-300 size-[18px]"
            className="hover:bg-nl-100 dark:hover:bg-nd-600 rounded-[10px]"
          />
          <ThemeToggle />
          <div className="bg-nl-200 dark:bg-nd-500 mx-1 h-6 w-px" />
        </div>
        <Popover
          trigger={<ProfileTrigger />}
          align="end"
          sideOffset={10}
        >
          <ProfilePopover onLogoutClick={open} />
        </Popover>
        <MobileNavDrawer navItems={navItems} />
      </div>

      <LogoutDialog isOpen={isOpen} close={close} />
    </nav>
  );
};

export default TopNav;

/* ─── Nav Tab ─── */

const NavTab: React.FC<{ item: NavItemTypes }> = ({ item }) => {
  const matchRoute = useMatchRoute();

  if (!("path" in item)) return null;

  const isActive = matchRoute({ to: item.path, fuzzy: true });

  return (
    <Link
      to={item.path}
      className={cn(
        "whitespace-nowrap rounded-lg px-4 py-1.5 text-[13px] font-medium transition-all",
        isActive
          ? "bg-white text-pl-600 shadow-sm dark:bg-nd-600 dark:text-pd-400"
          : "text-nl-500 hover:bg-nl-100 dark:text-nd-300 dark:hover:bg-nd-600",
      )}
    >
      {item.label}
    </Link>
  );
};

/* ─── Profile Trigger ─── */

import { forwardRef } from "react";

const ProfileTrigger = forwardRef<HTMLButtonElement>((props, ref) => {
  const user = useAuthStore((s) => s?.user);

  return (
    <button
      ref={ref}
      {...props}
      className="flex cursor-pointer items-center gap-2 rounded-xl py-1 pl-1 pr-2 transition-colors hover:bg-nl-50 dark:hover:bg-nd-700"
    >
      <div className="from-pl-500 to-pl-400 dark:from-pd-500 dark:to-pd-400 flex size-8 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white">
        {user?.name?.[0]?.toUpperCase() || "U"}
      </div>
      <span className="text-nl-700 dark:text-nd-100 hidden text-xs font-semibold lg:block">
        {user?.roles?.[0] ? user.roles[0].charAt(0).toUpperCase() + user.roles[0].slice(1) : "User"}
      </span>
      <svg className="text-nl-400 dark:text-nd-400 hidden size-3 lg:block" viewBox="0 0 12 12" fill="none">
        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
});
ProfileTrigger.displayName = "ProfileTrigger";
```

- [ ] **Step 2: Verify no type errors**

Run: `npx tsc --noEmit`
Expected: May fail because `MobileNavDrawer` doesn't exist yet — that's fine, we create it next.

- [ ] **Step 3: Commit**

```bash
git add src/components/shared/TopNav.tsx
git commit -m "feat: create TopNav component with logo, pill tabs, profile"
```

---

### Task 4: Create MobileNavDrawer component

**Files:**
- Create: `src/components/shared/MobileNavDrawer.tsx`

- [ ] **Step 1: Create MobileNavDrawer**

Create `src/components/shared/MobileNavDrawer.tsx`:

```tsx
import type { NavItemTypes } from "@/types/nav.types";
import { useToggle } from "@/hooks/useToggle";
import { cn } from "@/utils/helpers";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { IconButton } from "../base/IconButton";
import ThemeToggle from "../compound/ThemeToggle";
import Sheet from "../compound/Sheet";

interface MobileNavDrawerProps {
  navItems: NavItemTypes[];
}

const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ navItems }) => {
  const { open, isOpen, close } = useToggle();

  return (
    <div className="lg:hidden">
      <IconButton
        icon={Menu}
        size="sm"
        onClick={open}
        iconClassName="size-[18px] text-nl-500 dark:text-nd-100 stroke-2"
      />
      <Sheet isOpen={isOpen} close={close} title="Menu" size="sm">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <MobileNavLink key={item.label} item={item} onNavigate={close} />
          ))}
          <div className="border-nl-200 dark:border-nd-500 my-2 border-t" />
          <div className="flex items-center justify-between px-3 py-2">
            <p className="text-nl-600 dark:text-nd-200 text-sm font-medium">
              Theme
            </p>
            <ThemeToggle />
          </div>
        </div>
      </Sheet>
    </div>
  );
};

export default MobileNavDrawer;

/* ─── Mobile Nav Link ─── */

const MobileNavLink: React.FC<{
  item: NavItemTypes;
  onNavigate: () => void;
}> = ({ item, onNavigate }) => {
  const matchRoute = useMatchRoute();

  if (!("path" in item)) return null;

  const isActive = matchRoute({ to: item.path, fuzzy: true });

  const NavIcon = item.icon
    ? (LucideIcons[item.icon] as LucideIcons.LucideIcon)
    : null;

  return (
    <Link
      to={item.path}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-pl-50 text-pl-600 dark:bg-pd-500/15 dark:text-pd-400"
          : "text-nl-600 hover:bg-nl-50 dark:text-nd-200 dark:hover:bg-nd-700",
      )}
    >
      {NavIcon && (
        <NavIcon
          className={cn(
            "size-[18px] shrink-0",
            isActive
              ? "text-pl-600 dark:text-pd-400"
              : "text-nl-400 dark:text-nd-400",
          )}
        />
      )}
      {item.label}
    </Link>
  );
};
```

- [ ] **Step 2: Verify the build compiles**

Run: `npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add src/components/shared/MobileNavDrawer.tsx
git commit -m "feat: create MobileNavDrawer with Sheet for mobile navigation"
```

---

### Task 5: Update protected route layout

**Files:**
- Modify: `src/routes/_protected/route.tsx`

- [ ] **Step 1: Rewrite the protected route layout**

Replace the entire content of `src/routes/_protected/route.tsx` with:

```tsx
import TopNav from "@/components/shared/TopNav";
import { NAV_ITEMS } from "@/constants/navItems";
import { usePermissionStore } from "@/store/usePermissions";
import { filterNavItemsByPermissions } from "@/utils/navFilter";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createFileRoute("/_protected")({
  component: RouteComponent,
  beforeLoad: async ({ context, location }) => {
    const { isLoggedIn } = context;
    const path = location.pathname;
    if (!isLoggedIn) {
      throw redirect({
        to: "/login",
        search: {
          redirectTo: path,
        },
      });
    }
  },
});

function RouteComponent() {
  const permissions = usePermissionStore((s) => s.permissions);
  const filteredNavItems = useMemo(
    () => filterNavItemsByPermissions(NAV_ITEMS, permissions),
    [permissions],
  );

  return (
    <div className="flex h-dvh w-dvw flex-col">
      <TopNav navItems={filteredNavItems} />
      <div className="protected-layout-container">
        <Outlet />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the build compiles**

Run: `npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Run dev server to verify visually**

Run: `npm run dev`
Expected: The app loads with the new top navigation bar. Logo on left, pill tab(s) in center, profile on right. Content renders below.

- [ ] **Step 4: Commit**

```bash
git add src/routes/_protected/route.tsx
git commit -m "feat: replace sidebar+header layout with TopNav"
```

---

### Task 6: Delete old sidebar files

**Files:**
- Delete: `src/components/shared/sidebar/Sidebar.tsx`
- Delete: `src/components/shared/sidebar/NavItem.tsx`
- Delete: `src/components/shared/SidebarDrawer.tsx`
- Delete: `src/components/shared/Header.tsx`
- Delete: `src/components/shared/utils/sidebarUtil.ts`

- [ ] **Step 1: Remove old files**

```bash
rm src/components/shared/sidebar/Sidebar.tsx
rm src/components/shared/sidebar/NavItem.tsx
rm src/components/shared/SidebarDrawer.tsx
rm src/components/shared/Header.tsx
rm src/components/shared/utils/sidebarUtil.ts
```

- [ ] **Step 2: Remove empty directories**

```bash
rmdir src/components/shared/sidebar
rmdir src/components/shared/utils
```

- [ ] **Step 3: Check for any remaining imports of deleted files**

Search the codebase for any leftover imports referencing the deleted files:
- `from.*shared/sidebar/Sidebar`
- `from.*shared/sidebar/NavItem`
- `from.*shared/SidebarDrawer`
- `from.*shared/Header`
- `from.*shared/utils/sidebarUtil`

If any are found, update them. The `ProfileButton` export from `Header.tsx` was only used inside `Sidebar.tsx` and `Header.tsx` itself, so no external references should remain.

- [ ] **Step 4: Verify the build compiles**

Run: `npx tsc --noEmit`
Expected: No type errors. If there are errors about missing imports, fix them.

- [ ] **Step 5: Run the full build**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: remove old sidebar, header, and related utilities"
```

---

### Task 7: Final visual verification

- [ ] **Step 1: Start dev server and verify**

Run: `npm run dev`

Verify the following:
1. **Desktop (lg+):** Logo on left, pill nav tabs centered, action icons (bell, settings) + theme toggle + profile avatar on right
2. **Active tab:** White background with shadow and brand-colored text for the current route
3. **Profile dropdown:** Clicking the avatar opens the existing ProfilePopover with user info, theme toggle, and sign out
4. **Mobile (< lg):** Hamburger menu appears, pill tabs are hidden. Tapping hamburger opens Sheet with vertical nav links and theme toggle
5. **Dark mode:** Toggle theme — all elements use semantic `nl-*/nd-*` and `pl-*/pd-*` variables correctly
6. **Cards:** Any card elements now show `rounded-2xl` with subtle shadow in light mode
7. **Content area:** Has the light gray `bg-nl-50` / dark `bg-nd-900` background

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: No lint errors in new/modified files

- [ ] **Step 3: Run production build**

Run: `npm run build`
Expected: Build succeeds cleanly
