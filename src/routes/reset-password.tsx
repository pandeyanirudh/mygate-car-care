import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/auth-form";
export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [
    { title: "Reset password — MyGate Car Care" },
    { name: "description", content: "Securely reset your MyGate Car Care account password." },
    { property: "og:title", content: "Reset password — MyGate Car Care" },
    { property: "og:description", content: "Choose a new password for your Car Care account." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: () => <AuthForm recovery />,
});