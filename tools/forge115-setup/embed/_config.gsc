// FORGE 115 — Black Ops II Zombies menu framework
// Target: T6 / Plutonium T6ZM and GSC Studio (maps/mp/gametypes_zm/_clientids.gsc)
// Zombies-first. Multiplayer stubs are no-ops until a co-op pass lands.
// This file is original source for FORGE 115, not a decompile of third-party menus.

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
