import ComingSoon from "@/components/empty-states/ComingSoon";
import { createFileRoute } from "@tanstack/react-router";
import { Package } from "lucide-react";

export const Route = createFileRoute("/_protected/inventory/")({
  component: RouteComponent,
  staticData: {
    pageTitle: "Inventory",
    hideBackButton: true,
  },
});

function RouteComponent() {
  return <ComingSoon title="Inventory" icon={Package} />;
}
