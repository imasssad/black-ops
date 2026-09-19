import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/shell/AppShell";
import { Button } from "@/components/ui/button";
import { GSC_MODULES, sha256 } from "@/lib/gsc/sources";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/source")({ component: SourcePage });

function SourcePage() {
  const [active, setActive] = useState(GSC_MODULES[0]!.id);
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [fileHashes, setFileHashes] = useState<Record<string, string>>({});
  const mod = GSC_MODULES.find((m) => m.id === active) ?? GSC_MODULES[0]!;

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const next: Record<string, string> = {};
      const files: Record<string, string> = {};
      for (const m of GSC_MODULES) {
        next[m.id] = await sha256(m.source);
        try {
          const text = await fetch(`/gsc/${m.path}`).then((r) => {
            if (!r.ok) throw new Error("missing");
            return r.text();
          });
          files[m.id] = await sha256(text);
        } catch {
          files[m.id] = "";
        }
      }
      if (!cancelled) {
        setHashes(next);
        setFileHashes(files);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const download = (m: (typeof GSC_MODULES)[number]) => {
    const blob = new Blob([m.source], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = m.path.split("/").pop() ?? "forge115.gsc";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const downloadAll = () => {
    const parts = GSC_MODULES.map((m) => `// FILE: ${m.path}\n${m.source}`).join("\n\n");
    const blob = new Blob([parts], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "forge115-gsc-pack.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const match = hashes[mod.id] && fileHashes[mod.id] && hashes[mod.id] === fileHashes[mod.id];

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] tracking-[0.24em] text-accent uppercase">Source</p>
        <h1 className="mt-1 font-display text-5xl leading-none">GSC framework</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Modular T6 scripts for Zombies. SHA-256 is computed in the browser from the same text you download —
          green MATCH means the file on disk is byte-identical to this studio.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={downloadAll}>
            Download pack
          </Button>
          <a
            href="/gsc/SHA256SUMS.txt"
            className="inline-flex h-9 items-center border border-border px-3 text-sm text-fg no-underline hover:bg-surface-2"
          >
            SHA256SUMS
          </a>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
          <nav className="flex flex-col gap-1">
            {GSC_MODULES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setActive(m.id)}
                className={
                  "border border-transparent px-3 py-3 text-left " +
                  (active === m.id ? "border-border bg-surface" : "hover:bg-surface")
                }
              >
                <div className="font-mono text-xs text-fg">{m.title}</div>
                <div className="mt-1 text-[11px] text-muted">{m.note}</div>
              </button>
            ))}
          </nav>
          <div className="border border-border bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
              <div>
                <div className="font-mono text-xs text-fg">{mod.path}</div>
                <div className="mt-1 font-mono text-[10px] break-all text-faint">
                  SHA-256 {hashes[mod.id] ?? "…"}
                </div>
                <div className={"mt-1 font-mono text-[10px] " + (match ? "text-accent" : "text-muted")}>
                  {fileHashes[mod.id]
                    ? match
                      ? "MATCH — disk file equals this source"
                      : "MISMATCH — re-download the pack"
                    : "Pack file not found"}
                </div>
              </div>
              <Button variant="accent" size="sm" onClick={() => download(mod)}>
                Download
              </Button>
            </div>
            <pre className="max-h-[70vh] overflow-auto p-4 font-mono text-[11px] leading-relaxed text-hud">
              {mod.source}
            </pre>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
