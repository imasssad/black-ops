export type GscModule = {
  id: string;
  path: string;
  title: string;
  note: string;
  source: string;
};

const HEADER = `// FORGE 115 — Black Ops II Zombies menu framework
// Target: T6 / Plutonium T6ZM and GSC Studio (maps/mp/gametypes_zm/_clientids.gsc)
// Zombies-first. Multiplayer stubs are no-ops until a co-op pass lands.
// This file is original source for FORGE 115, not a decompile of third-party menus.
`;

export const GSC_MODULES: GscModule[] = [
  {
    id: "clientids",
    path: "maps/mp/gametypes_zm/_clientids.gsc",
    title: "_clientids.gsc",
    note: "Entry the T6 script VM loads. Hooks connect/spawn and starts the overlay.",
    source: `${HEADER}
#include maps\\mp\\_utility;
#include common_scripts\\utility;
#include maps\\mp\\gametypes_zm\\_hud_util;
#include maps\\mp\\zombies\\_zm_utility;
#include maps\\mp\\zombies\\_zm_score;
#include maps\\mp\\zombies\\_zm_perks;
#include maps\\mp\\zombies\\_zm_weapons;
#include maps\\mp\\zombies\\_zm_powerups;
#include maps\\mp\\zombies\\_zm_laststand;

init()
{
    level.forge115_version = "1.1.0";
    level.forge115_open_button = "actionslot 1"; // remap from studio config
    PrecacheShader("white");
    PrecacheShader("scorebar_zom_long");
    level thread on_player_connect();
    level thread forge_notify_bus();
    level thread forge_on_ai_spawned();
}

on_player_connect()
{
    for (;;)
    {
        level waittill("connected", player);
        player thread on_player_spawned();
    }
}

on_player_spawned()
{
    self endon("disconnect");
    level endon("game_ended");
    self.forge = spawnstruct();
    self.forge.god = false;
    self.forge.infinite_ammo = false;
    self.forge.no_target = false;
    self.forge.menu_open = false;
    self.forge.cursor = 0;
    self.forge.page = 0;
    for (;;)
    {
        self waittill("spawned_player");
        if (!self isHost())
            continue;
        self thread forge_input_loop();
        self thread forge_ammo_loop();
        self thread forge_watch_down();
        self thread forge_hooks_start();
        self iprintln("^2FORGE 115 ^7loaded  —  hold [{+actionslot 1}]");
    }
}

forge_watch_down()
{
    self endon("disconnect");
    for (;;)
    {
        self waittill_any("bled_out", "fake_death", "player_suicide");
        if (isDefined(self.forge) && isDefined(self.forge.auto_revive) && self.forge.auto_revive)
        {
            wait 0.2;
            maps\\mp\\zombies\\_zm_laststand::auto_revive(self);
        }
    }
}

forge_ammo_loop()
{
    self endon("disconnect");
    for (;;)
    {
        if (isDefined(self.forge) && self.forge.infinite_ammo)
        {
            weap = self getCurrentWeapon();
            if (isDefined(weap) && weap != "none")
            {
                self setWeaponAmmoClip(weap, weaponClipSize(weap));
                self setWeaponAmmoStock(weap, weaponMaxAmmo(weap));
            }
        }
        wait 0.15;
    }
}

forge_input_loop()
{
    self endon("disconnect");
    self endon("death");
    self forge_build_menu();
    for (;;)
    {
        if (self actionSlotOneButtonPressed())
            self forge_toggle_menu();
        if (self.forge.menu_open)
        {
            if (self actionSlotTwoButtonPressed())
                self forge_cursor(-1);
            if (self actionSlotThreeButtonPressed())
                self forge_cursor(1);
            if (self actionSlotFourButtonPressed() || self jumpButtonPressed() && self.forge._jump_latch != true)
                self forge_activate();
            if (self meleeButtonPressed())
                self forge_back();
        }
        wait 0.05;
    }
}

forge_toggle_menu()
{
    self.forge.menu_open = !self.forge.menu_open;
    if (self.forge.menu_open)
    {
        self.forge.hud_bg.alpha = 0.88;
        self freezeControls(true);
        self setClientUiVisibilityFlag("hud_visible", 0);
        self forge_redraw();
    }
    else
    {
        self.forge.hud_bg.alpha = 0;
        self freezeControls(false);
        self setClientUiVisibilityFlag("hud_visible", 1);
        self forge_clear_rows();
    }
}

forge_cursor(dir)
{
    n = self.forge.rows.size;
    if (n < 1)
        return;
    self.forge.cursor = (self.forge.cursor + dir + n) % n;
    self forge_redraw();
}

forge_back()
{
    if (self.forge.page != 0)
    {
        self.forge.page = 0;
        self.forge.cursor = 0;
        self forge_redraw();
        return;
    }
    self forge_toggle_menu();
}
`,
  },
  {
    id: "menu",
    path: "scripts/zm/forge115/_menu.gsc",
    title: "_menu.gsc",
    note: "HUD overlay, pages, highlight. Mirrors the in-studio layout editor.",
    source: `${HEADER}
forge_build_menu()
{
    self.forge.pages = [];
    self.forge.pages[0] = "COMBAT";
    self.forge.pages[1] = "WEAPONS";
    self.forge.pages[2] = "POINTS";
    self.forge.pages[3] = "ROUNDS";
    self.forge.pages[4] = "PERKS";
    self.forge.pages[5] = "PLAYER";
    self.forge.pages[6] = "MATCH";
    self.forge.pages[7] = "ZOMBIES";
    self.forge.pages[8] = "POWERUPS";
    self.forge.pages[9] = "TELEPORT";
    self.forge.pages[10] = "ADVANCED";
    self.forge.pages[11] = "ACCOUNT"; // MP placeholder
    self.forge.pages[12] = "HOST";    // MP placeholder

    bg = newClientHudElem(self);
    bg.alignX = "left";
    bg.alignY = "top";
    bg.horzAlign = "left";
    bg.vertAlign = "top";
    bg.x = 18;
    bg.y = 72;
    bg.sort = 900;
    bg.foreground = true;
    bg.archived = false;
    bg.alpha = 0;
    bg setShader("white", 268, 340);
    bg.color = (0.05, 0.055, 0.04);
    self.forge.hud_bg = bg;

    title = self createFontString("objective", 1.6);
    title setPoint("LEFT", "LEFT", 28, 86);
    title.sort = 910;
    title.archived = false;
    title.color = (0.44, 0.62, 0.35);
    title setText("FORGE 115");
    title.alpha = 0;
    self.forge.hud_title = title;
}

forge_clear_rows()
{
    if (!isDefined(self.forge.hud_rows))
        return;
    for (i = 0; i < self.forge.hud_rows.size; i++)
        if (isDefined(self.forge.hud_rows[i]))
            self.forge.hud_rows[i] destroy();
    self.forge.hud_rows = [];
    if (isDefined(self.forge.hud_title))
        self.forge.hud_title.alpha = 0;
}

forge_redraw()
{
    self forge_clear_rows();
    self.forge.hud_title.alpha = 1;
    self.forge.rows = forge_rows_for_page(self.forge.page);
    self.forge.hud_rows = [];
    for (i = 0; i < self.forge.rows.size; i++)
    {
        row = self createFontString("objective", 1.05);
        row setPoint("LEFT", "LEFT", 32, 118 + i * 18);
        row.sort = 910;
        row.archived = false;
        row.foreground = true;
        if (i == self.forge.cursor)
            row.color = (0.44, 0.62, 0.35);
        else
            row.color = (0.9, 0.88, 0.82);
        row setText(self.forge.rows[i].label);
        self.forge.hud_rows[i] = row;
    }
}

forge_rows_for_page(page)
{
    rows = [];
    switch (page)
    {
        case 0:
            rows[0] = forge_row("God Mode", "god");
            rows[1] = forge_row("Infinite Ammo", "ammo");
            rows[2] = forge_row("Auto Revive", "revive");
            rows[3] = forge_row("No Target", "ignore");
            rows[4] = forge_row("Deadshot Lock", "lock");
            rows[5] = forge_row("Rapid Fire", "rof");
            break;
        case 1:
            rows[0] = forge_row("Give Ray Gun", "w_ray");
            rows[1] = forge_row("Give Mk II", "w_mk2");
            rows[2] = forge_row("Pack-a-Punch", "pap");
            rows[3] = forge_row("Max Ammo", "maxammo");
            break;
        case 2:
            rows[0] = forge_row("Add 500", "p500");
            rows[1] = forge_row("Add 5,000", "p5k");
            rows[2] = forge_row("Add 100,000", "p100k");
            rows[3] = forge_row("Set 0", "p0");
            break;
        case 3:
            rows[0] = forge_row("Skip Round", "skip");
            rows[1] = forge_row("Round +10", "r10");
            break;
        case 4:
            rows[0] = forge_row("Juggernog", "perk_jug");
            rows[1] = forge_row("Speed Cola", "perk_sc");
            rows[2] = forge_row("All Perks", "perk_all");
            rows[3] = forge_row("Clear Perks", "perk_none");
            break;
        case 5:
            rows[0] = forge_row("Third Person", "tpv");
            rows[1] = forge_row("Unlimited Sprint", "sprint");
            break;
        case 6:
            rows[0] = forge_row("Timescale 0.5x", "ts05");
            rows[1] = forge_row("Timescale 1x", "ts10");
            rows[2] = forge_row("Timescale 2x", "ts20");
            rows[3] = forge_row("Open All Doors", "doors");
            rows[4] = forge_row("Restart Map", "restart");
            break;
        case 7:
            rows[0] = forge_row("Kill All Zombies", "killz");
            rows[1] = forge_row("Freeze Zombies", "freeze");
            rows[2] = forge_row("No Spawns", "nospawn");
            break;
        case 8:
            rows[0] = forge_row("Insta-Kill", "insta");
            rows[1] = forge_row("Nuke", "nuke");
            rows[2] = forge_row("Max Ammo Drop", "dropammo");
            break;
        case 9:
            rows[0] = forge_row("Diner", "tp_diner");
            rows[1] = forge_row("Town", "tp_town");
            rows[2] = forge_row("Pack-a-Punch", "tp_pap");
            break;
        case 10:
            rows[0] = forge_row("Noclip", "noclip");
            rows[1] = forge_row("UFO Mode", "ufo");
            rows[2] = forge_row("Save Position", "savepos");
            rows[3] = forge_row("Load Position", "loadpos");
            rows[4] = forge_row("Zombie HP x0.3", "hp03");
            rows[5] = forge_row("Power On + Doors", "power");
            rows[6] = forge_row("Weapon Kit", "kit");
            rows[7] = forge_row("Night Vision", "night");
            rows[8] = forge_row("Fire Notify Bus", "bus");
            break;
        default:
            rows[0] = forge_row("MP placeholder", "noop");
            break;
    }
    return rows;
}

forge_row(label, cmd)
{
    r = spawnstruct();
    r.label = label;
    r.cmd = cmd;
    return r;
}
`,
  },
  {
    id: "combat",
    path: "scripts/zm/forge115/_actions.gsc",
    title: "_actions.gsc",
    note: "God mode, score, rounds, perks, weapons, timescale — the Zombies core.",
    source: `${HEADER}
forge_activate()
{
    cmd = self.forge.rows[self.forge.cursor].cmd;
    switch (cmd)
    {
        case "god":
            self.forge.god = !self.forge.god;
            if (self.forge.god) self enableInvulnerability();
            else self disableInvulnerability();
            self iprintln("God Mode: " + self.forge.god);
            break;
        case "ammo":
            self.forge.infinite_ammo = !self.forge.infinite_ammo;
            break;
        case "revive":
            self.forge.auto_revive = !self.forge.auto_revive;
            break;
        case "ignore":
            self.forge.no_target = !self.forge.no_target;
            self.ignoreme = self.forge.no_target;
            break;
        case "lock":
            self thread forge_deadshot_lock();
            break;
        case "rof":
            if (self hasPerk("specialty_rof")) self unsetPerk("specialty_rof");
            else self setPerk("specialty_rof");
            break;
        case "w_ray":
            self maps\\mp\\zombies\\_zm_weapons::weapon_give("ray_gun_zm");
            break;
        case "w_mk2":
            self maps\\mp\\zombies\\_zm_weapons::weapon_give("raygun_mark2_zm");
            break;
        case "pap":
            cur = self getCurrentWeapon();
            up = maps\\mp\\zombies\\_zm_weapons::get_upgrade_weapon(cur, false);
            if (isDefined(up))
                self maps\\mp\\zombies\\_zm_weapons::weapon_give(up);
            break;
        case "maxammo":
            weap = self getCurrentWeapon();
            self givemaxammo(weap);
            break;
        case "p500":
            self maps\\mp\\zombies\\_zm_score::add_to_player_score(500);
            break;
        case "p5k":
            self maps\\mp\\zombies\\_zm_score::add_to_player_score(5000);
            break;
        case "p100k":
            self maps\\mp\\zombies\\_zm_score::add_to_player_score(100000);
            break;
        case "p0":
            if (self.score > 0)
                self maps\\mp\\zombies\\_zm_score::minus_to_player_score(self.score);
            break;
        case "skip":
            forge_skip_round(1);
            break;
        case "r10":
            forge_skip_round(10);
            break;
        case "perk_jug":
            self maps\\mp\\zombies\\_zm_perks::give_perk("specialty_armorvest");
            break;
        case "perk_sc":
            self maps\\mp\\zombies\\_zm_perks::give_perk("specialty_fastreload");
            break;
        case "perk_all":
            keys = strTok("specialty_armorvest,specialty_quickrevive,specialty_fastreload,specialty_rof,specialty_longersprint,specialty_deadshot,specialty_additionalprimaryweapon,specialty_flakjacket", ",");
            for (i = 0; i < keys.size; i++)
                self maps\\mp\\zombies\\_zm_perks::give_perk(keys[i]);
            break;
        case "perk_none":
            self takeAllPerks();
            break;
        case "tpv":
            self setClientThirdPerson(!isDefined(self.forge.tpv) || !self.forge.tpv);
            self.forge.tpv = !isDefined(self.forge.tpv) || !self.forge.tpv;
            break;
        case "sprint":
            self setPerk("specialty_unlimitedsprint");
            break;
        case "ts05":
            setDvar("timescale", "0.5");
            break;
        case "ts10":
            setDvar("timescale", "1");
            break;
        case "ts20":
            setDvar("timescale", "2");
            break;
        case "doors":
            thread maps\\mp\\zombies\\_zm_blockers::open_all_doors();
            break;
        case "restart":
            map_restart(false);
            break;
        case "killz":
            zoms = getAiArray("axis");
            for (i = 0; i < zoms.size; i++)
                zoms[i] dodamage(zoms[i].health + 666, zoms[i].origin);
            break;
        case "freeze":
            zoms = getAiArray("axis");
            for (i = 0; i < zoms.size; i++)
                zoms[i] set_zombie_run_cycle("walk");
            break;
        case "nospawn":
            level.zombie_total = 0;
            break;
        case "insta":
            level.zombie_vars["zombie_insta_kill"] = 1;
            break;
        case "nuke":
            maps\\mp\\zombies\\_zm_powerups::specific_powerup_drop("nuke", self.origin);
            break;
        case "dropammo":
            maps\\mp\\zombies\\_zm_powerups::specific_powerup_drop("full_ammo", self.origin);
            break;
        case "tp_diner":
            self setOrigin(( -3990, -6950, -63 ));
            break;
        case "tp_town":
            self setOrigin(( 1352, -216, -55 ));
            break;
        case "tp_pap":
            self setOrigin(( 500, -1500, 120 ));
            break;
        case "noclip":
            self forge_toggle_noclip();
            break;
        case "ufo":
            self forge_toggle_ufo();
            break;
        case "savepos":
            self forge_save_origin();
            break;
        case "loadpos":
            self forge_load_origin();
            break;
        case "hp03":
            forge_scale_ai_health(0.3);
            break;
        case "power":
            forge_power_on();
            break;
        case "kit":
            self forge_weapon_kit();
            break;
        case "night":
            self forge_vision_night();
            break;
        case "bus":
            self forge_fire_notify("pulse");
            break;
        default:
            self iprintln("^3MP placeholder — Zombies pass only.");
            break;
    }
    self forge_redraw();
}

forge_skip_round(n)
{
    zoms = getAiArray("axis");
    for (i = 0; i < zoms.size; i++)
        zoms[i] dodamage(zoms[i].health + 666, zoms[i].origin);
    level.round_number = level.round_number + n;
    level setRoundsPlayed(level.round_number);
    level notify("end_of_round");
    level notify("between_round_over");
}

forge_deadshot_lock()
{
    self endon("disconnect");
    self.forge.lock = !isDefined(self.forge.lock) || !self.forge.lock;
    self iprintln("Deadshot Lock: " + self.forge.lock);
    while (isDefined(self.forge.lock) && self.forge.lock)
    {
        zoms = getAiArray("axis");
        closest = undefined;
        best = 99999;
        for (i = 0; i < zoms.size; i++)
        {
            d = distance(self.origin, zoms[i].origin);
            if (d < best)
            {
                best = d;
                closest = zoms[i];
            }
        }
        if (isDefined(closest))
        {
            eye = closest getTagOrigin("j_head");
            if (!isDefined(eye))
                eye = closest.origin + (0, 0, 60);
            self setPlayerAngles(vectorToAngles(eye - self getEye()));
        }
        wait 0.05;
    }
}
`,
  },
  {
    id: "config",
    path: "scripts/zm/forge115/_config.gsc",
    title: "_config.gsc",
    note: "Default hotkeys and layout. Studio writes these from the in-menu editor.",
    source: `${HEADER}
// Serialized from FORGE 115 studio. Do not hand-edit unless you know the T6 VM.
//
// open_menu      = actionslot 1     (F4 in the live overlay / keyboard remap)
// god_mode       = F1
// skip_round     = F5
// add_5000       = F6
// infinite_ammo  = F7
// insta_kill     = F8
// kill_all       = F9
// give_raygun    = F3
//
// freeze_on_menu = 1
// title_color    = 0.44 0.62 0.35
// highlight      = 0.44 0.62 0.35
// text_color     = 0.90 0.88 0.82
// bg_alpha       = 0.88
//
// Layout order is the studio layout array (combat, weapons, points, ...).
// MP categories ACCOUNT and HOST are present so a later co-op pass can fill them.

forge_apply_studio_config()
{
    if (!isDefined(level.forge_cfg))
        level.forge_cfg = spawnstruct();
    level.forge_cfg.open = "actionslot 1";
    level.forge_cfg.freeze = true;
    level.forge_cfg.bg_alpha = 0.88;
}
`,
  },
  {
    id: "hooks",
    path: "scripts/zm/forge115/_hooks.gsc",
    title: "_hooks.gsc",
    note: "Advanced T6 patterns: notify bus, AI spawn stamp, UFO/noclip, origin snapshot, vision, power.",
    source: `${HEADER}
// Advanced host-only hooks. Private / hosted Zombies.
// Patterns: isHost gate, endon-safe loops, notify bus, AI stamp, HUD-safe origin.

forge_hooks_start()
{
    self endon("disconnect");
    level endon("game_ended");
    if (!self isHost())
        return;
    self thread forge_ufo_loop();
}

forge_notify_bus()
{
    level endon("game_ended");
    for (;;)
    {
        level waittill("forge_cmd", player, cmd);
        if (!isDefined(player) || !isDefined(cmd))
            continue;
        player iprintln("^2FORGE bus^7: " + cmd);
    }
}

forge_fire_notify(cmd)
{
    level notify("forge_cmd", self, cmd);
}

forge_on_ai_spawned()
{
    level endon("game_ended");
    for (;;)
    {
        zoms = getAiArray("axis");
        for (i = 0; i < zoms.size; i++)
        {
            if (!isDefined(zoms[i]) || isDefined(zoms[i].forge_hooked))
                continue;
            zoms[i].forge_hooked = true;
            if (isDefined(level.forge_hp_mul))
            {
                zoms[i].maxhealth = int(zoms[i].health * level.forge_hp_mul);
                zoms[i].health = zoms[i].maxhealth;
            }
            if (isDefined(level.forge_run_cycle))
                zoms[i] set_zombie_run_cycle(level.forge_run_cycle);
        }
        wait 0.25;
    }
}

forge_save_origin()
{
    if (!isDefined(self.forge.saved))
        self.forge.saved = spawnstruct();
    self.forge.saved.origin = self.origin;
    self.forge.saved.angles = self getPlayerAngles();
    self iprintln("Saved origin");
}

forge_load_origin()
{
    if (!isDefined(self.forge.saved) || !isDefined(self.forge.saved.origin))
    {
        self iprintln("No saved origin");
        return;
    }
    self setOrigin(self.forge.saved.origin);
    self setPlayerAngles(self.forge.saved.angles);
}

forge_toggle_noclip()
{
    self.forge.noclip = !isDefined(self.forge.noclip) || !self.forge.noclip;
    if (self.forge.noclip)
        self setClientDvar("g_speed", "400");
    else
        self setClientDvar("g_speed", "190");
    self iprintln("Noclip: " + self.forge.noclip);
}

forge_toggle_ufo()
{
    self.forge.ufo = !isDefined(self.forge.ufo) || !self.forge.ufo;
    if (self.forge.ufo)
    {
        self.ignoreme = true;
        self disableWeapons();
    }
    else
    {
        self.ignoreme = false;
        self enableWeapons();
    }
    self iprintln("UFO: " + self.forge.ufo);
}

forge_ufo_loop()
{
    self endon("disconnect");
    level endon("game_ended");
    for (;;)
    {
        if (isDefined(self.forge.ufo) && self.forge.ufo)
        {
            dir = anglesToForward(self getPlayerAngles());
            if (self fragButtonPressed())
                self setOrigin(self.origin + dir * 60);
            else if (self jumpButtonPressed())
                self setOrigin(self.origin + (0, 0, 28));
            else if (self stanceButtonPressed())
                self setOrigin(self.origin - (0, 0, 28));
        }
        wait 0.05;
    }
}

forge_scale_ai_health(mul)
{
    level.forge_hp_mul = mul;
    zoms = getAiArray("axis");
    for (i = 0; i < zoms.size; i++)
    {
        zoms[i].maxhealth = int(zoms[i].health * mul);
        if (zoms[i].maxhealth < 1)
            zoms[i].maxhealth = 1;
        zoms[i].health = zoms[i].maxhealth;
    }
}

forge_power_on()
{
    flag_set("power_on");
    level notify("power_on");
    thread maps\\mp\\zombies\\_zm_blockers::open_all_doors();
}

forge_weapon_kit()
{
    self maps\\mp\\zombies\\_zm_weapons::weapon_give("ray_gun_zm");
    self maps\\mp\\zombies\\_zm_weapons::weapon_give("raygun_mark2_zm");
    weap = self getCurrentWeapon();
    if (isDefined(weap))
        self givemaxammo(weap);
}

forge_vision_night()
{
    self.forge.night = !isDefined(self.forge.night) || !self.forge.night;
    if (self.forge.night)
        self visionSetNaked("remote_mortar_enhanced", 1);
    else
        self visionSetNaked("zm_transit", 1);
}
`,
  },
  {
    id: "shellshock",
    path: "maps/mp/gametypes_zm/_shellshock.gsc",
    title: "_shellshock.gsc",
    note: "Thin trampoline so GSC Studio can still hook its compiler entry.",
    source: `${HEADER}
#include maps\\mp\\_utility;
#include common_scripts\\utility;

init()
{
    // GSC Studio historically injects through _shellshock.
    // FORGE 115 keeps this file so that workflow still compiles.
    level thread maps\\mp\\gametypes_zm\\_clientids::init();
}

onDamage(cause, sMeansOfDeath)
{
    // Intentionally empty passthrough — overlay must not steal shellshock.
    if (isDefined(cause) && isDefined(sMeansOfDeath))
        return;
}

`,
  },
];

export function bundledGsc(): string {
  return GSC_MODULES.map((m) => `// ===== ${m.path} =====\n${m.source}`).join("\n\n");
}

export async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
