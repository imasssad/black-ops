export type Technique = {
  id: string;
  n: string;
  title: string;
  pattern: string;
  body: string;
  snippet: string;
  tryId?: string;
  tryExtra?: string | number;
};

export const TECHNIQUES: Technique[] = [
  {
    id: "host-gate",
    n: "01",
    title: "Host gate",
    pattern: "isHost()",
    body: "Unsigned scripts run in the host VM. Gate the overlay and every world write so clients in the lobby never get a half-drawn HUD or a score they did not earn.",
    snippet: `on_player_spawned()
{
    self endon("disconnect");
    level endon("game_ended");
    for (;;)
    {
        self waittill("spawned_player");
        if (!self isHost())
            continue;
        self thread forge_input_loop();
        self thread forge_hooks_start();
    }
}`,
    tryId: "hostGate",
  },
  {
    id: "endon",
    n: "02",
    title: "endon-safe threads",
    pattern: "endon + waittill",
    body: "Every loop that touches the player must die with the player. Forget endon(\"disconnect\") and you leak HUD elems, ammo loops, and UFO threads into the next map.",
    snippet: `forge_ammo_loop()
{
    self endon("disconnect");
    level endon("game_ended");
    for (;;)
    {
        if (isDefined(self.forge) && self.forge.infinite_ammo)
        {
            weap = self getCurrentWeapon();
            if (isDefined(weap) && weap != "none")
                self setWeaponAmmoClip(weap, weaponClipSize(weap));
        }
        wait 0.15;
    }
}`,
  },
  {
    id: "bus",
    n: "03",
    title: "Notify bus",
    pattern: "level notify / waittill",
    body: "Do not call every helper from the menu switch. Fire a named notify with the player and a command string. Listeners (HUD, FX, logging) subscribe without coupling to the overlay.",
    snippet: `forge_notify_bus()
{
    level endon("game_ended");
    for (;;)
    {
        level waittill("forge_cmd", player, cmd);
        if (!isDefined(player) || !isDefined(cmd))
            continue;
        player iprintln("FORGE bus: " + cmd);
    }
}

forge_fire_notify(cmd)
{
    level notify("forge_cmd", self, cmd);
}`,
    tryId: "notifyPulse",
  },
  {
    id: "ai-walk",
    n: "04",
    title: "AI array walk",
    pattern: "getAiArray",
    body: "Zombie health, run cycle, and freeze are not dvars. Walk the axis array on a short interval and stamp each actor once so new spawns pick up the scale.",
    snippet: `forge_on_ai_spawned()
{
    level endon("game_ended");
    for (;;)
    {
        zoms = getAiArray("axis");
        for (i = 0; i < zoms.size; i++)
        {
            if (isDefined(zoms[i].forge_hooked))
                continue;
            zoms[i].forge_hooked = true;
            if (isDefined(level.forge_hp_mul))
                zoms[i].health = int(zoms[i].health * level.forge_hp_mul);
        }
        wait 0.25;
    }
}`,
    tryId: "zombieHpScale",
    tryExtra: 0.3,
  },
  {
    id: "origin",
    n: "05",
    title: "Origin snapshot",
    pattern: "spawnstruct save / load",
    body: "Teleports are hardcoded pads. A save/load pair stores origin and angles on a struct so you can drop a pin anywhere on Green Run and return without a new menu row per landmark.",
    snippet: `forge_save_origin()
{
    if (!isDefined(self.forge.saved))
        self.forge.saved = spawnstruct();
    self.forge.saved.origin = self.origin;
    self.forge.saved.angles = self.angles;
}

forge_load_origin()
{
    if (!isDefined(self.forge.saved.origin))
        return;
    self setOrigin(self.forge.saved.origin);
    self setPlayerAngles(self.forge.saved.angles);
}`,
    tryId: "savePos",
  },
  {
    id: "ufo",
    n: "06",
    title: "UFO / noclip",
    pattern: "origin lerp thread",
    body: "Host-only fly. Disable weapons, ignore AI, step origin along view-forward. Noclip is the grounded cousin: skip collision, keep the gun. Both die on disconnect.",
    snippet: `forge_ufo_loop()
{
    self endon("disconnect");
    for (;;)
    {
        if (isDefined(self.forge.ufo) && self.forge.ufo)
        {
            self.ignoreme = true;
            dir = anglesToForward(self getPlayerAngles());
            if (self fragButtonPressed())
                self setOrigin(self.origin + dir * 60);
        }
        wait 0.05;
    }
}`,
    tryId: "ufoMode",
  },
  {
    id: "hud-pool",
    n: "07",
    title: "HUD elem pool",
    pattern: "create once, destroy on close",
    body: "newClientHudElem every redraw will hit the T6 elem cap mid-round. Build the background and title at menu init. Row fonts are the only thing you recycle when the cursor moves.",
    snippet: `forge_build_menu()
{
    bg = newClientHudElem(self);
    bg.archived = false;
    bg.alpha = 0;
    bg setShader("white", 268, 340);
    self.forge.hud_bg = bg;
}

forge_clear_rows()
{
    for (i = 0; i < self.forge.hud_rows.size; i++)
        if (isDefined(self.forge.hud_rows[i]))
            self.forge.hud_rows[i] destroy();
    self.forge.hud_rows = [];
}`,
  },
  {
    id: "vision",
    n: "08",
    title: "Vision sets",
    pattern: "visionSetNaked",
    body: "Map vision is a client string, not a shader hack. Swap to a night or enhanced set, restore the map default on toggle-off so you do not leave the next round in thermal.",
    snippet: `forge_vision_night()
{
    self.forge.night = !isDefined(self.forge.night) || !self.forge.night;
    if (self.forge.night)
        self visionSetNaked("remote_mortar_enhanced", 1);
    else
        self visionSetNaked("zm_transit", 1);
}`,
    tryId: "visionNight",
  },
  {
    id: "power",
    n: "09",
    title: "Power + doors",
    pattern: "flag_set / _zm_blockers",
    body: "TranZit gates lights, PaP, and perks behind the power flag. Set it, notify the map, then open blockers. Doing only doors leaves the box and PaP dark.",
    snippet: `forge_power_on()
{
    flag_set("power_on");
    level notify("power_on");
    thread maps\\mp\\zombies\\_zm_blockers::open_all_doors();
}`,
    tryId: "powerOn",
  },
  {
    id: "kit",
    n: "10",
    title: "Weapon kits",
    pattern: "weapon_give batch",
    body: "A kit is a named loadout, not twelve menu rows. Give the wonder weapon, fill ammo, leave Pack-a-Punch as a separate action so you can still test the box.",
    snippet: `forge_weapon_kit()
{
    self maps\\mp\\zombies\\_zm_weapons::weapon_give("ray_gun_zm");
    self maps\\mp\\zombies\\_zm_weapons::weapon_give("raygun_mark2_zm");
    self givemaxammo("ray_gun_zm");
}`,
    tryId: "weaponKit",
  },
  {
    id: "vars",
    n: "11",
    title: "Zombie vars",
    pattern: "level.zombie_vars / round_number",
    body: "Insta-kill, drop rates, and round index live on level. Prefer the map helpers (setRoundsPlayed, specific_powerup_drop) over raw dvars so the round manager stays in sync.",
    snippet: `level.zombie_vars["zombie_insta_kill"] = 1;
level.round_number = level.round_number + 1;
level setRoundsPlayed(level.round_number);
level notify("end_of_round");
maps\\mp\\zombies\\_zm_powerups::specific_powerup_drop("nuke", self.origin);`,
    tryId: "instaKill",
  },
  {
    id: "config",
    n: "12",
    title: "Config struct",
    pattern: "spawnstruct, not magic numbers",
    body: "Hotkeys, freeze, and HUD colors belong on level.forge_cfg. Studio exports JSON; the GSC reads the struct. Hand-editing F-keys in five files is how menus desync.",
    snippet: `forge_apply_studio_config()
{
    if (!isDefined(level.forge_cfg))
        level.forge_cfg = spawnstruct();
    level.forge_cfg.open = "actionslot 1";
    level.forge_cfg.freeze = true;
    level.forge_cfg.bg_alpha = 0.88;
}`,
  },
];
