import ComingSoon from "@/components/empty-states/ComingSoon";
import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";

export const Route = createFileRoute("/_protected/reports/")({
  component: RouteComponent,
  staticData: {
    pageTitle: "Reports",
    hideBackButton: true,
  },
});

function RouteComponent() {
  return <ComingSoon title="Reports" icon={BarChart3} />;
}
