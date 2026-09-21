// FORGE 115 — Black Ops II Zombies menu framework
// Target: T6 / Plutonium T6ZM and GSC Studio (maps/mp/gametypes_zm/_clientids.gsc)
// Zombies-first. Multiplayer stubs are no-ops until a co-op pass lands.
// This file is original source for FORGE 115, not a decompile of third-party menus.

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
    thread maps\mp\zombies\_zm_blockers::open_all_doors();
}

forge_weapon_kit()
{
    self maps\mp\zombies\_zm_weapons::weapon_give("ray_gun_zm");
    self maps\mp\zombies\_zm_weapons::weapon_give("raygun_mark2_zm");
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
