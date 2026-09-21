// FORGE 115 — Black Ops II Zombies menu framework
// Target: T6 / Plutonium T6ZM and GSC Studio (maps/mp/gametypes_zm/_clientids.gsc)
// Zombies-first. Multiplayer stubs are no-ops until a co-op pass lands.
// This file is original source for FORGE 115, not a decompile of third-party menus.

#include maps\mp\_utility;
#include common_scripts\utility;
#include maps\mp\gametypes_zm\_hud_util;
#include maps\mp\zombies\_zm_utility;
#include maps\mp\zombies\_zm_score;
#include maps\mp\zombies\_zm_perks;
#include maps\mp\zombies\_zm_weapons;
#include maps\mp\zombies\_zm_powerups;
#include maps\mp\zombies\_zm_laststand;

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
            maps\mp\zombies\_zm_laststand::auto_revive(self);
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
