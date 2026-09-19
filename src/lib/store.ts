import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  CATEGORIES,
  DEFAULT_HOTKEYS,
  DEFAULT_LAYOUT,
  OPEN_MENU_DEFAULT,
  type CategoryId,
} from "./menu-catalog";
import type { PerkId } from "./perks";
import { PERK_BY_ID } from "./perks";
import type { WeaponId } from "./weapons";
import { WEAPON_BY_ID, WEAPONS } from "./weapons";
import { sfx } from "./game/sfx";

export type Phase = "boot" | "playing" | "down" | "over";

export type Zombie = {
  id: number;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  speed: number;
  angle: number;
  crawl: boolean;
};

export type Pickup = {
  id: number;
  x: number;
  y: number;
  kind: "nuke" | "insta" | "double" | "ammo" | "carpenter" | "sale";
  life: number;
};

export type Tracer = { x: number; y: number; tx: number; ty: number; life: number };
export type Bit = { x: number; y: number; vx: number; vy: number; life: number; color: string; r: number };
export type Pop = { x: number; y: number; text: string; life: number };

export type TeleportPad = { id: string; label: string; x: number; y: number };

export const PADS: TeleportPad[] = [
  { id: "tpDiner", label: "Diner", x: 220, y: 180 },
  { id: "tpFarm", label: "Farm", x: 620, y: 140 },
  { id: "tpTown", label: "Town", x: 700, y: 420 },
  { id: "tpPower", label: "Power", x: 160, y: 460 },
  { id: "tpNacht", label: "Nacht", x: 430, y: 80 },
  { id: "tpPap", label: "PaP", x: 430, y: 300 },
];

export const BLOCKS = [
  { x: 168, y: 128, w: 108, h: 68 },
  { x: 548, y: 88, w: 128, h: 86 },
  { x: 622, y: 352, w: 148, h: 96 },
  { x: 78, y: 372, w: 118, h: 90 },
  { x: 368, y: 36, w: 96, h: 58 },
];

export type Settings = {
  hotkeys: Record<string, string>;
  openMenuKey: string;
  layout: Record<CategoryId, string[]>;
  freezeOnMenu: boolean;
  menuX: number;
  menuY: number;
  titleColor: string;
  highlightColor: string;
  textColor: string;
  bgAlpha: number;
};

export type Match = {
  phase: Phase;
  round: number;
  points: number;
  kills: number;
  downs: number;
  headshots: number;
  health: number;
  maxHealth: number;
  x: number;
  y: number;
  angle: number;
  speedMul: number;
  fov: number;
  thirdPerson: boolean;
  weaponId: WeaponId;
  mag: number;
  stock: number;
  perks: PerkId[];
  perkLimit: number;
  keepPerksOnDown: boolean;
  godMode: boolean;
  infiniteAmmo: boolean;
  autoRevive: boolean;
  noTarget: boolean;
  deadshotLock: boolean;
  rapidFire: boolean;
  superMelee: boolean;
  unlimitedSprint: boolean;
  healthBar: boolean;
  zombieCounter: boolean;
  freezeZombies: boolean;
  noSpawns: boolean;
  lowHealthZ: boolean;
  instaKill: boolean;
  doublePoints: boolean;
  fireSale: boolean;
  timescale: number;
  doorsOpen: boolean;
  allBoxWeapons: boolean;
  noclip: boolean;
  ufoMode: boolean;
  hasSavedPos: boolean;
  savedX: number;
  savedY: number;
  zombieHpScale: number;
  zombieSpeedMul: number;
  powerOn: boolean;
  visionNight: boolean;
  notifyFlash: number;
  zombies: Zombie[];
  pickups: Pickup[];
  tracers: Tracer[];
  bits: Bit[];
  pops: Pop[];
  walkT: number;
  moving: boolean;
  hitstop: number;
  trauma: number;
  shake: number;
  roundBanner: number;
  lastFire: number;
  nextId: number;
  seed: number;
  demoPlaying: boolean;
};

export type StudioSlice = {
  menuOpen: boolean;
  category: CategoryId;
  cursor: number;
  log: string[];
  stamp: number;
  settings: Settings;
  setMenuOpen: (v: boolean) => void;
  setCategory: (id: CategoryId) => void;
  setCursor: (n: number) => void;
  pushLog: (line: string) => void;
  setHotkey: (itemId: string, key: string) => void;
  setOpenMenuKey: (key: string) => void;
  moveItem: (category: CategoryId, index: number, dir: -1 | 1) => void;
  resetLayout: () => void;
  resetHotkeys: () => void;
  patchSettings: (p: Partial<Settings>) => void;
};

export type MatchSlice = {
  match: Match;
  resetMatch: () => void;
  applyItem: (id: string, extra?: string | number) => void;
  tick: (dt: number, input: InputFrame) => void;
  setDemoPlaying: (v: boolean) => void;
};

export type InputFrame = {
  ax: number;
  ay: number;
  aimX: number;
  aimY: number;
  fire: boolean;
  melee: boolean;
};

const WORLD_W = 860;
const WORLD_H = 540;

function juiceArrays() {
  return { tracers: [] as Tracer[], bits: [] as Bit[], pops: [] as Pop[] };
}

function freshMatch(): Match {
  const w = WEAPON_BY_ID.m1911_zm;
  return {
    phase: "boot",
    round: 1,
    points: 500,
    kills: 0,
    downs: 0,
    headshots: 0,
    health: 150,
    maxHealth: 150,
    x: 430,
    y: 300,
    angle: 0,
    speedMul: 1,
    fov: 80,
    thirdPerson: false,
    weaponId: "m1911_zm",
    mag: w.mag,
    stock: w.stock,
    perks: [],
    perkLimit: 4,
    keepPerksOnDown: false,
    godMode: false,
    infiniteAmmo: false,
    autoRevive: true,
    noTarget: false,
    deadshotLock: false,
    rapidFire: false,
    superMelee: false,
    unlimitedSprint: false,
    healthBar: true,
    zombieCounter: true,
    freezeZombies: false,
    noSpawns: false,
    lowHealthZ: false,
    instaKill: false,
    doublePoints: false,
    fireSale: false,
    timescale: 1,
    doorsOpen: false,
    allBoxWeapons: false,
    noclip: false,
    ufoMode: false,
    hasSavedPos: false,
    savedX: 430,
    savedY: 300,
    zombieHpScale: 1,
    zombieSpeedMul: 1,
    powerOn: false,
    visionNight: false,
    notifyFlash: 0,
    zombies: [],
    pickups: [],
    ...juiceArrays(),
    walkT: 0,
    moving: false,
    hitstop: 0,
    trauma: 0,
    shake: 0,
    roundBanner: 2.2,
    lastFire: 0,
    nextId: 1,
    seed: 115,
    demoPlaying: false,
  };
}

function zombieHp(round: number, low: boolean) {
  const base = 150 + round * 90;
  return low ? Math.max(20, Math.floor(base * 0.12)) : base;
}

function spawnWave(m: Match, count: number) {
  for (let i = 0; i < count; i++) {
    const edge = (m.seed + m.nextId + i) % 4;
    let x = 40;
    let y = 40;
    if (edge === 0) {
      x = 40 + ((m.nextId * 47) % (WORLD_W - 80));
      y = 24;
    } else if (edge === 1) {
      x = WORLD_W - 24;
      y = 40 + ((m.nextId * 61) % (WORLD_H - 80));
    } else if (edge === 2) {
      x = 40 + ((m.nextId * 53) % (WORLD_W - 80));
      y = WORLD_H - 24;
    } else {
      x = 24;
      y = 40 + ((m.nextId * 43) % (WORLD_H - 80));
    }
    const hp = Math.max(8, Math.floor(zombieHp(m.round, m.lowHealthZ) * m.zombieHpScale));
    m.zombies.push({
      id: m.nextId++,
      x,
      y,
      hp,
      maxHp: hp,
      speed: (42 + Math.min(70, m.round * 4)) * m.zombieSpeedMul,
      angle: 0,
      crawl: false,
    });
  }
}

function startRound(m: Match, round: number) {
  m.round = round;
  m.roundBanner = 2.4;
  m.zombies = [];
  if (!m.noSpawns) spawnWave(m, Math.min(28, 5 + round * 2));
}

function grantWeapon(m: Match, id: WeaponId) {
  const w = WEAPON_BY_ID[id];
  if (!w) return;
  m.weaponId = id;
  m.mag = w.mag || 30;
  m.stock = w.stock || 180;
}

function dist(ax: number, ay: number, bx: number, by: number) {
  const dx = ax - bx;
  const dy = ay - by;
  return Math.hypot(dx, dy);
}

function nearestZombie(m: Match) {
  let best: Zombie | null = null;
  let bestD = 1e9;
  for (const z of m.zombies) {
    const d = dist(m.x, m.y, z.x, z.y);
    if (d < bestD) {
      bestD = d;
      best = z;
    }
  }
  return best;
}

function burst(m: Match, x: number, y: number, n: number, color: string) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = 40 + Math.random() * 90;
    m.bits.push({
      x,
      y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      life: 0.45 + Math.random() * 0.35,
      color,
      r: 1.5 + Math.random() * 2,
    });
  }
}

function killZombie(m: Match, z: Zombie, headshot: boolean, silent = false) {
  m.zombies = m.zombies.filter((x) => x.id !== z.id);
  m.kills += 1;
  if (headshot) m.headshots += 1;
  const pts = (headshot ? 100 : 60) * (m.doublePoints ? 2 : 1);
  m.points += pts;
  m.pops.push({ x: z.x, y: z.y, text: `+${pts}`, life: 0.7 });
  m.trauma = Math.min(1, m.trauma + (silent ? 0.08 : 0.28));
  m.hitstop = Math.max(m.hitstop, silent ? 0 : 0.045);
  burst(m, z.x, z.y, silent ? 4 : 10, "#8a3d35");
  if (!silent) sfx.kill();
  if (Math.random() < 0.08) {
    const kinds: Pickup["kind"][] = ["nuke", "insta", "double", "ammo", "carpenter", "sale"];
    m.pickups.push({
      id: m.nextId++,
      x: z.x,
      y: z.y,
      kind: kinds[Math.floor(Math.random() * kinds.length)]!,
      life: 12,
    });
  }
}

function applyPickup(m: Match, p: Pickup) {
  sfx.pickup();
  if (p.kind === "nuke") {
    for (const z of [...m.zombies]) killZombie(m, z, false, true);
    if (m.kills) sfx.kill();
    m.trauma = 1;
  } else if (p.kind === "insta") m.instaKill = true;
  else if (p.kind === "double") m.doublePoints = true;
  else if (p.kind === "ammo") {
    const w = WEAPON_BY_ID[m.weaponId];
    m.mag = w.mag || m.mag;
    m.stock = w.stock || 200;
  } else if (p.kind === "carpenter") m.doorsOpen = true;
  else if (p.kind === "sale") m.fireSale = true;
}

function fireAt(m: Match, now: number) {
  const w = WEAPON_BY_ID[m.weaponId];
  const interval = (w.fireMs / 1000) * (m.rapidFire ? 0.42 : 1) * (m.perks.includes("double_tap") ? 0.72 : 1);
  if (now - m.lastFire < interval) return;
  if (!m.infiniteAmmo) {
    if (m.mag <= 0) {
      if (m.stock <= 0) return;
      const need = w.mag || 8;
      const take = Math.min(need, m.stock);
      m.mag = take;
      m.stock -= take;
      m.lastFire = now + 0.35;
      return;
    }
    m.mag -= 1;
  }
  m.lastFire = now;
  m.trauma = Math.min(1, m.trauma + 0.12);
  sfx.fire();

  const range = 340;
  const aimX = m.x + Math.cos(m.angle) * range;
  const aimY = m.y + Math.sin(m.angle) * range;
  let hit: Zombie | null = null;
  let hitD = range;
  for (const z of m.zombies) {
    const dx = z.x - m.x;
    const dy = z.y - m.y;
    const d = Math.hypot(dx, dy);
    if (d > range || d < 1) continue;
    const ang = Math.atan2(dy, dx);
    let da = Math.abs(ang - m.angle);
    while (da > Math.PI) da = Math.abs(da - Math.PI * 2);
    const spread = w.spread * (m.perks.includes("deadshot") || m.deadshotLock ? 0.2 : 1);
    if (da < 0.18 + spread && d < hitD) {
      hit = z;
      hitD = d;
    }
  }
  m.tracers.push({
    x: m.x + Math.cos(m.angle) * 14,
    y: m.y + Math.sin(m.angle) * 14,
    tx: hit ? hit.x : aimX,
    ty: hit ? hit.y : aimY,
    life: 0.12,
  });
  if (!hit) return;
  sfx.hit();
  const headshot = Math.abs(Math.atan2(hit.y - m.y, hit.x - m.x) - m.angle) < 0.05;
  const dmg = m.instaKill ? hit.hp : w.damage * (m.perks.includes("double_tap") ? 1.35 : 1);
  hit.hp -= dmg;
  m.points += 10 * (m.doublePoints ? 2 : 1);
  burst(m, hit.x, hit.y, 4, "#8a3d35");
  if (hit.hp <= 0) killZombie(m, hit, headshot);
}

function resolveBlocks(m: Match, px: number, py: number) {
  const r = 12;
  const extra = m.doorsOpen
    ? []
    : [
        { x: 296, y: 176, w: 8, h: 78 },
        { x: 516, y: 316, w: 88, h: 8 },
      ];
  for (const b of [...BLOCKS, ...extra]) {
    const nx = Math.max(b.x, Math.min(m.x, b.x + b.w));
    const ny = Math.max(b.y, Math.min(m.y, b.y + b.h));
    const dx = m.x - nx;
    const dy = m.y - ny;
    const d = Math.hypot(dx, dy);
    if (d < r && d > 0.001) {
      const push = (r - d) / d;
      m.x += dx * push;
      m.y += dy * push;
    } else if (d === 0) {
      m.x = px;
      m.y = py;
    }
  }
}

function mergeLayout(saved?: Record<CategoryId, string[]>) {
  const out = structuredClone(DEFAULT_LAYOUT);
  if (!saved) return out;
  for (const cat of CATEGORIES) {
    const ids = saved[cat.id];
    if (!ids) continue;
    const known = new Set(out[cat.id]);
    const ordered = ids.filter((id) => known.has(id));
    const missing = out[cat.id].filter((id) => !ordered.includes(id));
    out[cat.id] = [...ordered, ...missing];
  }
  return out;
}

export const useForge = create<MatchSlice & StudioSlice>()(
  persist(
    (set, get) => ({
      menuOpen: false,
      category: "combat",
      cursor: 0,
      log: ["FORGE 115 ready. F4 opens the overlay."],
      stamp: 0,
      settings: {
        hotkeys: { ...DEFAULT_HOTKEYS },
        openMenuKey: OPEN_MENU_DEFAULT,
        layout: structuredClone(DEFAULT_LAYOUT),
        freezeOnMenu: true,
        menuX: 18,
        menuY: 72,
        titleColor: "#6f9e5a",
        highlightColor: "#6f9e5a",
        textColor: "#e6e1d3",
        bgAlpha: 0.88,
      },
      match: freshMatch(),
      setMenuOpen: (v) => {
        sfx.menu();
        set({ menuOpen: v });
      },
      setCategory: (id) => set({ category: id, cursor: 0 }),
      setCursor: (n) => set({ cursor: n }),
      pushLog: (line) =>
        set((s) => ({ log: [line, ...s.log].slice(0, 18) })),
      setHotkey: (itemId, key) =>
        set((s) => ({
          settings: { ...s.settings, hotkeys: { ...s.settings.hotkeys, [itemId]: key } },
        })),
      setOpenMenuKey: (key) => set((s) => ({ settings: { ...s.settings, openMenuKey: key } })),
      moveItem: (category, index, dir) =>
        set((s) => {
          const list = [...s.settings.layout[category]];
          const j = index + dir;
          if (j < 0 || j >= list.length) return s;
          const tmp = list[index]!;
          list[index] = list[j]!;
          list[j] = tmp;
          return { settings: { ...s.settings, layout: { ...s.settings.layout, [category]: list } } };
        }),
      resetLayout: () =>
        set((s) => ({ settings: { ...s.settings, layout: structuredClone(DEFAULT_LAYOUT) } })),
      resetHotkeys: () =>
        set((s) => ({
          settings: { ...s.settings, hotkeys: { ...DEFAULT_HOTKEYS }, openMenuKey: OPEN_MENU_DEFAULT },
        })),
      patchSettings: (p) => set((s) => ({ settings: { ...s.settings, ...p } })),
      resetMatch: () => {
        const m = freshMatch();
        m.phase = "playing";
        startRound(m, 1);
        set({ match: m, menuOpen: false, stamp: get().stamp + 1 });
        get().pushLog("Match started — Green Run.");
      },
      setDemoPlaying: (v) => set((s) => ({ match: { ...s.match, demoPlaying: v } })),
      applyItem: (id, extra) => {
        const s = get();
        const m = {
          ...s.match,
          zombies: [...s.match.zombies],
          pickups: [...s.match.pickups],
          perks: [...s.match.perks],
          tracers: [...s.match.tracers],
          bits: [...s.match.bits],
          pops: [...s.match.pops],
        };
        const note = (line: string) => {
          sfx.toggle();
          get().pushLog(line);
        };

        if (id === "godMode") {
          m.godMode = !m.godMode;
          note(`God Mode ${m.godMode ? "ON" : "OFF"}`);
        } else if (id === "infiniteAmmo") {
          m.infiniteAmmo = !m.infiniteAmmo;
          note(`Infinite Ammo ${m.infiniteAmmo ? "ON" : "OFF"}`);
        } else if (id === "autoRevive") {
          m.autoRevive = !m.autoRevive;
          note(`Auto Revive ${m.autoRevive ? "ON" : "OFF"}`);
        } else if (id === "noTarget") {
          m.noTarget = !m.noTarget;
          note(`No Target ${m.noTarget ? "ON" : "OFF"}`);
        } else if (id === "deadshotLock") {
          m.deadshotLock = !m.deadshotLock;
          note(`Deadshot Lock ${m.deadshotLock ? "ON" : "OFF"}`);
        } else if (id === "rapidFire") {
          m.rapidFire = !m.rapidFire;
          note(`Rapid Fire ${m.rapidFire ? "ON" : "OFF"}`);
        } else if (id === "superMelee") {
          m.superMelee = !m.superMelee;
          note(`Super Melee ${m.superMelee ? "ON" : "OFF"}`);
        } else if (id === "giveWeapon") {
          const wid = (typeof extra === "string" ? extra : "ray_gun_zm") as WeaponId;
          grantWeapon(m, WEAPON_BY_ID[wid] ? wid : "ray_gun_zm");
          note(`Gave ${WEAPON_BY_ID[m.weaponId].name}`);
        } else if (id === "packAPunch") {
          const cur = WEAPON_BY_ID[m.weaponId];
          const pap =
            m.weaponId === "ray_gun_zm"
              ? WEAPON_BY_ID.ray_gun_upgraded_zm
              : (WEAPONS.find((w) => w.pap && w.id !== m.weaponId) ?? WEAPON_BY_ID.ray_gun_upgraded_zm);
          grantWeapon(m, pap.id);
          note(`Packed ${cur.name} → ${pap.name}`);
        } else if (id === "maxAmmo") {
          const w = WEAPON_BY_ID[m.weaponId];
          m.mag = w.mag || 30;
          m.stock = w.stock || 200;
          note("Max ammo.");
        } else if (id === "dropWeapon") {
          grantWeapon(m, "m1911_zm");
          note("Dropped to M1911.");
        } else if (id === "allBoxWeapons") {
          m.allBoxWeapons = !m.allBoxWeapons;
          note(`Box weapons ${m.allBoxWeapons ? "unlocked" : "default"}`);
        } else if (id === "add500") {
          m.points += 500;
          note("+500 points");
        } else if (id === "add5000") {
          m.points += 5000;
          note("+5,000 points");
        } else if (id === "add100000") {
          m.points += 100000;
          note("+100,000 points");
        } else if (id === "set0") {
          m.points = 0;
          note("Points set to 0");
        } else if (id === "setMaxPoints") {
          m.points = 1_000_000;
          note("Points set to 1,000,000");
        } else if (id === "skipRound" || id === "endRoundWait") {
          for (const z of [...m.zombies]) killZombie(m, z, false, true);
          startRound(m, m.round + 1);
          note(`Round ${m.round}`);
        } else if (id === "setRound") {
          const r = Math.max(1, Math.min(255, Number(extra) || m.round));
          for (const z of [...m.zombies]) killZombie(m, z, false, true);
          startRound(m, r);
          note(`Round set to ${r}`);
        } else if (id === "givePerk") {
          const pid = (typeof extra === "string" ? extra : "juggernog") as PerkId;
          if (!PERK_BY_ID[pid]) return;
          if (!m.perks.includes(pid) && m.perks.length < m.perkLimit) {
            m.perks = [...m.perks, pid];
            if (pid === "juggernog") {
              m.maxHealth = Math.max(m.maxHealth, 250);
              m.health = m.maxHealth;
            }
            note(`Perk: ${PERK_BY_ID[pid].name}`);
          } else note("Perk limit reached.");
        } else if (id === "giveAllPerks") {
          m.perkLimit = 12;
          m.perks = Object.keys(PERK_BY_ID) as PerkId[];
          m.maxHealth = 250;
          m.health = 250;
          note("All perks granted.");
        } else if (id === "removePerks") {
          m.perks = [];
          note("Perks cleared.");
        } else if (id === "keepPerksOnDown") {
          m.keepPerksOnDown = !m.keepPerksOnDown;
          note(`Keep perks ${m.keepPerksOnDown ? "ON" : "OFF"}`);
        } else if (id === "perkLimit") {
          m.perkLimit = Math.max(1, Number(extra) || 4);
        } else if (id === "moveSpeed") {
          m.speedMul = Number(extra) || 1;
        } else if (id === "maxHealth") {
          m.maxHealth = Number(extra) || 150;
          m.health = Math.min(m.health, m.maxHealth);
        } else if (id === "fov") {
          m.fov = Number(extra) || 80;
        } else if (id === "thirdPerson") {
          m.thirdPerson = !m.thirdPerson;
          note(`Third person ${m.thirdPerson ? "ON" : "OFF"}`);
        } else if (id === "unlimitedSprint") {
          m.unlimitedSprint = !m.unlimitedSprint;
        } else if (id === "healthBar") {
          m.healthBar = !m.healthBar;
        } else if (id === "timescale") {
          m.timescale = Number(extra) || 1;
          note(`Timescale ${m.timescale.toFixed(2)}x`);
        } else if (id === "openDoors") {
          m.doorsOpen = true;
          note("All doors open.");
        } else if (id === "restartMap") {
          get().resetMatch();
          return;
        } else if (id === "endGame") {
          m.phase = "over";
          note("Game ended.");
        } else if (id === "zombieCounter") {
          m.zombieCounter = !m.zombieCounter;
        } else if (id === "killAll") {
          const n = m.zombies.length;
          for (const z of [...m.zombies]) killZombie(m, z, false, true);
          if (n) sfx.kill();
          note(`Killed ${n} zombies.`);
        } else if (id === "freezeZombies") {
          m.freezeZombies = !m.freezeZombies;
          note(`Freeze ${m.freezeZombies ? "ON" : "OFF"}`);
        } else if (id === "noSpawns") {
          m.noSpawns = !m.noSpawns;
        } else if (id === "lowHealthZ") {
          m.lowHealthZ = !m.lowHealthZ;
        } else if (id === "spawnZombie") {
          spawnWave(m, 1);
          note("Spawned 1 zombie.");
        } else if (id === "instaKill") {
          m.instaKill = !m.instaKill;
          note(`Insta-Kill ${m.instaKill ? "ON" : "OFF"}`);
        } else if (id === "doublePoints") {
          m.doublePoints = !m.doublePoints;
        } else if (id === "fireSale") {
          m.fireSale = !m.fireSale;
        } else if (id === "nukeDrop") {
          applyPickup(m, { id: 0, x: m.x, y: m.y, kind: "nuke", life: 1 });
          note("Nuke.");
        } else if (id === "carpenter") {
          m.doorsOpen = true;
          note("Carpenter.");
        } else if (id === "rainPowerups") {
          const kinds: Pickup["kind"][] = ["nuke", "insta", "double", "ammo", "carpenter", "sale"];
          for (let i = 0; i < 6; i++) {
            m.pickups.push({
              id: m.nextId++,
              x: 80 + Math.random() * (WORLD_W - 160),
              y: 80 + Math.random() * (WORLD_H - 160),
              kind: kinds[i]!,
              life: 16,
            });
          }
          note("Powerups rained.");
        } else if (id.startsWith("tp")) {
          const pad = PADS.find((p) => p.id === id);
          if (pad) {
            m.x = pad.x;
            m.y = pad.y;
            note(`Teleported: ${pad.label}`);
          }
        } else if (id === "noclip") {
          m.noclip = !m.noclip;
          if (m.noclip) m.ufoMode = false;
          note(`Noclip ${m.noclip ? "ON" : "OFF"}`);
        } else if (id === "ufoMode") {
          m.ufoMode = !m.ufoMode;
          if (m.ufoMode) m.noclip = true;
          else m.noclip = false;
          note(`UFO ${m.ufoMode ? "ON" : "OFF"}`);
        } else if (id === "savePos") {
          m.savedX = m.x;
          m.savedY = m.y;
          m.hasSavedPos = true;
          note(`Saved ${Math.round(m.x)}, ${Math.round(m.y)}`);
        } else if (id === "loadPos") {
          if (m.hasSavedPos) {
            m.x = m.savedX;
            m.y = m.savedY;
            note("Loaded origin.");
          } else note("No saved origin.");
        } else if (id === "zombieHpScale") {
          m.zombieHpScale = Number(extra) || 1;
          for (const z of m.zombies) {
            const ratio = z.maxHp > 0 ? z.hp / z.maxHp : 1;
            z.maxHp = Math.max(8, Math.floor(zombieHp(m.round, m.lowHealthZ) * m.zombieHpScale));
            z.hp = Math.max(1, Math.floor(z.maxHp * ratio));
          }
          note(`Zombie HP ×${m.zombieHpScale.toFixed(1)}`);
        } else if (id === "zombieSpeed") {
          m.zombieSpeedMul = Number(extra) || 1;
          for (const z of m.zombies) z.speed = (42 + Math.min(70, m.round * 4)) * m.zombieSpeedMul;
          note(`Zombie speed ×${m.zombieSpeedMul.toFixed(2)}`);
        } else if (id === "powerOn") {
          m.powerOn = true;
          m.doorsOpen = true;
          note("Power on. Doors open.");
        } else if (id === "weaponKit") {
          grantWeapon(m, "ray_gun_zm");
          m.points += 5000;
          note("Kit: Ray Gun + 5,000.");
        } else if (id === "visionNight") {
          m.visionNight = !m.visionNight;
          note(`Vision ${m.visionNight ? "night" : "transit"}`);
        } else if (id === "boxCycle") {
          const idx = WEAPONS.findIndex((w) => w.id === m.weaponId);
          const nextW = WEAPONS[(idx + 1) % WEAPONS.length]!;
          grantWeapon(m, nextW.id);
          note(`Box: ${nextW.name}`);
        } else if (id === "notifyPulse") {
          m.notifyFlash = 1.2;
          m.pops.push({ x: m.x, y: m.y - 18, text: "forge_cmd", life: 1.1 });
          note("level notify forge_cmd");
        } else if (id === "hostGate") {
          note("isHost() — this studio match is host.");
        } else {
          note("Reserved for future co-op / MP.");
          set({ match: m, stamp: get().stamp + 1 });
          return;
        }
        set({ match: m, stamp: get().stamp + 1 });
      },
      tick: (dt, input) => {
        const s = get();
        const m = s.match;
        if (m.phase !== "playing") return;
        const frozen = s.menuOpen && s.settings.freezeOnMenu;
        const next: Match = {
          ...m,
          zombies: m.zombies.map((z) => ({ ...z })),
          pickups: m.pickups.map((p) => ({ ...p })),
          perks: [...m.perks],
          tracers: m.tracers.map((t) => ({ ...t })),
          bits: m.bits.map((b) => ({ ...b })),
          pops: m.pops.map((p) => ({ ...p })),
        };

        if (next.hitstop > 0) {
          next.hitstop = Math.max(0, next.hitstop - dt);
          next.trauma = Math.max(0, next.trauma - dt * 1.8);
          next.shake = next.trauma;
          set({ match: next });
          return;
        }

        const t = dt * next.timescale;

        if (!frozen) {
          const sprint = m.unlimitedSprint ? 1.35 : 1;
          const fly = m.ufoMode ? 2.15 : 1;
          const base = 168 * m.speedMul * sprint * fly * (m.perks.includes("stamin_up") ? 1.2 : 1);
          const px = next.x;
          const py = next.y;
          next.x = Math.max(24, Math.min(WORLD_W - 24, next.x + input.ax * base * t));
          next.y = Math.max(24, Math.min(WORLD_H - 24, next.y + input.ay * base * t));
          if (!next.noclip && !next.ufoMode) resolveBlocks(next, px, py);
          next.moving = Math.abs(input.ax) + Math.abs(input.ay) > 0.12;
          next.walkT = next.moving ? next.walkT + t : 0;
          let ang = Math.atan2(input.aimY - next.y, input.aimX - next.x);
          if (next.deadshotLock) {
            const nz = nearestZombie(next);
            if (nz) ang = Math.atan2(nz.y - next.y, nz.x - next.x);
          }
          next.angle = ang;
          if (input.fire) fireAt(next, performance.now() / 1000);
          if (input.melee) {
            const reach = next.superMelee ? 96 : 42;
            for (const z of [...next.zombies]) {
              if (dist(next.x, next.y, z.x, z.y) < reach) killZombie(next, z, false);
            }
          }
        } else {
          next.moving = false;
        }

        if (!next.freezeZombies && !frozen) {
          for (const z of next.zombies) {
            if (next.noTarget) continue;
            const dx = next.x - z.x;
            const dy = next.y - z.y;
            const d = Math.hypot(dx, dy) || 1;
            z.angle = Math.atan2(dy, dx);
            const sp = z.speed * (z.crawl ? 0.45 : 1);
            z.x += (dx / d) * sp * t;
            z.y += (dy / d) * sp * t;
            if (d < 18 && !next.godMode) {
              next.health -= 28 * t * 8;
              next.trauma = Math.min(1, next.trauma + 0.2);
            }
          }
        }

        next.pickups = next.pickups
          .map((p) => ({ ...p, life: p.life - t }))
          .filter((p) => p.life > 0);
        for (const p of [...next.pickups]) {
          if (dist(next.x, next.y, p.x, p.y) < 22) {
            applyPickup(next, p);
            next.pickups = next.pickups.filter((x) => x.id !== p.id);
          }
        }

        next.tracers = next.tracers
          .map((tr) => ({ ...tr, life: tr.life - t }))
          .filter((tr) => tr.life > 0);
        next.bits = next.bits
          .map((b) => ({ ...b, x: b.x + b.vx * t, y: b.y + b.vy * t, life: b.life - t, vy: b.vy + 80 * t }))
          .filter((b) => b.life > 0);
        next.pops = next.pops
          .map((p) => ({ ...p, y: p.y - 22 * t, life: p.life - t }))
          .filter((p) => p.life > 0);

        if (next.health <= 0) {
          next.downs += 1;
          sfx.down();
          if (next.autoRevive) {
            next.health = next.maxHealth;
            if (!next.keepPerksOnDown) next.perks = [];
            next.x = 430;
            next.y = 300;
            get().pushLog("Auto-revived.");
          } else {
            next.phase = "down";
            next.health = 0;
          }
        }

        if (next.zombies.length === 0 && !next.noSpawns && next.phase === "playing") {
          startRound(next, next.round + 1);
        }

        next.trauma = Math.max(0, next.trauma - t * 1.6);
        next.shake = next.trauma;
        next.roundBanner = Math.max(0, next.roundBanner - t);
        next.notifyFlash = Math.max(0, next.notifyFlash - t);
        set({ match: next });
      },
    }),
    {
      name: "forge115-settings",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      partialize: (s) => ({ settings: s.settings }),
      skipHydration: true,
      merge: (persisted, current) => {
        const p = persisted as { settings?: Settings } | undefined;
        return {
          ...current,
          settings: {
            ...current.settings,
            ...p?.settings,
            hotkeys: { ...DEFAULT_HOTKEYS, ...p?.settings?.hotkeys },
            layout: mergeLayout(p?.settings?.layout),
          },
        };
      },
    },
  ),
);

export const WORLD = { w: WORLD_W, h: WORLD_H };

export function itemsInCategory(cat: CategoryId) {
  const layout = useForge.getState().settings.layout[cat] ?? DEFAULT_LAYOUT[cat];
  return layout;
}

export function exportStudioConfig() {
  const s = useForge.getState().settings;
  return JSON.stringify(
    {
      version: 1,
      openMenuKey: s.openMenuKey,
      freezeOnMenu: s.freezeOnMenu,
      hotkeys: s.hotkeys,
      layout: s.layout,
      menuX: s.menuX,
      menuY: s.menuY,
      bgAlpha: s.bgAlpha,
      titleColor: s.titleColor,
      highlightColor: s.highlightColor,
      textColor: s.textColor,
    },
    null,
    2,
  );
}

export { CATEGORIES };
