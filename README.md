# FORGE 115

Zombies command overlay for **Call of Duty: Black Ops II** (private / hosted matches).

**Windows users: read [HOW_TO_RUN.txt](HOW_TO_RUN.txt) first.**  
There is no `.exe`. You do not install Node. You copy four `.gsc` files into Plutonium and host a private Zombies match.

This pack is **not** a Steam VAC injector. Official servers will not load it.

---

## How to run (Windows, no extra software)

You need: Steam BO2 + [Plutonium](https://plutonium.pw/) + File Explorer.

1. Open Plutonium once (Black Ops II → Zombies), then quit. That creates the folders.
2. In File Explorer address bar paste:

   `%localappdata%\Plutonium\storage\t6\scripts\zm\forge115`

   Create that folder if it does not exist.
3. Copy from this repo:

   `public\gsc\scripts\zm\forge115\_menu.gsc`  
   `public\gsc\scripts\zm\forge115\_actions.gsc`  
   `public\gsc\scripts\zm\forge115\_config.gsc`  
   `public\gsc\scripts\zm\forge115\_hooks.gsc`  
   `public\gsc\maps\mp\gametypes_zm\_clientids.gsc`

   into the folder from step 2. Or unzip `forge115.zip` in the repo root.
4. Start a **private** Zombies match as **host**.
5. On spawn you should see `FORGE 115 loaded`. Open the menu with **Action Slot 1** (often **N** / night vision).

Do not use VS Code. Do not run `npm`. Ignore the Match / Studio pages — that is a browser demo, not the game.

---

## What you get

| Piece | Where | What it is |
| --- | --- | --- |
| GSC scripts | `public/gsc/` and `forge115.zip` | In-game overlay for Plutonium T6 |
| How to run | `HOW_TO_RUN.txt` | Windows copy-paste steps |
| Browser demo | source in `src/` | Optional. Needs Node. Client does not need this. |

ACCOUNT and HOST pages are labeled **MP placeholders**. They do nothing on Zombies.

---

## In-game controls (Plutonium)

| Input | Action |
| --- | --- |
| Action Slot 1 | Open / close overlay |
| Action Slot 2 | Cursor up |
| Action Slot 3 | Cursor down |
| Action Slot 4 or jump | Activate |
| Melee | Back / close |

Keyboard: bind Action Slot 1 in Options → Controls if **N** does nothing.

---

## Menu (Zombies)

- **Combat** — god, infinite ammo, auto revive, no target, deadshot lock, rapid fire, super melee
- **Weapons** — give weapon, Pack-a-Punch, max ammo, drop, all box weapons
- **Points** — add 500 / 5,000 / 100,000, set 0, set 1,000,000
- **Rounds** — skip, set 1–255, end round wait
- **Perks** — give one, give all, clear, keep on down, perk limit
- **Player** — speed, health, FOV, third person, sprint, health bar
- **Match** — Game speed, open doors, restart, end game
- **Zombies** — Counter, kill all, freeze, no spawns, low health, spawn one
- **Powerups** — Insta, double, fire sale, nuke, carpenter, rain
- **Teleport** — Diner, Farm, Town, Power, Nacht, PaP
- **Advanced** — Noclip, UFO, save/load origin, HP/speed scale, power, weapon kit, night vision, notify bus
- **Account / Host** — MP stubs, no-ops on this pass

---

## What this will not do

- Inject into `t6mp.exe` / `t6zm.exe` on a VAC-secured Steam install
- Bypass VAC, patch anti-cheat, or hide a module
- Force host, edit account stats, or run an aimbot on live servers

Private / hosted Zombies only.
