# FORGE 115 — Guide

How to use the live overlay, how to take the GSC pack to a private Zombies match, and how to prove the files you downloaded are the ones this studio ships.

---

## 1. The live app (this is the running demo)

You do not need to compile anything to see the menu work.

### Drop into Green Run

1. Go to **Match**.
2. Click **Drop in**.
3. You spawn at the Pack-a-Punch pad (center of the crossroads).
4. WASD moves. The mouse aims. Left click fires. **V** (or **F**) melees.

On a phone: the left stick moves, **Fire** shoots, **Menu** opens the overlay.

**Run demo** does this for you: opens the overlay, turns God on, adds 5,000 points, gives a Ray Gun, skips a round, grants Juggernog, then closes the menu. The match stays live.

### Open the overlay

| Key | What it does |
| --- | --- |
| **F4** | Open / close (default) |
| **Insert** or **I** | Same as F4 |
| **Escape** / Backspace | Close |
| Phone **Menu** button | Open / close |

While the overlay is open (and Freeze while open is on, which is the default):

| Key | What it does |
| --- | --- |
| Up / W | Previous item |
| Down / S | Next item |
| Left / A | Previous category |
| Right / D / Tab | Next category |
| Enter / Space | Activate the highlighted item |
| Shift+Up / Shift+Down | Move that item in the list (layout edit on the fly) |

Toggles show `[ON]` / `[OFF]`. Sliders wrap when they hit the max. Give Weapon cycles the gun list. Give Perk grants the next missing perk.

### Default action keys (work with the menu closed)

| Key | Action |
| --- | --- |
| F1 | God Mode |
| F3 | Cycle weapon (Ray Gun first) |
| F5 | Skip round |
| F6 | +5,000 points |
| F7 | Infinite ammo |
| F8 | Insta-Kill |
| F9 | Kill all zombies |

Change these on the **Studio** tab. Settings save on this device.

### What “stable” means

- Overlay **closed** → stock movement and shooting. Zombies still aggro unless No Target is on.
- Overlay **open** → player and horde freeze so you can click sliders without walking into a crawler.
- God / auto-revive / timescale / freeze zombies are **toggles**. Off = normal round again.
- Auto-revive on (default) sends you back to PaP instead of ending the match. Turn it off in Combat if you want a real down.

---

## 2. Studio — hotkeys, layout, look

Open **Studio**.

- Pick a category. Use the arrows next to each row to reorder.
- Click the key chip, then press a key. Escape cancels.
- **Open overlay** remaps F4.
- **Freeze while open** should stay on unless you want to walk with the menu up.
- Background alpha, Menu X, Menu Y move the HUD on the match.
- **Export JSON** downloads `forge115-config.json` (same shape as `gsc/forge115-config.json`).
- Reset keys / Reset layout restore defaults.

In the match, Shift+Up / Shift+Down does the same reorder without leaving the overlay.

---

## 3. Source — GSC + hash proof

Open **Source**.

Each file on the left is a T6 script. The panel shows:

- Path the VM expects
- SHA-256 of the **studio text**
- **MATCH** if the file served from `/gsc/...` hashes the same

That is the proof the download equals this source. `gsc/SHA256SUMS.txt` is the same list.

**Download** saves one file. **Download pack** saves every module in one `.txt`. **SHA256SUMS** is the raw sum file.

### Module map

| File | Role |
| --- | --- |
| `maps/mp/gametypes_zm/_clientids.gsc` | `init`, connect/spawn, input loop, infinite ammo loop, auto-revive watch |
| `scripts/zm/forge115/_menu.gsc` | Pages, HUD elems, cursor, redraw |
| `scripts/zm/forge115/_actions.gsc` | God, score, rounds, perks, weapons, timescale, teleports |
| `scripts/zm/forge115/_config.gsc` | Default open button, freeze, colors |
| `maps/mp/gametypes_zm/_shellshock.gsc` | Thin trampoline so old GSC Studio still compiles through `_shellshock` |

Scripts use T6 Zombies helpers (`_zm_score`, `_zm_perks`, `_zm_weapons`, `_zm_powerups`, `_zm_laststand`). They are written for **host** only (`isHost()`). Clients in the lobby do not get the overlay.

---

## 4. Taking the pack to a private match

### A. Plutonium T6 (recommended)

Plutonium loads scripts from its storage folder. No process injection.

1. Install [Plutonium](https://plutonium.pw/) and run **Black Ops II → Zombies** once.
2. Quit to desktop.
3. Copy:

```
gsc/scripts/zm/forge115/_menu.gsc
gsc/scripts/zm/forge115/_actions.gsc
gsc/scripts/zm/forge115/_config.gsc
```

into:

```
%localappdata%\Plutonium\storage\t6\scripts\zm\forge115\
```

4. If your setup expects the Studio entry, also place:

```
gsc/maps/mp/gametypes_zm/_clientids.gsc
gsc/maps/mp/gametypes_zm/_shellshock.gsc
```

according to how you compile (see B).

5. Launch a **private** (not public matchmaking) Zombies map as host.
6. On spawn you should see: `FORGE 115 loaded — hold [{+actionslot 1}]`.
7. D-pad / action slot 1 toggles the overlay (mapped as F4 in the live studio).

### B. Loader (file copy)

From a machine with .NET 8:

```
dotnet run --project loader -- path\to\gsc
```

With no arguments it copies `gsc` next to the exe into:

```
%localappdata%\Plutonium\storage\t6\scripts\zm\forge115
```

This is `File.Copy`. It does not open `t6zm.exe`, does not write memory, does not bypass VAC.

### C. GSC Studio (the compiler you uploaded)

1. Download `_clientids.gsc` from Source (or use the copy in this pack).
2. Open it in GSC Studio.
3. Compile.
4. Inject **only** into a locally hosted Zombies session.
5. `_shellshock.gsc` exists so the old compiler entry still has a trampoline. It just calls `_clientids::init`.

The obfuscated menu blob from the zip you attached is **not** in this pack. Readable source + SHA-256 replaces it.

### D. What “private” means

- Plutonium private / custom game you host
- Offline / local listen server
- Friends in that lobby, if they accept a scripted host

Not:

- Official Steam VAC multiplayer
- Public matchmaking
- Someone else’s dedicated server without their consent

---

## 5. In-game GSC controls (console / gamepad)

The compiled overlay uses action slots because T6 GSC cannot bind raw F-keys the way the browser studio can.

| Gamepad / slot | Action |
| --- | --- |
| Action slot 1 | Open / close menu |
| Action slot 2 | Cursor up |
| Action slot 3 | Cursor down |
| Action slot 4 or jump | Activate |
| Melee | Back / close |

Keyboard players on Plutonium typically map action slots to the same F-keys used in Studio.

---

## 6. Troubleshooting

**No “FORGE 115 loaded”**  
You are not host, the script is in the wrong folder, or Plutonium has not created `storage\t6` yet. Launch T6 Zombies once, then copy again.

**Menu opens but options do nothing**  
You are a client. Only the host’s VM runs these scripts.

**Hash mismatch on Source**  
Re-download the pack from this studio. Do not mix files from the old obfuscated zip.

**Match feels frozen**  
Overlay is open and Freeze while open is on. Press F4. Or disable freeze in Studio.

**Went down and the match ended**  
Auto Revive was off. Turn it on in Combat, or leave it on (default).

**Loader prints “Missing GSC folder”**  
Pass the path to the `gsc` directory from this pack.

**Official Steam BO2 “won’t inject”**  
That is expected. There is no Steam injector in this pack.

---

## 7. Studio source (TypeScript)

If you are reading the code, not just the GSC:

| File | Role |
| --- | --- |
| `studio-src/lib/menu-catalog.ts` | Categories, items, default hotkeys, layout |
| `studio-src/lib/store.ts` | Match sim + overlay state (points, rounds, perks, juice) |
| `studio-src/lib/gsc/sources.ts` | Canonical GSC strings + SHA-256 helper |
| `studio-src/lib/weapons.ts` / `perks.ts` | Weapon and perk tables |
| `studio-src/components/game/ModMenu.tsx` | In-world HUD menu |
| `studio-src/components/game/MatchView.tsx` | Input, demo sequence, canvas loop |
| `studio-src/components/game/Hud.tsx` | Points, round stamp, perks |
| `studio-src/lib/game/draw.ts` | Green Run draw + sprites |
| `studio-src/routes/studio.tsx` | Hotkey / layout editor |
| `studio-src/routes/source.tsx` | Hash panel |

The live Match is a simulator so the overlay can be tested without T6. Behavior is aligned with the GSC actions: same categories, same toggles, same default keys.

---

## 8. Advanced techniques (Craft)

Open **Craft**. Twelve host-only GSC patterns, each with a snippet from `_hooks.gsc`. **Try on Match** drops you into Green Run with that hook live.

| Pattern | Why |
| --- | --- |
| `isHost()` | Overlay and world writes stay on the host VM |
| `endon("disconnect")` | Ammo / UFO / HUD loops die with the player |
| `level notify("forge_cmd")` | Menu does not call every helper directly |
| `getAiArray("axis")` + stamp | New spawns inherit HP / run-cycle scale |
| `spawnstruct` origin | Save / load any pin, not just named pads |
| HUD pool | Background created once; rows recycle |
| `visionSetNaked` | Night set in, map default out |
| `flag_set("power_on")` | TranZit lights, PaP, and doors together |
| Config struct | Studio JSON → `level.forge_cfg` |

The overlay **ADVANCED** page is the same list: F2 noclip, UFO, save/load, HP/speed sliders, power, kit, night, box cycle, notify pulse. Private / hosted Zombies only.

---

## 9. Acceptance checklist

Use this against the live Match:

- [ ] Overlay opens with one key (F4)
- [ ] God Mode toggles and the “God” badge appears
- [ ] +5,000 points changes the HUD
- [ ] Skip round advances the round stamp
- [ ] Give Weapon changes the gun name / mag
- [ ] Closing the menu leaves the match running (no disconnect, no soft-lock)
- [ ] Source tab shows MATCH on every GSC file
- [ ] Studio export downloads JSON
- [ ] Craft → Try on Match turns Noclip / Night / notify bus on without a soft-lock

That is the Zombies pass. Multiplayer extras stay stubs until a co-op pass lands.
