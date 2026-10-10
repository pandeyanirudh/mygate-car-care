import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth-form";
export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Sign in — MyGate Car Care" },
    { name: "description", content: "Sign in or create your MyGate Car Care account for society-first car care." },
    { property: "og:title", content: "Sign in — MyGate Car Care" },
    { property: "og:description", content: "Your personal account for reliable doorstep car care." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: AuthForm,
});