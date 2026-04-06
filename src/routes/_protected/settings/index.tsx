import ComingSoon from "@/components/empty-states/ComingSoon";
import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";

export const Route = createFileRoute("/_protected/settings/")({
  component: RouteComponent,
  staticData: {
    pageTitle: "Settings",
    hideBackButton: true,
  },
});

function RouteComponent() {
  return <ComingSoon title="Settings" icon={Settings} />;
}
