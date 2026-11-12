import { createFileRoute } from "@tanstack/react-router";
import { UtsApp } from "@/components/uts/UtsApp";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <UtsApp />;
}
