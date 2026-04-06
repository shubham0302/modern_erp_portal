# PieChart Component

A reusable, themeable pie/donut chart component built with Recharts. Features smooth animations, hover effects, and customizable styling.

## Features

- ✨ Smooth animations and hover interactions
- 🎨 Auto-themed colors that adapt to light/dark mode
- 📊 Support for both pie and donut chart styles
- 🎯 Interactive tooltips with percentage display
- 🔧 Highly customizable colors and behavior
- ♿ Accessible and responsive

## Basic Usage

```tsx
import { PieChart } from "@/components/charts/pie-chart";

const data = [
  { label: "Category A", value: 400 },
  { label: "Category B", value: 300 },
  { label: "Category C", value: 200 },
  { label: "Category D", value: 100 },
];

function MyComponent() {
  return <PieChart data={data} />;
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `PieDatum[]` | Required | Array of data points to display |
| `height` | `number` | `300` | Chart height in pixels |
| `innerRadius` | `number` | `0` | Inner radius for donut effect (0-100) |
| `showPercentage` | `boolean` | `true` | Show percentage in tooltip |
| `showLabel` | `boolean` | `false` | Show percentage labels on segments |
| `colors` | `string[]` | Default palette | Custom color array to cycle through |

## Data Structure

```typescript
interface PieDatum {
  label: string;      // Segment label
  value: number;      // Segment value
  color?: string;     // Optional custom color for this segment
}
```

## Examples

### Donut Chart

```tsx
<PieChart
  data={data}
  innerRadius={60}  // Creates donut effect
/>
```

### With Labels on Segments

```tsx
<PieChart
  data={data}
  showLabel={true}  // Shows percentage on each segment
/>
```

### Custom Colors

```tsx
// Using custom color palette
const customColors = [
  "var(--chart-tint-blue)",
  "var(--chart-tint-green)",
  "var(--chart-tint-orange)",
  "var(--chart-tint-pink)",
];

<PieChart
  data={data}
  colors={customColors}
/>

// Or set colors per data item
const dataWithColors = [
  { label: "Sales", value: 400, color: "var(--chart-tint-green)" },
  { label: "Marketing", value: 300, color: "var(--chart-tint-blue)" },
  { label: "Operations", value: 200, color: "var(--chart-tint-orange)" },
];

<PieChart data={dataWithColors} />
```

### Compact Size

```tsx
<PieChart
  data={data}
  height={200}
  innerRadius={40}
/>
```

### Without Percentage in Tooltip

```tsx
<PieChart
  data={data}
  showPercentage={false}
/>
```

## Styling

The component uses CSS variables from `chart.css` for theming:

```css
.chart-colors {
  --chart-active: theme(colors.pl.400);
  --chart-tint-blue: theme(colors.t-blue);
  --chart-tint-violet: theme(colors.t-violet);
  --chart-tint-green: theme(colors.t-green);
  /* ... more tint colors */
}
```

All colors automatically adapt to dark mode through the `.dark .chart-colors` selector.

## Use Cases

- Category distribution visualization
- Budget allocation breakdown
- Market share representation
- Survey results display
- Resource utilization charts
- Status/completion tracking

## Accessibility

- Hover effects provide visual feedback
- Tooltips show detailed information
- Smooth transitions for state changes
- Responsive container adapts to parent width
