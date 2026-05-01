import ComingSoon from "@/components/empty-states/ComingSoon";
import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";

export const Route = createFileRoute("/_protected/finance/")({
  component: RouteComponent,
  staticData: {
    pageTitle: "Finance",
    hideBackButton: true,
  },
});

function RouteComponent() {
  return <ComingSoon title="Finance" icon={Wallet} />;
}
