# Charts Directory Structure

This directory contains chart components with a modular, organized structure.

## Directory Organization

```
charts/
├── components/           # Reusable chart components (shared across multiple chart types)
│   └── ChartTooltip.tsx
├── types/               # Shared chart types
│   └── index.ts
├── [chart-name]/        # Chart-specific directories
│   ├── components/      # Components specific to this chart type
│   └── types/          # Types specific to this chart type
│       └── index.ts
├── SimpleBarChart.tsx   # Main chart component exports
└── ProgressBar.tsx      # Simple progress indicator
```

## Structure Guidelines

### Shared Components (`charts/components/`)
Place reusable components here if they can be used by multiple chart types.

**Example:** `ChartTooltip.tsx` - A tooltip component that can be used by bar charts, line charts, etc.

### Shared Types (`charts/types/`)
Place base types and interfaces that multiple charts might extend or use.

**Example:**
- `ChartDatum` - Base data structure for chart data points
- `ChartStyleConfig` - Common styling configuration
- `ChartTooltipPayload` - Recharts tooltip payload structure

### Chart-Specific Directories (`charts/[chart-name]/`)
When a component or type is specific to one chart type, create a chart-specific directory.

**Structure:**
```
charts/simple-bar-chart/
├── components/          # Components only used by SimpleBarChart
└── types/              # Types only used by SimpleBarChart
    └── index.ts
```

### Main Chart Components
The main chart component file (e.g., `SimpleBarChart.tsx`) should:
1. Import from shared components/types
2. Import from chart-specific types
3. Export the main component as default
4. Re-export relevant types for convenience

## Adding New Charts

When adding a new chart component:

1. **Check for reusability first:**
   - Can any existing shared components be reused?
   - Do shared types need to be extended?

2. **Create chart-specific structure if needed:**
   ```bash
   mkdir -p charts/[chart-name]/components
   mkdir -p charts/[chart-name]/types
   ```

3. **Define types:**
   - Extend shared types from `charts/types/` when possible
   - Place chart-specific types in `charts/[chart-name]/types/`

4. **Build the component:**
   - Use shared components from `charts/components/`
   - Create chart-specific components in `charts/[chart-name]/components/`
   - Export main component from `charts/[ChartName].tsx`

5. **Follow project conventions:**
   - Use theme variables (e.g., `var(--color-pl-500)`)
   - Add JSDoc comments for component documentation
   - Re-export types for convenient imports

## Example: SimpleBarChart

```typescript
// Import shared components
import ChartTooltip from "./components/ChartTooltip";

// Import chart-specific types
import type { SimpleBarChartProps } from "./simple-bar-chart/types";

// Main component
export default function SimpleBarChart({ ... }: SimpleBarChartProps) {
  // Implementation
}

// Re-export types for convenience
export type { BarDatum, SimpleBarChartProps } from "./simple-bar-chart/types";
```

## Available Components

### SimpleBarChart
Clean bar chart with customizable colors and active state highlighting.

**Usage:**
```typescript
import SimpleBarChart, { type BarDatum } from "@/components/charts/SimpleBarChart";

const data: BarDatum[] = [
  { label: "12-1 PM", value: 45, active: true },
  { label: "1-2 PM", value: 32 },
  { label: "MON", value: 120 },
  { label: 1, value: 85 }, // label can be string or number
];

<SimpleBarChart data={data} height={260} />
```

### ProgressBar
SVG-based progress indicator for displaying completion or loading progress.

**Usage:**
```typescript
import ProgressBar from "@/components/charts/ProgressBar";

<ProgressBar progress={75} total={100} height={20} />
```

### PieChart
A clean pie/donut chart with customizable colors, hover effects, and flexible legend layouts.

**Features:**
- Donut chart design (80% inner radius)
- Interactive hover effects with opacity changes
- Customizable legend layouts (vertical stacked or horizontal spread)
- Multi-column legend support for long lists
- Optional center content for donut charts
- Theme-integrated color palette

**Usage:**
```typescript
import PieChart, { type PieDatum } from "@/components/charts/PieChart";

const data: PieDatum[] = [
  { label: "Direct Orders", value: 432 },
  { label: "Restaurant Orders", value: 285 },
  { label: "Catering", value: 156 },
  // ... more items
];

// Basic usage
<PieChart data={data} height={300} />

// With two-column horizontal legend (recommended for long lists)
<PieChart
  data={data}
  height={300}
  legendColumns={2}
  legendLayout="horizontal"
/>

// With sorted legend (highest to lowest value)
<PieChart
  data={data}
  legendSort="value-desc"
/>

// Complete example: Multi-column, horizontal layout, sorted by value
<PieChart
  data={data}
  height={300}
  legendColumns={2}
  legendLayout="horizontal"
  legendSort="value-desc"
/>

// With center content
<PieChart
  data={data}
  center={{ label: "Total Orders", value: "873" }}
/>

// Custom colors and tooltip
<PieChart
  data={data}
  colors={["#FF6B6B", "#4ECDC4", "#45B7D1"]}
  renderTooltip={(label, value, percentage) => (
    <div>{label}: {value} ({percentage}%)</div>
  )}
/>
```

**Props:**
- `data` - Array of PieDatum objects with label and value
- `height` - Chart height in pixels (default: 300)
- `showPercentage` - Show percentage in legend and tooltip (default: true)
- `colors` - Custom color array (defaults to theme tints)
- `legendColumns` - Number of columns for legend grid (default: 1)
- `legendLayout` - Layout style: `"vertical"` (stacked) or `"horizontal"` (spread with value on right) (default: "vertical")
- `legendSort` - Sort order: `"none"`, `"value-desc"`, `"value-asc"`, `"label-asc"`, `"label-desc"` (default: "none")
- `showLegend` - Show/hide legend (default: true)
- `chartToLegendRatio` - Flex ratio for chart vs legend width (default: 2 = 2:1 ratio)
- `center` - Optional center content for donut: `{ label: string, value: string | number }`
- `renderTooltip` - Custom tooltip renderer

**Legend Layouts:**
- **Vertical (default)**: Label and value stacked vertically, good for short lists
- **Horizontal**: Color box + label on left, value on right, good for long lists with multiple columns

**Legend Sorting:**
- **none** (default): Keep original data order
- **value-desc**: Sort by value, highest to lowest (recommended for highlighting top items)
- **value-asc**: Sort by value, lowest to highest
- **label-asc**: Sort alphabetically A-Z
- **label-desc**: Sort alphabetically Z-A

### AreaChart
Area chart with gradient fills and smooth curves.

**Usage:**
```typescript
import AreaChart, { type AreaDatum } from "@/components/charts/AreaChart";

const data: AreaDatum[] = [
  { label: "Jan", value: 120 },
  { label: "Feb", value: 145 },
  { label: "Mar", value: 132 },
];

<AreaChart data={data} height={300} />
```

### ChartTooltip
Reusable tooltip component for Recharts with customizable formatters.

**Usage:**
```typescript
import ChartTooltip from "@/components/charts/components/ChartTooltip";

<Tooltip
  content={
    <ChartTooltip
      labelFormatter={(p) => p.label}
      valueFormatter={(v) => `${v} items`}
    />
  }
/>
```
