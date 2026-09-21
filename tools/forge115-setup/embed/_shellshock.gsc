// FORGE 115 — Black Ops II Zombies menu framework
// Target: T6 / Plutonium T6ZM and GSC Studio (maps/mp/gametypes_zm/_clientids.gsc)
// Zombies-first. Multiplayer stubs are no-ops until a co-op pass lands.
// This file is original source for FORGE 115, not a decompile of third-party menus.

#include maps\mp\_utility;
#include common_scripts\utility;

init()
{
    // GSC Studio historically injects through _shellshock.
    // FORGE 115 keeps this file so that workflow still compiles.
    level thread maps\mp\gametypes_zm\_clientids::init();
}

onDamage(cause, sMeansOfDeath)
{
    // Intentionally empty passthrough — overlay must not steal shellshock.
    if (isDefined(cause) && isDefined(sMeansOfDeath))
        return;
}

