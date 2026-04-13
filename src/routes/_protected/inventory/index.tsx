import SizeCard from "@/features/inventory/components/SizeCard";
import { SIZES } from "@/features/inventory/constants/inventoryOptions";
import { useInventoryStore } from "@/features/inventory/store/useInventoryStore";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/inventory/")({
  component: RouteComponent,
  staticData: {
    pageTitle: "Batch Management",
    hideBackButton: true,
  },
});

function RouteComponent() {
  const batches = useInventoryStore((s) => s.batches);

  const statsBySize = SIZES.map((size) => {
    const sizeBatches = batches.filter((b) => b.size === size);
    return {
      size,
      batchCount: sizeBatches.length,
      totalBoxes: sizeBatches.reduce((sum, b) => sum + b.boxes, 0),
    };
  });

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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statsBySize.map(({ size, batchCount, totalBoxes }) => (
          <SizeCard
            key={size}
            size={size}
            batchCount={batchCount}
            totalBoxes={totalBoxes}
          />
        ))}
      </div>
    </div>
  );
}
