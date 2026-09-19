import { PERK_BY_ID } from "@/lib/perks";
import { useForge } from "@/lib/store";
import { WEAPON_BY_ID } from "@/lib/weapons";

export function Hud() {
  const m = useForge((s) => s.match);
  const openKey = useForge((s) => s.settings.openMenuKey);
  const log = useForge((s) => s.log[0]);
  const weapon = WEAPON_BY_ID[m.weaponId];
  if (m.phase === "boot") return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-10 text-hud">
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
        <div className="text-[10px] tracking-[0.22em] text-muted uppercase">Richtofen</div>
        <div className="hud-stamp text-3xl leading-none text-fg tabular-nums">{m.points.toLocaleString()}</div>
        {m.zombieCounter ? (
          <div className="mt-1 font-mono text-[11px] text-muted tabular-nums">
            Alive {m.zombies.length}
          </div>
        ) : null}
      </div>

      {log ? (
        <div className="absolute top-3 left-1/2 z-10 max-w-[min(70vw,420px)] -translate-x-1/2 truncate border border-border bg-bg/70 px-3 py-1 font-mono text-[11px] text-accent">
          {log}
        </div>
      ) : null}

      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
        <div
          className="hud-stamp text-6xl leading-none text-danger sm:text-7xl"
          style={{ textShadow: "0 2px 0 rgb(0 0 0 / 0.6)" }}
        >
          {m.round}
        </div>
        {m.healthBar ? (
          <div className="mt-2 h-1.5 w-28 bg-surface-2">
            <div
              className="h-full bg-danger"
              style={{ width: `${Math.max(0, (m.health / m.maxHealth) * 100)}%` }}
            />
          </div>
        ) : null}
        <div className="mt-2 flex gap-1">
          {m.perks.map((id) => (
            <span
              key={id}
              className="flex size-7 items-center justify-center border border-border font-mono text-[9px] tracking-wider"
              style={{ color: PERK_BY_ID[id].color }}
            >
              {PERK_BY_ID[id].short}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute right-4 bottom-4 text-right sm:right-6 sm:bottom-6">
        <div className="font-display text-2xl tracking-wide text-fg">{weapon.name}</div>
        <div className="font-mono text-sm text-muted tabular-nums">
          {m.infiniteAmmo ? "∞" : `${m.mag} / ${m.stock}`}
        </div>
        <div className="mt-2 text-[10px] tracking-[0.18em] text-faint uppercase">
          {openKey} menu
        </div>
      </div>

      {m.roundBanner > 0 ? (
        <div className="absolute inset-x-0 top-1/3 flex justify-center">
          <div
            className="font-display text-5xl tracking-[0.2em] text-danger sm:text-6xl"
            style={{ animation: "round-banner 2.2s ease-out both" }}
          >
            ROUND {m.round}
          </div>
        </div>
      ) : null}

      {m.godMode ? (
        <div className="absolute top-12 right-3 font-mono text-[10px] tracking-[0.2em] text-accent uppercase">
          God
        </div>
      ) : null}
      {m.noclip || m.ufoMode ? (
        <div className="absolute top-16 right-3 font-mono text-[10px] tracking-[0.2em] text-accent uppercase">
          {m.ufoMode ? "UFO" : "Noclip"}
        </div>
      ) : null}
      {m.visionNight ? (
        <div className="absolute top-20 right-3 font-mono text-[10px] tracking-[0.2em] text-accent uppercase">
          Night
        </div>
      ) : null}
      {m.instaKill ? (
        <div className="absolute top-24 right-3 font-mono text-[10px] tracking-[0.2em] text-danger uppercase">
          Insta
        </div>
      ) : null}
      {m.doublePoints ? (
        <div className="absolute top-28 right-3 font-mono text-[10px] tracking-[0.2em] text-accent uppercase">
          x2
        </div>
      ) : null}
    </div>
  );
}
