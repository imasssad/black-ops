import { createFileRoute } from "@tanstack/react-router";
import { MatchView } from "@/components/game/MatchView";
import { AppShell } from "@/components/shell/AppShell";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <AppShell dense>
      <MatchView />
    </AppShell>
  );
}
