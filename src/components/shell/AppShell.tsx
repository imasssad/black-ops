import { useEffect, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useForge } from "@/lib/store";

const NAV = [
  { to: "/", label: "Match" },
  { to: "/studio", label: "Studio" },
  { to: "/craft", label: "Craft" },
  { to: "/source", label: "Source" },
  { to: "/notes", label: "Notes" },
] as const;

export function AppShell({ children, dense }: { children: ReactNode; dense?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    void useForge.persist.rehydrate();
  }, []);
  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <header className="relative z-30 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 border-b border-border px-3 py-2 sm:px-6">
        <Link to="/" className="flex items-baseline gap-2 no-underline">
          <span className="font-display text-xl leading-none text-fg sm:text-2xl">FORGE 115</span>
          <span className="hidden text-xs tracking-[0.18em] text-muted sm:inline">ZM COMMAND</span>
        </Link>
        <nav className="flex min-w-0 flex-wrap items-center">
          {NAV.map((n) => {
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "px-2 py-2 text-[10px] tracking-[0.12em] uppercase no-underline transition-colors duration-150 sm:px-3 sm:text-xs sm:tracking-[0.16em]",
                  active ? "text-accent" : "text-muted hover:text-fg",
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <div className={cn("flex-1", dense ? "" : "px-4 py-6 sm:px-8")}>{children}</div>
    </div>
  );
}
