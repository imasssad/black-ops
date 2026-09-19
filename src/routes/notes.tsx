import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/shell/AppShell";

export const Route = createFileRoute("/notes")({ component: NotesPage });

function NotesPage() {
  return (
    <AppShell>
      <article className="mx-auto max-w-2xl">
        <p className="font-mono text-[11px] tracking-[0.24em] text-accent uppercase">Field notes</p>
        <h1 className="mt-1 font-display text-5xl leading-none">Build & load</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          FORGE 115 is a Zombies-first overlay plus the GSC that drives it. The match on the home screen is the working
          demo: open with a single key, change points, rounds, and weapons, close it, keep playing.
        </p>

        <div className="mt-8 border border-border bg-surface p-4">
          <div className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">Downloads</div>
          <p className="mt-2 text-sm text-muted">GSC scripts and config only. No installer, no studio scaffold.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href="/downloads/forge115.zip"
              download
              className="inline-flex h-11 items-center bg-accent px-4 text-sm tracking-[0.12em] text-accent-fg no-underline uppercase"
            >
              forge115.zip
            </a>
          </div>
        </div>

        <video
          className="mt-8 w-full border border-border bg-surface"
          src="/demo/forge115-menu.mp4"
          poster="/maps/green-run.jpg"
          controls
          playsInline
          preload="metadata"
        />
        <p className="mt-2 font-mono text-[10px] tracking-[0.16em] text-faint uppercase">
          Cinematic pass — the live overlay is on Match
        </p>

        <h2 className="mt-10 font-display text-3xl">What this ships</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
          <li>In-world overlay with categories, sliders, live toggles, and on-the-fly reorder.</li>
          <li>Studio for hotkeys and item order, with JSON export.</li>
          <li>Original GSC framework. SHA-256 on the Source tab proves the download matches this studio.</li>
          <li>A file-copy loader for Plutonium T6 storage — not a kernel driver, not a VAC bypass.</li>
          <li>
            <a href="/craft" className="text-accent no-underline hover:underline">
              Craft
            </a>{" "}
            — host-gate, notify bus, UFO, origin snapshot, vision, AI stamps.
          </li>
        </ul>

        <h2 className="mt-10 font-display text-3xl">What this is not</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Official Steam VAC-protected servers are not a target. This pack does not include a Steam process injector,
          memory offsets, or anti-cheat evasion. Aimbot, force-host, and account-level edits stay as labeled MP
          placeholders. If a lobby is VAC-secured, do not load unsigned scripts into it.
        </p>

        <h2 className="mt-10 font-display text-3xl">Plutonium T6</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted">
          <li>Install Plutonium and launch T6 Zombies once so storage folders exist.</li>
          <li>
            Copy the GSC pack into{" "}
            <code className="font-mono text-fg">%localappdata%\Plutonium\storage\t6\scripts\zm\forge115\</code>
          </li>
          <li>
            Keep <code className="font-mono text-fg">_clientids.gsc</code> at{" "}
            <code className="font-mono text-fg">maps/mp/gametypes_zm/_clientids.gsc</code> if you compile with GSC Studio
            instead.
          </li>
          <li>Start a private Zombies match. Host sees “FORGE 115 loaded”.</li>
        </ol>

        <h2 className="mt-10 font-display text-3xl">Loader</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          <code className="font-mono text-fg">dotnet run --project tools/Forge115.Loader</code> copies the pack. It is a
          file copy into Plutonium storage. Source is in the same folder as a .NET 8 console app.
        </p>

        <h2 className="mt-10 font-display text-3xl">GSC Studio (your upload)</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          The 2016 Studio binary you attached is the compiler. Open the downloaded{" "}
          <code className="font-mono text-fg">_clientids.gsc</code>, compile, then inject only into a game you host
          locally. The old compiled menu in your zip was obfuscated bytecode; this studio ships readable source and a
          matching hash instead of that blob.
        </p>

        <h2 className="mt-10 font-display text-3xl">Hotkeys (defaults)</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 font-mono text-sm text-muted">
          <li>F4 — open overlay</li>
          <li>F1 — god mode</li>
          <li>F3 — cycle / give Ray Gun</li>
          <li>F5 — skip round</li>
          <li>F6 — +5,000 points</li>
          <li>F7 — infinite ammo</li>
          <li>F8 — insta-kill</li>
          <li>F9 — kill all zombies</li>
        </ul>

        <h2 className="mt-10 font-display text-3xl">Stability</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          With the overlay closed, the match uses stock movement and combat. Freeze-on-open (Studio) stops the player
          from walking while you click sliders. Auto-revive, god mode, and timescale are toggles — turn them off and
          the round behaves again. ACCOUNT and HOST pages are stubs so a later co-op pass can land without rewriting
          the tree.
        </p>
      </article>
    </AppShell>
  );
}
