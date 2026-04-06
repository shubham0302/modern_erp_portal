import type { TableColumn } from "@/components/compound/table/Table";

// ─── Chart Data ───

export const revenueData = [
  { label: "Mon", value: 4200 },
  { label: "Tue", value: 5800 },
  { label: "Wed", value: 4900 },
  { label: "Thu", value: 7200 },
  { label: "Fri", value: 6800 },
  { label: "Sat", value: 9200 },
  { label: "Sun", value: 8400 },
];

export const ordersData = [
  { label: "Mon", value: 145 },
  { label: "Tue", value: 198 },
  { label: "Wed", value: 167 },
  { label: "Thu", value: 234 },
  { label: "Fri", value: 212 },
  { label: "Sat", value: 289 },
  { label: "Sun", value: 256 },
];

export const categoryData = [
  { label: "Electronics", value: 420 },
  { label: "Clothing", value: 310 },
  { label: "Food & Beverage", value: 280 },
  { label: "Home & Garden", value: 150 },
  { label: "Others", value: 88 },
];

export const monthlySalesData = [
  { label: "Jan", value: 32000 },
  { label: "Feb", value: 28000 },
  { label: "Mar", value: 35000 },
  { label: "Apr", value: 42000 },
  { label: "May", value: 38000 },
  { label: "Jun", value: 48560 },
];

// ─── Table Types ───

interface RecentOrder {
  id: string;
  customer: string;
  amount: number;
  status: string;
  date: string;
}

interface TopProduct {
  name: string;
  category: string;
  sales: number;
  revenue: number;
}

// ─── Table Columns ───

export const orderColumns: TableColumn<RecentOrder>[] = [
  { header: "Order ID", accessor: "id" },
  { header: "Customer", accessor: "customer" },
  {
    header: "Amount",
    accessor: "amount",
    cell: (value: any) => `$${(value as number).toLocaleString()}`,
  },
  {
    header: "Status",
    accessor: "status",
    cell: (value: any) => {
      const status = value as string;
      const colorMap: Record<string, string> = {
        Completed: "bg-sl-400/20 text-sl-600 dark:text-sd-400",
        Processing: "bg-pl-100 text-pl-700 dark:bg-pd-800/40 dark:text-pd-300",
        Pending: "bg-t-yellow/20 text-t-amber",
      };
      return (
        <span
          className={`rounded-lg px-2 py-0.5 text-xs font-medium ${colorMap[status] || ""}`}
        >
          {status}
        </span>
      );
    },
  },
  { header: "Date", accessor: "date" },
];

export const productColumns: TableColumn<TopProduct>[] = [
  { header: "Product", accessor: "name" },
  { header: "Category", accessor: "category" },
  { header: "Sales", accessor: "sales" },
  {
    header: "Revenue",
    accessor: "revenue",
    cell: (value: any) => `$${(value as number).toLocaleString()}`,
  },
];

// ─── Table Data ───

export const recentOrders: RecentOrder[] = [
  { id: "#ORD-001", customer: "John Smith", amount: 245, status: "Completed", date: "Apr 5" },
  { id: "#ORD-002", customer: "Sarah Johnson", amount: 1890, status: "Processing", date: "Apr 5" },
  { id: "#ORD-003", customer: "Mike Davis", amount: 560, status: "Pending", date: "Apr 4" },
  { id: "#ORD-004", customer: "Emily Brown", amount: 320, status: "Completed", date: "Apr 4" },
  { id: "#ORD-005", customer: "Chris Wilson", amount: 780, status: "Completed", date: "Apr 3" },
];

export const topProducts: TopProduct[] = [
  { name: "Wireless Headphones", category: "Electronics", sales: 342, revenue: 17100 },
  { name: "Running Shoes", category: "Clothing", sales: 256, revenue: 12800 },
  { name: "Coffee Maker", category: "Home & Garden", sales: 189, revenue: 9450 },
  { name: "Organic Tea Set", category: "Food & Beverage", sales: 167, revenue: 5010 },
  { name: "Desk Lamp", category: "Home & Garden", sales: 134, revenue: 4020 },
];
