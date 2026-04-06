import AreaChartComponent from "@/components/charts/area-chart/AreaChart";
import SimpleBarChart from "@/components/charts/simple-bar-chart/SimpleBarChart";
import PieChart from "@/components/charts/pie-chart/PieChart";
import ChartCard from "@/components/compound/ChartCard";
import { Table } from "@/components/compound/table/Table";
import StatCard from "@/features/dashboard/components/StatCard";
import {
  categoryData,
  monthlySalesData,
  orderColumns,
  ordersData,
  recentOrders,
  revenueData,
  productColumns,
  topProducts,
} from "@/features/dashboard/dashboardData.tsx";
import { createFileRoute } from "@tanstack/react-router";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";

export const Route = createFileRoute("/_protected/dashboard/")({
  component: RouteComponent,
  staticData: {
    pageTitle: "Dashboard",
    hideBackButton: true,
  },
});

function RouteComponent() {
  return (
    <div className="page-enter space-y-6 pb-8">
      {/* Welcome Header */}
      <div>
        <h4 className="text-nl-800 dark:text-nd-100 font-bold">
          Welcome back!
        </h4>
        <p className="text-nl-500 dark:text-nd-300">
          Here's an overview of your business performance
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value="$48,560" change="+12.5%" isPositive icon={<DollarSign size={20} />} />
        <StatCard title="Total Orders" value="1,248" change="+8.2%" isPositive icon={<ShoppingCart size={20} />} />
        <StatCard title="Active Users" value="3,420" change="-2.4%" isPositive={false} icon={<Users size={20} />} />
        <StatCard title="Products" value="856" change="+4.1%" isPositive icon={<Package size={20} />} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Revenue Overview">
          <AreaChartComponent
            height={260}
            data={revenueData}
            renderTooltip={(label, value) => (
              <div>
                <p className="font-medium">{label}</p>
                <p>${value.toLocaleString()}</p>
              </div>
            )}
          />
        </ChartCard>

        <ChartCard title="Orders This Week">
          <SimpleBarChart
            height={260}
            data={ordersData}
            renderTooltip={(label, value) => (
              <div>
                <p className="font-medium">{String(label)}</p>
                <p>{value} orders</p>
              </div>
            )}
          />
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Sales by Category">
          <PieChart
            data={categoryData}
            height={240}
            center={{ label: "Total", value: "1,248" }}
            legendLayout="horizontal"
          />
        </ChartCard>

        <ChartCard title="Monthly Sales Trend">
          <SimpleBarChart
            height={260}
            data={monthlySalesData}
            barRadius={8}
            renderTooltip={(label, value) => (
              <div>
                <p className="font-medium">{String(label)}</p>
                <p>${value.toLocaleString()}</p>
              </div>
            )}
          />
        </ChartCard>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Recent Orders">
          <Table columns={orderColumns} data={recentOrders} size="sm" />
        </ChartCard>

        <ChartCard title="Top Products">
          <Table columns={productColumns} data={topProducts} size="sm" />
        </ChartCard>
      </div>
    </div>
  );
}
