# FORGE 115

Zombies-first command overlay for Call of Duty: Black Ops II, plus the original GSC that drives it.

The live studio is the running app: a Green Run match with an in-world menu. Open it with one key, change points, rounds, and weapons, close it, keep playing.

This pack is **not** a Steam VAC injector, memory patcher, or anti-cheat bypass. Official VAC-protected servers are not a target. Load unsigned scripts only into a game you host (Plutonium T6 private Zombies, or a local offline session).

---

## What you get

| Piece | Where | What it is |
| --- | --- | --- |
| Live overlay | **Match** tab | In-world menu on a playable Green Run |
| Hotkeys & layout | **Studio** tab | Remap keys, reorder items, export JSON |
| GSC framework | **Source** tab + `gsc/` | Modular T6 scripts, SHA-256 verified |
| File-copy loader | `loader/` | .NET 8 tool that copies scripts into Plutonium storage |
| Field notes | **Notes** tab + `GUIDE.md` | Load steps, hotkeys, stability |

ACCOUNT and HOST pages are labeled **MP placeholders**. They do nothing on Zombies. A later co-op pass can fill them without rewriting the tree.

---

## Quick start (live studio)

1. Open **Match**.
2. Click **Drop in** (or **Run demo** to watch the overlay fire itself).
3. **F4** opens the menu. **Insert** / **I** also work.
4. Up/Down select, Enter activates, Left/Right changes category.
5. **F1** god mode, **F5** skip round, **F6** +5,000 points, **F3** cycle weapon.
6. Escape closes the overlay. The round keeps running.

Controls in the match: WASD move, mouse aim, click fire, V melee. On a phone: left stick + Fire + Menu.

---

## Source tree

```
gsc/
  maps/mp/gametypes_zm/_clientids.gsc    entry the T6 VM loads
  maps/mp/gametypes_zm/_shellshock.gsc   GSC Studio trampoline
  scripts/zm/forge115/_menu.gsc          HUD overlay, pages, highlight
  scripts/zm/forge115/_actions.gsc       god, score, rounds, perks, weapons
  scripts/zm/forge115/_config.gsc        default hotkeys / layout
  scripts/zm/forge115/_hooks.gsc         notify bus, UFO, AI stamp, vision
  forge115-config.json                   studio defaults (JSON)
  SHA256SUMS.txt                         proof the files match the studio
loader/
  Program.cs                             file copy into Plutonium storage
  Forge115.Loader.csproj                 .NET 8 console app
studio-src/                              TypeScript overlay, catalog, match sim
GUIDE.md                                 step-by-step load & use
README.md                                this file
```

SHA-256 (current pack):

```
686b2e473e5239bec81791a14b4394d6dfe0b694ad924d9eea35256ae751a3c4  maps/mp/gametypes_zm/_clientids.gsc
c3fa64ccf8cdb67a8d4b7ceaf8737bac0ba087fb875621e79b27d6187db80e8b  scripts/zm/forge115/_menu.gsc
07b15b6ca2f44f5097bcc21060a775ded9b94fbf00e4559d8ba163789116c944  scripts/zm/forge115/_actions.gsc
a617bb79502a7af1a9e34a230c12db3ddfcb334a9299055c6cef58d5de4d8ed6  scripts/zm/forge115/_config.gsc
a637af85b8f906a4b88a3c34bb3cbdf496006cbf67964ca1b6276af17bb85481  scripts/zm/forge115/_hooks.gsc
212bd81431f021316f8c117204b39b19f5e2a302873069369c560d09dd5e7c79  maps/mp/gametypes_zm/_shellshock.gsc
```

The Source tab hashes the same text in the browser. Green **MATCH** means the file on disk equals the studio.

---

## Load into Plutonium T6 (private Zombies)

1. Install Plutonium and launch **T6 Zombies** once so storage folders exist.
2. Copy the `gsc/scripts/zm/forge115/` files to:

   `%localappdata%\Plutonium\storage\t6\scripts\zm\forge115\`

3. If you compile with GSC Studio instead, keep `_clientids.gsc` at:

   `maps/mp/gametypes_zm/_clientids.gsc`

4. Start a **private** Zombies match as host. You should see `FORGE 115 loaded`.

Or run the loader (file copy only):

```
dotnet run --project loader -- path/to/gsc
```

Default destination is the Plutonium path above.

---

## GSC Studio

The 2016 compiler you already have can build `_clientids.gsc`. Compile, then inject only into a match you host locally. Do not load this pack into VAC-protected official Steam servers.

---

## Default hotkeys

| Key | Action |
| --- | --- |
| F4 | Open / close overlay |
| F1 | God Mode |
| F3 | Cycle / give Ray Gun |
| F5 | Skip round |
| F6 | +5,000 points |
| F7 | Infinite ammo |
| F8 | Insta-Kill |
| F9 | Kill all zombies |

Remap everything in **Studio**. Shift+Up / Shift+Down reorders the open page while the overlay is up. Export JSON from Studio to snapshot your layout.

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

## Stability

With the overlay closed, movement and combat are stock. Freeze-on-open (Studio) stops walking while you click sliders. God, auto-revive, and timescale are toggles — turn them off and the round behaves again.

---

## What this will not do

- Inject into `t6mp.exe` / `t6zm.exe` on a VAC-secured Steam install
- Bypass VAC, patch anti-cheat, or hide a module
- Force host, edit account stats, or run an aimbot on live servers

Those were asked for. They are out of scope on purpose.

For the full walkthrough (Plutonium folders, GSC Studio, troubleshooting), read **GUIDE.md**.
