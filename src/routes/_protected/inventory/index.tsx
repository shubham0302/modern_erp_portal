import QueryStateHandler from "@/components/compound/QueryStateHandler";
import SizeCard from "@/features/inventory/components/SizeCard";
import { useInventorySizesQuery } from "@/features/inventory/inventoryQueries";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/inventory/")({
  component: RouteComponent,
  staticData: {
    pageTitle: "Batch Management",
    hideBackButton: true,
  },
});

function RouteComponent() {
  const sizesQuery = useInventorySizesQuery();
  const sizes = sizesQuery.data?.data ?? [];

  return (
    <div className="page-enter space-y-6 pb-8">
      <div>
        <h4 className="text-nl-800 dark:text-nd-100 font-bold">
          Batch Management
        </h4>
        <p className="text-nl-500 dark:text-nd-300 mt-1 text-sm">
          Select a tile size to manage its batches
        </p>
      </div>

      <QueryStateHandler
        query={sizesQuery}
        loadingSkeleton={<SizeCardsSkeleton />}
        emptyTitle="No tile sizes found"
        isEmpty={sizes.length === 0}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sizes.map((size) => (
            <SizeCard
              key={size.id}
              id={size.id}
              size={size.name}
              batchCount={size.totalBatches}
              totalBoxes={size.totalBoxes}
            />
          ))}
        </div>
      </QueryStateHandler>
    </div>
  );
}

const SizeCardsSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="shimmer h-48 w-full rounded-2xl" />
    ))}
  </div>
);
