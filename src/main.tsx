import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PostHogProvider } from "posthog-js/react";
import { Toaster } from "@/components/ui/sonner";
import "./index.css";
import App from "./App";
import posthog from "posthog-js";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
const client = posthog.init(import.meta.env.VITE_POSTHOG_KEY as string, {
  api_host: import.meta.env.VITE_POSTHOG_HOST as string,
});
console.log("client", client);

createRoot(rootElement).render(
  <StrictMode>
    <PostHogProvider client={client}>
      <App />
      <Toaster />
    </PostHogProvider>
  </StrictMode>
);
