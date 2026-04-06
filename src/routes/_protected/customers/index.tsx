import ComingSoon from "@/components/empty-states/ComingSoon";
import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";

export const Route = createFileRoute("/_protected/customers/")({
  component: RouteComponent,
  staticData: {
    pageTitle: "Customers",
    hideBackButton: true,
  },
});

function RouteComponent() {
  return <ComingSoon title="Customers" icon={Users} />;
}
