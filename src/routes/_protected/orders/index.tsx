import ComingSoon from "@/components/empty-states/ComingSoon";
import { createFileRoute } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";

export const Route = createFileRoute("/_protected/orders/")({
  component: RouteComponent,
  staticData: {
    pageTitle: "Orders",
    hideBackButton: true,
  },
});

function RouteComponent() {
  return <ComingSoon title="Orders" icon={ShoppingCart} />;
}
