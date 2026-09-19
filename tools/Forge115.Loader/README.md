# FORGE 115 Loader

Copies the GSC pack into Plutonium T6 storage. It is a file copy — not a Steam
process injector and not a VAC bypass.

```
dotnet run --project tools/Forge115.Loader -- path/to/gsc
```

Default destination:

`%localappdata%\Plutonium\storage\t6\scripts\zm\forge115`

Load only into a game you host. Official VAC-protected Steam servers are not supported.
