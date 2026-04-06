# Top Navigation Redesign

**Date**: 2026-04-06
**Reference**: TastyIgniter order management dashboard (user-provided screenshot)
**Status**: Approved

## Summary

Replace the current sidebar navigation with a horizontal top navigation bar, matching the reference UI's layout pattern. The reference shows: logo left, pill-style nav tabs center, icon actions + profile right. Cards use generous `rounded-2xl` curves with soft shadows.

## Design Decisions

### Layout: Sidebar → Top Nav

**Current**: `flex h-dvh w-dvw` with sidebar (left) + content (right) column layout.
**New**: Single-column layout with a sticky top nav bar, full-width content below.

- **Desktop**: Logo | centered pill nav tabs | action icons + profile avatar
- **Mobile**: Logo | hamburger menu (Sheet drawer with nav links) | profile avatar

### Top Nav Bar Structure

```
┌─────────────────────────────────────────────────────────┐
│  [Logo M] Modern ERP  │  [Dashboard] [Inventory] ...  │  🔔 ⚙️ 🌙 │ (DU) Admin ▾ │
└─────────────────────────────────────────────────────────┘
```

- **Logo**: 32px rounded-xl gradient icon (`#FF800E` → `#ff993e`) + "Modern ERP" text
- **Nav tabs**: Contained in a `bg-nl-50 dark:bg-nd-700` pill container with `rounded-xl` padding. Active tab gets `bg-white dark:bg-nd-600` with subtle shadow, `font-semibold`, brand color text.
- **Action icons**: Rounded icon buttons in `bg-nl-50` circles — notification bell, settings gear, theme toggle
- **Profile**: Avatar circle (brand gradient) + "Admin" label + chevron dropdown. Reuses existing `ProfilePopover` and `LogoutDialog`.

### Nav Tabs Behavior

- Each tab is a `<Link>` from TanStack Router with `activeProps` for active styling
- Active tab: white bg, shadow, brand-colored text (`text-pl-600 dark:text-pd-400`)
- Inactive tab: transparent bg, `text-nl-500 dark:text-nd-300`, hover `bg-nl-100 dark:bg-nd-600`
- Tabs scroll horizontally on smaller screens if needed (overflow-x-auto, no-scrollbar)

### Mobile Behavior

- Nav tabs hidden below `lg` breakpoint
- Hamburger icon appears, opens a Sheet drawer with vertical nav links (reuse existing Sheet component)
- Profile avatar always visible in top bar

### Card Design (from reference)

Update the global `.card` class to match the reference's generous curves and soft feel:
- `rounded-2xl` (up from `rounded-xl`)
- Subtle shadow: `shadow-sm` in light mode
- Border: keep existing `border-nl-200 dark:border-nd-500`
- Content padding convention: `p-5` or `p-6` for cards

### Page Title

Currently rendered in the Header. With the top nav, the page title moves into the content area — each route already sets `staticData.pageTitle`, so the protected layout will render it above `<Outlet />`.

## Files to Modify

| File | Change |
|------|--------|
| `src/routes/_protected/route.tsx` | Replace sidebar+header layout with top nav + content layout. Render page title inline. |
| `src/components/shared/Header.tsx` | Rewrite as `TopNav` — logo, nav tabs, action icons, profile. |
| `src/components/shared/SidebarDrawer.tsx` | Adapt to render nav links vertically in Sheet for mobile. |
| `src/constants/navItems.ts` | No structural change — same data, rendered as tabs instead of sidebar items. |
| `src/styles/index.css` | Update `.card` class to `rounded-2xl`, add `.card` shadow. Update `.protected-layout-container` padding. |

## Files to Remove (after migration)

| File | Reason |
|------|--------|
| `src/components/shared/sidebar/Sidebar.tsx` | Replaced by TopNav |
| `src/components/shared/sidebar/NavItem.tsx` | Replaced by inline tab links in TopNav |
| `src/components/shared/utils/sidebarUtil.ts` | localStorage sidebar state no longer needed |

## Files NOT Changed

- `src/components/shared/ProfilePopover.tsx` — reused as-is in TopNav
- `src/components/shared/LogoutDialog.tsx` — reused as-is
- `src/components/shared/NotificationPopover.tsx` — reused as-is
- `src/constants/routes.ts` — unchanged
- All route files — unchanged (they use `staticData.pageTitle` which still works)

## Dark Mode

All new elements use semantic theme variables (`nl-*`/`nd-*`, `pl-*`/`pd-*`). No arbitrary colors.

## Out of Scope

- Dashboard page content redesign (only the navigation chrome changes)
- Adding new nav items beyond what exists in `navItems.ts`
- Backend integration
