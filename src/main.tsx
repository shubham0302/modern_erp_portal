import { QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import { queryClient } from "./queryClient.ts";
import AuthInitializer from "./AuthInitializer.tsx";

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <QueryClientProvider client={queryClient}>
      <AuthInitializer />
    </QueryClientProvider>,
  );
}
