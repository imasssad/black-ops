import { CATEGORIES, ITEM_BY_ID, type CategoryId } from "@/lib/menu-catalog";
import { useForge } from "@/lib/store";
import { WEAPON_BY_ID, type WeaponId } from "@/lib/weapons";
import { PERK_BY_ID, type PerkId } from "@/lib/perks";
import { cn } from "@/lib/utils";

function toggleValue(id: string): boolean | number | string | undefined {
  const m = useForge.getState().match;
  switch (id) {
    case "godMode":
      return m.godMode;
    case "infiniteAmmo":
      return m.infiniteAmmo;
    case "autoRevive":
      return m.autoRevive;
    case "noTarget":
      return m.noTarget;
    case "deadshotLock":
      return m.deadshotLock;
    case "rapidFire":
      return m.rapidFire;
    case "superMelee":
      return m.superMelee;
    case "allBoxWeapons":
      return m.allBoxWeapons;
    case "keepPerksOnDown":
      return m.keepPerksOnDown;
    case "thirdPerson":
      return m.thirdPerson;
    case "unlimitedSprint":
      return m.unlimitedSprint;
    case "healthBar":
      return m.healthBar;
    case "zombieCounter":
      return m.zombieCounter;
    case "freezeZombies":
      return m.freezeZombies;
    case "noSpawns":
      return m.noSpawns;
    case "lowHealthZ":
      return m.lowHealthZ;
    case "instaKill":
      return m.instaKill;
    case "doublePoints":
      return m.doublePoints;
    case "fireSale":
      return m.fireSale;
    case "setRound":
      return m.round;
    case "moveSpeed":
      return m.speedMul;
    case "maxHealth":
      return m.maxHealth;
    case "fov":
      return m.fov;
    case "timescale":
      return m.timescale;
    case "perkLimit":
      return m.perkLimit;
    case "giveWeapon":
      return WEAPON_BY_ID[m.weaponId].name;
    case "noclip":
      return m.noclip;
    case "ufoMode":
      return m.ufoMode;
    case "visionNight":
      return m.visionNight;
    case "zombieHpScale":
      return m.zombieHpScale;
    case "zombieSpeed":
      return m.zombieSpeedMul;
    default:
      return undefined;
  }
}

export function ModMenu() {
  const open = useForge((s) => s.menuOpen);
  const category = useForge((s) => s.category);
  const cursor = useForge((s) => s.cursor);
  const settings = useForge((s) => s.settings);
  useForge((s) => s.stamp);
  const layout = settings.layout[category];
  const catIndex = CATEGORIES.findIndex((c) => c.id === category);

  if (!open) return null;

  const itemId = layout[cursor];
  const item = itemId ? ITEM_BY_ID[itemId] : undefined;

  return (
    <div
      className="absolute z-20 w-[min(92vw,292px)] overflow-hidden border border-border shadow-[0_18px_40px_rgb(0_0_0_/_0.55)]"
      style={{
        left: `max(12px, ${settings.menuX}px)`,
        top: `max(56px, ${settings.menuY}px)`,
        background: `rgb(12 13 11 / ${settings.bgAlpha})`,
        animation: "menu-enter 250ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      role="dialog"
      aria-label="FORGE 115 overlay"
    >
      <div className="flex items-end justify-between border-b border-accent/30 bg-accent/10 px-3 py-2">
        <div>
          <div className="font-display text-2xl leading-none" style={{ color: settings.titleColor }}>
            FORGE 115
          </div>
          <div className="mt-0.5 font-mono text-[10px] tracking-[0.22em] text-muted">
            {CATEGORIES[catIndex]?.tag} · HOST
          </div>
        </div>
        <div className="font-mono text-[10px] text-faint tabular-nums">
          {catIndex + 1}/{CATEGORIES.length}
        </div>
      </div>
      <div className="flex items-center justify-between px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
        <span className="text-accent">◄</span>
        <span>{CATEGORIES[catIndex]?.label}</span>
        <span className="text-accent">►</span>
      </div>
      <ul className="max-h-[min(52vh,340px)] overflow-y-auto py-1">
        {layout.map((id, i) => {
          const def = ITEM_BY_ID[id];
          if (!def) return null;
          const selected = i === cursor;
          const val = toggleValue(id);
          const shown =
            def.placeholder
              ? "MP"
              : def.kind === "toggle"
                ? val
                  ? "ON"
                  : "OFF"
                : def.kind === "slider"
                  ? String(val ?? "")
                  : def.kind === "list"
                    ? String(val ?? ">")
                    : "";
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => {
                  useForge.getState().setCursor(i);
                  activate(def.id);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm",
                  selected ? "bg-accent/15" : "hover:bg-surface",
                )}
                style={{
                  color: selected ? settings.highlightColor : settings.textColor,
                  opacity: def.placeholder ? 0.45 : 1,
                  boxShadow: selected ? "inset 2px 0 0 var(--color-accent)" : undefined,
                }}
              >
                <span className="font-mono text-[13px]">{selected ? "> " : "  "}{def.label}</span>
                <span className="font-mono text-[11px] text-muted tabular-nums">
                  {shown ? `[${shown}]` : ""}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-border px-3 py-2 font-mono text-[10px] leading-relaxed text-muted">
        {item?.hint ?? "Up/Down select · Enter fire · Left/Right tab · Shift+Up reorder"}
      </div>
    </div>
  );
}

export function activate(id: string) {
  const def = ITEM_BY_ID[id];
  if (!def) return;
  if (def.placeholder) {
    useForge.getState().pushLog("MP placeholder — Zombies pass only.");
    return;
  }
  if (def.kind === "list") {
    if (id === "giveWeapon") {
      const m = useForge.getState().match;
      const keys = def.list!.map((x) => x.id);
      const i = keys.indexOf(m.weaponId);
      const next = keys[(i + 1) % keys.length] as WeaponId;
      useForge.getState().applyItem(id, next);
      return;
    }
    if (id === "givePerk") {
      const m = useForge.getState().match;
      const keys = def.list!.map((x) => x.id) as PerkId[];
      const next = keys.find((k) => !m.perks.includes(k)) ?? keys[0]!;
      useForge.getState().applyItem(id, next);
      return;
    }
  }
  if (def.kind === "slider") {
    const cur = toggleValue(id);
    const n = typeof cur === "number" ? cur : def.slider!.min;
    const stepped = Math.min(def.slider!.max, n + def.slider!.step);
    const wrap = stepped === n ? def.slider!.min : stepped;
    useForge.getState().applyItem(id, wrap);
    return;
  }
  useForge.getState().applyItem(id);
}

export function cycleCategory(dir: -1 | 1) {
  const s = useForge.getState();
  const i = CATEGORIES.findIndex((c) => c.id === s.category);
  const next = CATEGORIES[(i + dir + CATEGORIES.length) % CATEGORIES.length]!;
  s.setCategory(next.id as CategoryId);
}
