// FORGE 115 — Black Ops II Zombies menu framework
// Target: T6 / Plutonium T6ZM and GSC Studio (maps/mp/gametypes_zm/_clientids.gsc)
// Zombies-first. Multiplayer stubs are no-ops until a co-op pass lands.
// This file is original source for FORGE 115, not a decompile of third-party menus.

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
