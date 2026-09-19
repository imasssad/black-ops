import type { PerkId } from "./perks";
import { PERKS } from "./perks";
import type { WeaponId } from "./weapons";
import { WEAPONS } from "./weapons";

export type CategoryId =
  | "combat"
  | "weapons"
  | "points"
  | "rounds"
  | "perks"
  | "player"
  | "match"
  | "zombies"
  | "powerups"
  | "teleport"
  | "advanced"
  | "account"
  | "host";

export type ItemKind = "toggle" | "action" | "slider" | "list";

export type MenuItemDef = {
  id: string;
  label: string;
  kind: ItemKind;
  category: CategoryId;
  hint?: string;
  hotkeyDefault?: string;
  placeholder?: boolean;
  list?: { id: string; label: string }[];
  slider?: { min: number; max: number; step: number };
};

export type CategoryDef = {
  id: CategoryId;
  label: string;
  tag: string;
  placeholder?: boolean;
};

export const CATEGORIES: CategoryDef[] = [
  { id: "combat", label: "COMBAT", tag: "01" },
  { id: "weapons", label: "WEAPONS", tag: "02" },
  { id: "points", label: "POINTS", tag: "03" },
  { id: "rounds", label: "ROUNDS", tag: "04" },
  { id: "perks", label: "PERKS", tag: "05" },
  { id: "player", label: "PLAYER", tag: "06" },
  { id: "match", label: "MATCH", tag: "07" },
  { id: "zombies", label: "ZOMBIES", tag: "08" },
  { id: "powerups", label: "POWERUPS", tag: "09" },
  { id: "teleport", label: "TELEPORT", tag: "10" },
  { id: "advanced", label: "ADVANCED", tag: "11" },
  { id: "account", label: "ACCOUNT", tag: "MP", placeholder: true },
  { id: "host", label: "HOST", tag: "MP", placeholder: true },
];

const weaponList = WEAPONS.map((w) => ({ id: w.id, label: w.name }));
const perkList = PERKS.map((p) => ({ id: p.id, label: p.name }));

export const MENU_ITEMS: MenuItemDef[] = [
  { id: "godMode", label: "God Mode", kind: "toggle", category: "combat", hint: "No health loss", hotkeyDefault: "F1" },
  { id: "infiniteAmmo", label: "Infinite Ammo", kind: "toggle", category: "combat", hint: "Clip never empties", hotkeyDefault: "F7" },
  { id: "autoRevive", label: "Auto Revive", kind: "toggle", category: "combat" },
  { id: "noTarget", label: "No Target", kind: "toggle", category: "combat", hint: "Zombies ignore you" },
  { id: "deadshotLock", label: "Deadshot Lock", kind: "toggle", category: "combat", hint: "Snap aim to nearest zombie" },
  { id: "rapidFire", label: "Rapid Fire", kind: "toggle", category: "combat" },
  { id: "superMelee", label: "Super Melee", kind: "toggle", category: "combat" },
  { id: "giveWeapon", label: "Give Weapon", kind: "list", category: "weapons", list: weaponList, hotkeyDefault: "F3" },
  { id: "packAPunch", label: "Pack-a-Punch Current", kind: "action", category: "weapons" },
  { id: "maxAmmo", label: "Max Ammo", kind: "action", category: "weapons" },
  { id: "dropWeapon", label: "Drop Current Weapon", kind: "action", category: "weapons" },
  { id: "allBoxWeapons", label: "All Weapons in Box", kind: "toggle", category: "weapons" },
  { id: "add500", label: "Add 500", kind: "action", category: "points" },
  { id: "add5000", label: "Add 5,000", kind: "action", category: "points", hotkeyDefault: "F6" },
  { id: "add100000", label: "Add 100,000", kind: "action", category: "points" },
  { id: "set0", label: "Set Points to 0", kind: "action", category: "points" },
  { id: "setMaxPoints", label: "Set Points to 1,000,000", kind: "action", category: "points" },
  { id: "skipRound", label: "Skip Round", kind: "action", category: "rounds", hotkeyDefault: "F5" },
  { id: "setRound", label: "Set Round", kind: "slider", category: "rounds", slider: { min: 1, max: 255, step: 1 } },
  { id: "endRoundWait", label: "End Round Wait", kind: "action", category: "rounds" },
  { id: "givePerk", label: "Give Perk", kind: "list", category: "perks", list: perkList },
  { id: "giveAllPerks", label: "Give All Perks", kind: "action", category: "perks" },
  { id: "removePerks", label: "Remove All Perks", kind: "action", category: "perks" },
  { id: "keepPerksOnDown", label: "Keep Perks on Down", kind: "toggle", category: "perks" },
  { id: "perkLimit", label: "Perk Limit", kind: "slider", category: "perks", slider: { min: 1, max: 12, step: 1 } },
  { id: "moveSpeed", label: "Movement Speed", kind: "slider", category: "player", slider: { min: 0.4, max: 2.4, step: 0.1 } },
  { id: "maxHealth", label: "Max Health", kind: "slider", category: "player", slider: { min: 100, max: 800, step: 50 } },
  { id: "fov", label: "Field of View", kind: "slider", category: "player", slider: { min: 65, max: 120, step: 1 } },
  { id: "thirdPerson", label: "Third Person", kind: "toggle", category: "player" },
  { id: "unlimitedSprint", label: "Unlimited Sprint", kind: "toggle", category: "player" },
  { id: "healthBar", label: "Health Bar", kind: "toggle", category: "player" },
  { id: "timescale", label: "Game Speed", kind: "slider", category: "match", slider: { min: 0.25, max: 3, step: 0.25 } },
  { id: "openDoors", label: "Open All Doors", kind: "action", category: "match" },
  { id: "restartMap", label: "Restart Match", kind: "action", category: "match" },
  { id: "endGame", label: "End Game", kind: "action", category: "match" },
  { id: "zombieCounter", label: "Zombie Counter", kind: "toggle", category: "zombies" },
  { id: "killAll", label: "Kill All Zombies", kind: "action", category: "zombies", hotkeyDefault: "F9" },
  { id: "freezeZombies", label: "Freeze Zombies", kind: "toggle", category: "zombies" },
  { id: "noSpawns", label: "No Zombie Spawns", kind: "toggle", category: "zombies" },
  { id: "lowHealthZ", label: "Low Health Zombies", kind: "toggle", category: "zombies" },
  { id: "spawnZombie", label: "Spawn Zombie", kind: "action", category: "zombies" },
  { id: "instaKill", label: "Insta-Kill", kind: "toggle", category: "powerups", hotkeyDefault: "F8" },
  { id: "doublePoints", label: "Double Points", kind: "toggle", category: "powerups" },
  { id: "fireSale", label: "Fire Sale", kind: "toggle", category: "powerups" },
  { id: "nukeDrop", label: "Drop Nuke", kind: "action", category: "powerups" },
  { id: "carpenter", label: "Drop Carpenter", kind: "action", category: "powerups" },
  { id: "rainPowerups", label: "Rain Powerups", kind: "action", category: "powerups" },
  { id: "tpDiner", label: "Diner", kind: "action", category: "teleport" },
  { id: "tpFarm", label: "Farm", kind: "action", category: "teleport" },
  { id: "tpTown", label: "Town", kind: "action", category: "teleport" },
  { id: "tpPower", label: "Power Station", kind: "action", category: "teleport" },
  { id: "tpNacht", label: "Nacht", kind: "action", category: "teleport" },
  { id: "tpPap", label: "Pack-a-Punch", kind: "action", category: "teleport" },
  { id: "noclip", label: "Noclip", kind: "toggle", category: "advanced", hint: "Walk through blockers", hotkeyDefault: "F2" },
  { id: "ufoMode", label: "UFO Mode", kind: "toggle", category: "advanced", hint: "Host fly — skip collision" },
  { id: "savePos", label: "Save Position", kind: "action", category: "advanced" },
  { id: "loadPos", label: "Load Position", kind: "action", category: "advanced" },
  { id: "zombieHpScale", label: "Zombie HP Scale", kind: "slider", category: "advanced", slider: { min: 0.1, max: 3, step: 0.1 } },
  { id: "zombieSpeed", label: "Zombie Speed", kind: "slider", category: "advanced", slider: { min: 0.25, max: 3, step: 0.25 } },
  { id: "powerOn", label: "Power On + Doors", kind: "action", category: "advanced" },
  { id: "weaponKit", label: "Weapon Kit (Ray Gun)", kind: "action", category: "advanced" },
  { id: "visionNight", label: "Night Vision Set", kind: "toggle", category: "advanced" },
  { id: "boxCycle", label: "Cycle Box Weapon", kind: "action", category: "advanced" },
  { id: "notifyPulse", label: "Fire Notify Bus", kind: "action", category: "advanced", hint: "level notify forge_cmd" },
  { id: "hostGate", label: "Host Gate Check", kind: "action", category: "advanced", hint: "isHost() — this studio is host" },
  {
    id: "giveTallies",
    label: "Give Tallies",
    kind: "action",
    category: "account",
    placeholder: true,
    hint: "MP placeholder — not wired on Zombies",
  },
  {
    id: "allTrophies",
    label: "All Trophies",
    kind: "action",
    category: "account",
    placeholder: true,
    hint: "MP placeholder — not wired on Zombies",
  },
  {
    id: "customStats",
    label: "Custom Stats",
    kind: "action",
    category: "account",
    placeholder: true,
    hint: "MP placeholder — not wired on Zombies",
  },
  {
    id: "forceHost",
    label: "Force Host",
    kind: "toggle",
    category: "host",
    placeholder: true,
    hint: "Reserved for future co-op lobby tools",
  },
  {
    id: "hearAll",
    label: "Hear All Players",
    kind: "toggle",
    category: "host",
    placeholder: true,
  },
  {
    id: "antiQuit",
    label: "Perfect Anti-Quit",
    kind: "toggle",
    category: "host",
    placeholder: true,
  },
];

export const ITEM_BY_ID = Object.fromEntries(MENU_ITEMS.map((i) => [i.id, i]));

export const DEFAULT_LAYOUT: Record<CategoryId, string[]> = CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.id] = MENU_ITEMS.filter((i) => i.category === cat.id).map((i) => i.id);
    return acc;
  },
  {} as Record<CategoryId, string[]>,
);

export const DEFAULT_HOTKEYS: Record<string, string> = Object.fromEntries(
  MENU_ITEMS.filter((i) => i.hotkeyDefault).map((i) => [i.id, i.hotkeyDefault!]),
);

export const OPEN_MENU_DEFAULT = "F4";

export type GiveWeaponId = WeaponId;
export type GivePerkId = PerkId;
