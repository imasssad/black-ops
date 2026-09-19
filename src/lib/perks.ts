export type PerkId =
  | "juggernog"
  | "quick_revive"
  | "speed_cola"
  | "double_tap"
  | "stamin_up"
  | "deadshot"
  | "mule_kick"
  | "phd_flopper"
  | "tombstone"
  | "electric_cherry"
  | "vulture_aid"
  | "widows_wine";

export type Perk = {
  id: PerkId;
  name: string;
  short: string;
  color: string;
  specialty: string;
};

export const PERKS: Perk[] = [
  { id: "juggernog", name: "Juggernog", short: "JUG", color: "#8a3d35", specialty: "specialty_armorvest" },
  { id: "quick_revive", name: "Quick Revive", short: "QR", color: "#5a8aa8", specialty: "specialty_quickrevive" },
  { id: "speed_cola", name: "Speed Cola", short: "SC", color: "#6f9e5a", specialty: "specialty_fastreload" },
  { id: "double_tap", name: "Double Tap II", short: "DT", color: "#b08948", specialty: "specialty_rof" },
  { id: "stamin_up", name: "Stamin-Up", short: "ST", color: "#c4a35a", specialty: "specialty_longersprint" },
  { id: "deadshot", name: "Deadshot Daiquiri", short: "DS", color: "#6b7a4a", specialty: "specialty_deadshot" },
  { id: "mule_kick", name: "Mule Kick", short: "MK", color: "#4e6b46", specialty: "specialty_additionalprimaryweapon" },
  { id: "phd_flopper", name: "PhD Flopper", short: "PHD", color: "#7a4d78", specialty: "specialty_flakjacket" },
  { id: "tombstone", name: "Tombstone", short: "TS", color: "#8a8a6a", specialty: "specialty_tombstone" },
  { id: "electric_cherry", name: "Electric Cherry", short: "EC", color: "#7aa0b8", specialty: "specialty_grenadepulldeath" },
  { id: "vulture_aid", name: "Vulture Aid", short: "VA", color: "#6a5a3a", specialty: "specialty_scavenger" },
  { id: "widows_wine", name: "Widow's Wine", short: "WW", color: "#8a3d5a", specialty: "specialty_widows_wine" },
];

export const PERK_BY_ID = Object.fromEntries(PERKS.map((p) => [p.id, p])) as Record<PerkId, Perk>;
