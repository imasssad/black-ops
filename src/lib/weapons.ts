export type WeaponId =
  | "m1911_zm"
  | "m14_zm"
  | "olympia_zm"
  | "mp5_zm"
  | "ak74u_zm"
  | "galil_zm"
  | "rpd_zm"
  | "dsr50_zm"
  | "ray_gun_zm"
  | "raygun_mark2_zm"
  | "ray_gun_upgraded_zm"
  | "staff_lightning_zm"
  | "blundergat_zm"
  | "sliquifier_zm"
  | "jetgun_zm"
  | "hamr_upgraded_zm";

export type Weapon = {
  id: WeaponId;
  name: string;
  short: string;
  damage: number;
  fireMs: number;
  spread: number;
  mag: number;
  stock: number;
  pap: boolean;
};

export const WEAPONS: Weapon[] = [
  { id: "m1911_zm", name: "M1911", short: "M1911", damage: 22, fireMs: 220, spread: 0.08, mag: 8, stock: 80, pap: false },
  { id: "m14_zm", name: "M14", short: "M14", damage: 38, fireMs: 280, spread: 0.04, mag: 8, stock: 96, pap: false },
  { id: "olympia_zm", name: "Olympia", short: "OLY", damage: 70, fireMs: 620, spread: 0.18, mag: 2, stock: 36, pap: false },
  { id: "mp5_zm", name: "MP5", short: "MP5", damage: 28, fireMs: 90, spread: 0.1, mag: 30, stock: 180, pap: false },
  { id: "ak74u_zm", name: "AK-74u", short: "74u", damage: 32, fireMs: 95, spread: 0.09, mag: 30, stock: 180, pap: false },
  { id: "galil_zm", name: "Galil", short: "GAL", damage: 42, fireMs: 105, spread: 0.06, mag: 35, stock: 210, pap: false },
  { id: "rpd_zm", name: "RPD", short: "RPD", damage: 48, fireMs: 115, spread: 0.08, mag: 100, stock: 400, pap: false },
  { id: "dsr50_zm", name: "DSR 50", short: "DSR", damage: 160, fireMs: 900, spread: 0.01, mag: 5, stock: 35, pap: false },
  { id: "ray_gun_zm", name: "Ray Gun", short: "RAY", damage: 95, fireMs: 280, spread: 0.03, mag: 20, stock: 160, pap: false },
  { id: "raygun_mark2_zm", name: "Ray Gun Mk II", short: "MK2", damage: 85, fireMs: 70, spread: 0.02, mag: 21, stock: 161, pap: false },
  { id: "ray_gun_upgraded_zm", name: "Porter's X2 Ray Gun", short: "X2", damage: 150, fireMs: 240, spread: 0.02, mag: 40, stock: 200, pap: true },
  { id: "staff_lightning_zm", name: "Staff of Lightning", short: "STAFF", damage: 120, fireMs: 160, spread: 0.05, mag: 12, stock: 90, pap: false },
  { id: "blundergat_zm", name: "Blundergat", short: "GAT", damage: 180, fireMs: 700, spread: 0.22, mag: 1, stock: 30, pap: false },
  { id: "sliquifier_zm", name: "Sliquifier", short: "SLQ", damage: 110, fireMs: 200, spread: 0.07, mag: 6, stock: 48, pap: false },
  { id: "jetgun_zm", name: "Jet Gun", short: "JET", damage: 55, fireMs: 50, spread: 0.12, mag: 0, stock: 0, pap: false },
  { id: "hamr_upgraded_zm", name: "HAMR PAP", short: "HAMR", damage: 72, fireMs: 80, spread: 0.05, mag: 125, stock: 500, pap: true },
];

export const WEAPON_BY_ID = Object.fromEntries(WEAPONS.map((w) => [w.id, w])) as Record<WeaponId, Weapon>;
