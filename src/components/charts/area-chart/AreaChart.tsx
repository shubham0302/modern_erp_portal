import ChartTooltip from "../components/ChartTooltip";
import type { AreaChartProps } from "./types";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AreaChartComponent: React.FC<AreaChartProps> = (props) => {
  const { height, data, renderTooltip, tickFormatter, xAxisTickFormatter } = props;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { value, payload: p } = payload[0];
      if (renderTooltip) {
        return (
          <div className="animate-in fade-in-0 zoom-in-95 dark:bg-nd-500 bg-nl-100 text-nl-700 dark:text-nd-100 z-50 rounded-lg px-2.5 py-1 text-sm shadow-xs">
            {renderTooltip(p.label, value)}
          </div>
        );
      }
      return <ChartTooltip active={active} payload={payload} />;
    }
    return null;
  };

  return (
    <div className="chart-colors w-full">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={data}
          margin={{ left: 0, right: 0, top: 20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopOpacity={0.9}
                stopColor="var(--chart-active-dark)"
              />
              <stop
                offset="100%"
                stopOpacity={0}
                stopColor="var(--area-chart-base-stop)"
              />
            </linearGradient>
          </defs>

          <YAxis
            tick={{ fill: "var(--chart-text)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            domain={[0, "auto"]}
            width={40}
            // width={tickFormatter ? 60 : 30}
            tickFormatter={tickFormatter}
          />

          <XAxis
            dataKey="label"
            tick={{ fill: "var(--chart-text)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            height={20}
            padding={{ left: 24 }}
            tickFormatter={xAxisTickFormatter}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "transparent" }}
          />

          <Area
            type="monotone"
            dataKey="value"
            strokeWidth={2}
            stroke="var(--chart-active-light)"
            fill="url(#areaFill)"
            dot={{
              r: 2,
              fill: "var(--chart-active)",
            }}
            activeDot={{
              r: 4,
              stroke: "var(--chart-active-light)",
              fill: "var(--chart-active-light)",
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartComponent;
