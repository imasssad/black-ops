FORGE 115 GSC pack
==================

Download the live scripts from the Source tab of this studio. Hashes shown there
are SHA-256 of the exact text you receive. SHA256SUMS.txt is the same list.

Layout:

  maps/mp/gametypes_zm/_clientids.gsc     entry (GSC Studio)
  maps/mp/gametypes_zm/_shellshock.gsc    compiler trampoline
  scripts/zm/forge115/_menu.gsc           overlay HUD
  scripts/zm/forge115/_actions.gsc        Zombies toggles
  scripts/zm/forge115/_config.gsc         hotkeys / layout
  scripts/zm/forge115/_hooks.gsc          advanced host hooks
  forge115-config.json                    studio defaults

Loader (file copy only):

  tools/Forge115.Loader/Program.cs
  tools/Forge115.Loader/Forge115.Loader.csproj

    dotnet run --project tools/Forge115.Loader -- path/to/gsc

Do not load this pack into VAC-protected official Steam servers.
Private / hosted Zombies only.
