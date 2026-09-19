import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/shell/AppShell";
import { Button } from "@/components/ui/button";
import { TECHNIQUES, type Technique } from "@/lib/gsc/techniques";
import { useForge } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const Route = createFileRoute("/craft")({ component: CraftPage });

function CraftPage() {
  const [active, setActive] = useState(TECHNIQUES[0]!.id);
  const tech = TECHNIQUES.find((t) => t.id === active) ?? TECHNIQUES[0]!;
  const navigate = useNavigate();

  const tryIt = (t: Technique) => {
    const f = useForge.getState();
    if (f.match.phase !== "playing") f.resetMatch();
    if (t.tryId) f.applyItem(t.tryId, t.tryExtra);
    f.setCategory("advanced");
    void navigate({ to: "/" });
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] tracking-[0.24em] text-accent uppercase">Craft</p>
        <h1 className="mt-1 font-display text-5xl leading-none">Advanced techniques</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Host-only GSC patterns for private T6 Zombies. Each one is in{" "}
          <span className="font-mono text-fg">_hooks.gsc</span> and most can be fired on the live
          Green Run match. Official VAC servers are not a target.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
          <ol className="border border-border bg-surface">
            {TECHNIQUES.map((t) => {
              const on = t.id === tech.id;
              return (
                <li key={t.id} className="border-b border-border last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setActive(t.id)}
                    className={cn(
                      "flex w-full items-baseline gap-3 px-3 py-2.5 text-left",
                      on ? "bg-surface-2 text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    <span className="font-mono text-[10px] tracking-[0.16em] text-accent">{t.n}</span>
                    <span className="text-sm">{t.title}</span>
                  </button>
                </li>
              );
            })}
          </ol>

          <article className="border border-border bg-surface p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
                  {tech.pattern}
                </div>
                <h2 className="mt-1 font-display text-4xl leading-none">{tech.title}</h2>
              </div>
              {tech.tryId ? (
                <Button onClick={() => tryIt(tech)}>Try on Match</Button>
              ) : (
                <span className="font-mono text-[10px] tracking-[0.16em] text-faint uppercase">
                  Source only
                </span>
              )}
            </div>
            <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted">{tech.body}</p>
            <pre className="mt-5 overflow-x-auto border border-border bg-bg p-4 font-mono text-[11px] leading-relaxed text-hud">
              {tech.snippet}
            </pre>
          </article>
        </div>

        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          <Rule title="Host only" body="isHost() before overlay, score, AI, or origin writes. Clients never run this pack." />
          <Rule title="Threads die clean" body="endon disconnect, death, and game_ended. HUD elems are pooled, not spawned every frame." />
          <Rule title="Private maps" body="Plutonium storage or a match you host. No Steam process inject, no VAC bypass." />
        </section>
      </div>
    </AppShell>
  );
}

function Rule({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-border bg-surface p-4">
      <div className="font-display text-2xl leading-none">{title}</div>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}
