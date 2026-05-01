import ComingSoon from "@/components/empty-states/ComingSoon";
import { createFileRoute } from "@tanstack/react-router";
import { Factory } from "lucide-react";

export const Route = createFileRoute("/_protected/production/")({
  component: RouteComponent,
  staticData: {
    pageTitle: "Production",
    hideBackButton: true,
  },
});

function RouteComponent() {
  return <ComingSoon title="Production" icon={Factory} />;
}
