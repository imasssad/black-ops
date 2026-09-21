// FORGE 115 — Black Ops II Zombies menu framework
// Target: T6 / Plutonium T6ZM and GSC Studio (maps/mp/gametypes_zm/_clientids.gsc)
// Zombies-first. Multiplayer stubs are no-ops until a co-op pass lands.
// This file is original source for FORGE 115, not a decompile of third-party menus.

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
            self maps\mp\zombies\_zm_weapons::weapon_give("ray_gun_zm");
            break;
        case "w_mk2":
            self maps\mp\zombies\_zm_weapons::weapon_give("raygun_mark2_zm");
            break;
        case "pap":
            cur = self getCurrentWeapon();
            up = maps\mp\zombies\_zm_weapons::get_upgrade_weapon(cur, false);
            if (isDefined(up))
                self maps\mp\zombies\_zm_weapons::weapon_give(up);
            break;
        case "maxammo":
            weap = self getCurrentWeapon();
            self givemaxammo(weap);
            break;
        case "p500":
            self maps\mp\zombies\_zm_score::add_to_player_score(500);
            break;
        case "p5k":
            self maps\mp\zombies\_zm_score::add_to_player_score(5000);
            break;
        case "p100k":
            self maps\mp\zombies\_zm_score::add_to_player_score(100000);
            break;
        case "p0":
            if (self.score > 0)
                self maps\mp\zombies\_zm_score::minus_to_player_score(self.score);
            break;
        case "skip":
            forge_skip_round(1);
            break;
        case "r10":
            forge_skip_round(10);
            break;
        case "perk_jug":
            self maps\mp\zombies\_zm_perks::give_perk("specialty_armorvest");
            break;
        case "perk_sc":
            self maps\mp\zombies\_zm_perks::give_perk("specialty_fastreload");
            break;
        case "perk_all":
            keys = strTok("specialty_armorvest,specialty_quickrevive,specialty_fastreload,specialty_rof,specialty_longersprint,specialty_deadshot,specialty_additionalprimaryweapon,specialty_flakjacket", ",");
            for (i = 0; i < keys.size; i++)
                self maps\mp\zombies\_zm_perks::give_perk(keys[i]);
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
            thread maps\mp\zombies\_zm_blockers::open_all_doors();
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
            maps\mp\zombies\_zm_powerups::specific_powerup_drop("nuke", self.origin);
            break;
        case "dropammo":
            maps\mp\zombies\_zm_powerups::specific_powerup_drop("full_ammo", self.origin);
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
