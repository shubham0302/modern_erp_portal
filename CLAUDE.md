# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Modern ERP Portal — a React 19 + TypeScript admin panel built with Vite, TanStack Router (file-based routing), TanStack Query (React Query), and Tailwind CSS v4. The application implements RBAC (Role-Based Access Control) and follows a feature-first architecture.

**Brand Color**: `#FF800E` (orange) with shades `#ff8d26` (lighter), `#ff993e` (lightest), `#e6730d` (darker), `#cc660b` (darkest).

## Development Commands

```bash
npm run dev        # Start development server (Vite)
npm run build      # TypeScript check + production build
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

## Core Architecture

### Feature-First Structure

Features are self-contained modules under `src/features/[feature]/`:

```
features/
└── [feature]/
    ├── components/          # Feature-specific components
    ├── types/              # Feature types
    ├── [feature]Service.ts # Raw API calls
    └── [feature]Queries.ts # React Query setup
```

### Routing System (TanStack Router)

File-based routing with auto-generated route tree (`src/routeTree.gen.ts`). Routes are organized in:

- `routes/_auth/` - Unauthenticated routes (login)
- `routes/_protected/` - Authenticated routes

Route files use:

- `staticData.pageTitle` for dynamic page titles
- `beforeLoad` for auth checks and data prefetching
- Zod schemas for search param validation
- Type-safe navigation via `useNavigate()`

**IMPORTANT**: Keep page logic directly in route files. DO NOT create separate page-level components. The `RouteComponent` function should contain the main page logic. Only extract smaller, reusable part-level components when needed.

After creating new routes, run `npm run dev` to regenerate `routeTree.gen.ts`.

### Data Fetching Pattern (Service + Query Layer)

1. **Service Layer** (`[feature]Service.ts`) - API calls using typed axios wrappers:

   ```typescript
   export const getItems = () => getData<ItemResponse>("/api/items");
   ```

2. **Query Layer** (`[feature]Queries.ts`) - React Query configuration:

   ```typescript
   export const itemKeys = {
     all: ["items"] as const,
     list: () => [...itemKeys.all, "list"] as const,
   };

   export const useItemsQuery = () =>
     useQuery({
       queryKey: itemKeys.list(),
       queryFn: getItems,
     });
   ```

3. **Component Usage with QueryStateHandler** - **CRITICAL**: Always use `QueryStateHandler` to handle loading, error, and empty states:

   ```typescript
   import QueryStateHandler from "@/components/compound/QueryStateHandler";

   const query = useItemsQuery();

   return (
     <QueryStateHandler
       query={query}
       loadingSkeleton={<YourSkeletonComponent />}
       emptyTitle="No items found"
       isEmpty={query.data?.data.length === 0}
     >
       {/* Render your data here */}
     </QueryStateHandler>
   );
   ```

   **NEVER** manually handle loading/error states with `if (isLoading)` or `if (isError)` - always use `QueryStateHandler`.

4. **Mutation Error Handling** - Always use `showErrorToasts` in mutation `onError` handlers:

   ```typescript
   export const useCreateItemMutation = () =>
     useMutation({
       mutationFn: createItem,
       onError: (error) => {
         showErrorToasts(error);
       },
       onSuccess: () => {
         // Handle success (e.g., invalidate queries, show toast)
       },
     });
   ```

   **IMPORTANT**: Every mutation hook should include `onError: (error) => { showErrorToasts(error); }` to properly display validation errors and API error messages to users.

### API Client (`src/api/axiosInstance.ts`)

Centralized axios instance with:

- Automatic token injection via interceptor
- Typed wrappers: `getData<T>()`, `postData<T>()`, `putData<T>()`, `patchData<T>()`, `deleteData<T>()`, `getPaginatedData<T>()`
- Base URL from `VITE_SERVER_URL` environment variable

Always use these wrappers instead of raw axios calls.

### State Management

- **Global State**: Zustand stores in `src/store/`
  - `useAuthStore` - Authentication state
  - `usePermissionStore` - RBAC permissions
  - `useTheme` - Theme state
- **Server State**: TanStack Query (React Query)
- **Form State**: React Hook Form + Zod

### RBAC (Role-Based Access Control)

Permission types defined in `src/types/permissions.types.ts`:

- `PermissionFeaturesEnum` - Feature names
- `PermissionTypeEnum` - Permission levels (read, write, delete)
- `UserPermissions` - Permission map type

**Permission Check Utilities** (`src/utils/rbac.ts`):

```typescript
hasAccess(PermissionFeaturesEnum.dashboard, permissions, [PermissionTypeEnum.read]);
getFeaturePermissions(PermissionFeaturesEnum.dashboard, permissions);
```

Use RBAC checks in:

- Route `beforeLoad` functions for route-level protection
- Components for conditional rendering (buttons, actions)
- Table action columns for row-level actions

### Forms Pattern

React Hook Form + Zod validation:

```typescript
const schema = z.object({
  name: z.string().min(1, "Required"),
});

type FormFields = z.infer<typeof schema>;

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<FormFields>({
  resolver: zodResolver(schema),
});
```

### Route Constants Pattern

Routes defined in `src/constants/routes.ts` as nested object:

```typescript
export const ROUTES = {
  DASHBOARD: "/dashboard",
  FEATURE: {
    ROOT: "/feature",
    DETAILS: (id: string) => `/feature/details/${id}`,
  },
};
```

Update both `routes.ts` AND `navItems.ts` when adding new navigable routes.

### Component Organization

- `components/base/` - Atomic UI primitives (Button, Input, etc.)
- `components/compound/` - Complex reusable components (Table, Dialog, DatePicker)
- `components/charts/` - Chart components (AreaChart, SimpleBarChart, PieChart)
- `components/shared/` - Layout components (Header, Sidebar)

Use base components for consistency. Extend with Tailwind classes as needed.

### Table Column Patterns

When defining table columns for the Table component, follow these best practices:

**1. Define columns outside component** - Prevents recreation on every render:

```typescript
// ✅ CORRECT - Outside component
const columns: TableColumn<DataType>[] = [{ header: "Name", accessor: "name" }];

function RouteComponent() {
  // Component logic
}
```

**2. Simplify cell renderers** - Return values directly without unnecessary wrapper elements:

```typescript
// ✅ CORRECT - Return values directly
{
  header: "Name",
  accessor: "name",
  cell: (value: any) => `User ${value}`,
}
```

**3. Keep JSX only when necessary** - Use components for complex rendering.

**4. Organize file structure** - Place column definitions after main component.

### Modular Component Architecture

**IMPORTANT**: Always prefer a modular component structure over monolithic components.

- **Single Responsibility**: Each component should have one clear purpose
- **Separation of Concerns**: Separate container logic from presentation
- **Reusability**: Extract repeated patterns into standalone components
- Component exceeds ~200 lines? Break it down.

## UI Design Principles & Style Guide

### Core Philosophy

**Minimal, Sleek, Human-Scaled** — Clean interfaces with purposeful spacing, subtle interactions, and no overwhelming visual elements.

### Design System Foundation

#### Use Semantic Theme Variables (ALWAYS)

**CRITICAL**: Never use arbitrary colors. Always use the predefined theme variables.

**Color Palette Structure:**

- **Primary**: `pl-*` (light) / `pd-*` (dark) — Brand orange colors (900→50)
- **Neutral**: `nl-*` (light) / `nd-*` (dark) — Text, borders, backgrounds (900→50)
- **Danger**: `dl-*` (light) / `dd-*` (dark) — Errors, destructive actions (400-600)
- **Success**: `sl-*` (light) / `sd-*` (dark) — Success states (400-600)
- **Tints**: `t-violet`, `t-blue`, `t-indigo`, `t-amber`, `t-pink`, `t-peach`, `t-yellow`, `t-green`, `t-gray`, `t-orange`, `t-purple`

```tsx
// ✅ CORRECT - Use theme variables
<div className="bg-nl-50 dark:bg-nd-900 text-nl-800 dark:text-nd-100">
<button className="bg-pl-500 dark:bg-pd-500 hover:bg-pl-600">

// ❌ WRONG - Never use arbitrary colors
<div className="bg-gray-50 text-gray-800">
<button className="bg-orange-600 hover:bg-orange-700">
```

#### Pre-built Utility Classes

- **Cards**: Use `.card` class for consistent card styling
- **Centering**: Use `.fall` for flex center alignment
- **Icons**: Lucide icons automatically themed (`nl-600` / `nd-200`)
- **Skeleton Loaders**: Use `.shimmer` class for loading states

#### Rounded Design System

- **Cards and containers**: `rounded-xl` or `rounded-2xl`
- **Buttons and inputs**: `rounded-lg` or `rounded-xl`
- **Badges and chips**: `rounded-lg` or `rounded-xl`

### Color Usage by Text Importance

- **Primary/Important text**: `text-nl-800 dark:text-nd-100`
- **Secondary text**: `text-nl-600 dark:text-nd-300`
- **Muted text**: `text-nl-500 dark:text-nd-400`
- **Borders**: `border-nl-200 dark:border-nd-500`
- **Card backgrounds**: `bg-nl-50 dark:bg-nd-800`
- **Page backgrounds**: `bg-nl-100 dark:bg-nd-900`

### Common Pitfalls to Avoid

- **Never** use arbitrary colors (`bg-gray-800`, `text-white`, `bg-orange-500`)
- **Never** skip hover states on interactive elements
- **Never** forget responsive design — mobile-first approach
- **Never** use sharp corners — follow the rounded design system
- **Never** design for only one theme — always both dark and light

### Type Patterns

- **Shared types**: `src/types/`
- **Feature types**: `features/[feature]/types/`
- **Permission types**: `src/types/permissions.types.ts`
- **Base API types**: `BaseApiResponse<T>`, `PaginatedResponse<T>`, `BaseApiErrorResponse`

### Query Key Factory Pattern

```typescript
export const featureKeys = {
  all: ["feature"] as const,
  list: (filters?: Filters) => [...featureKeys.all, "list", filters] as const,
  details: (id: string) => [...featureKeys.all, "details", id] as const,
};
```

## Key Libraries & Patterns

- **Styling**: Tailwind CSS v4 (use utility classes)
- **Icons**: Lucide React
- **Charts**: Recharts (via `components/charts/`)
- **Drag & Drop**: DND Kit
- **Rich Text**: TipTap editor

## Important Conventions

1. **Always use typed axios wrappers** from `src/api/axiosInstance.ts`
2. **Separate service and query layers** - don't mix API calls with React Query setup
3. **Use query key factories** for consistent cache management
4. **Check RBAC permissions** before showing actions or allowing navigation
5. **Define routes in ROUTES constant** before creating route files
6. **Use Zod schemas** for form validation and route search params
7. **Follow feature-first organization** for new features
8. **Use base components** for UI consistency
9. **Regenerate route tree** after adding/modifying routes (happens automatically in dev mode)
10. **Use useDebounce hook** for API search inputs to optimize performance
11. **NEVER install packages without explicit user permission** - Always check existing dependencies first

## Environment Variables

Required variables in `.env`:

- `VITE_SERVER_URL` - Backend API base URL

## Error Handling

- API errors caught by axios interceptor
- User-friendly error messages via `showErrorToasts` utility
- Error boundaries with `GlobalNotFound` component
