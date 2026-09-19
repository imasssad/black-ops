import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/shell/AppShell";
import { Button } from "@/components/ui/button";
import { CATEGORIES, ITEM_BY_ID, type CategoryId } from "@/lib/menu-catalog";
import { exportStudioConfig, useForge } from "@/lib/store";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/studio")({ component: StudioPage });

function StudioPage() {
  const settings = useForge((s) => s.settings);
  const [listening, setListening] = useState<string | null>(null);
  const [tab, setTab] = useState<CategoryId>("combat");

  const exportJson = () => {
    const blob = new Blob([exportStudioConfig()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "forge115-config.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-[11px] tracking-[0.24em] text-accent uppercase">Studio</p>
        <h1 className="mt-1 font-display text-5xl leading-none">Hotkeys & layout</h1>
        <p className="mt-3 max-w-xl text-sm text-muted">
          Remap the overlay, reorder items, then drop back into the match. Settings stay on this device.
          Shift+Up/Down also reorders while the overlay is open.
        </p>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="border border-border bg-surface p-4 sm:p-5">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setTab(c.id)}
                  className={
                    "min-h-11 px-3 py-2 font-mono text-[10px] tracking-[0.16em] uppercase " +
                    (tab === c.id ? "bg-fg text-bg" : "text-muted hover:text-fg")
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>
            <ul className="mt-4 divide-y divide-border">
              {settings.layout[tab].map((id, index) => {
                const item = ITEM_BY_ID[id];
                if (!item) return null;
                const key = settings.hotkeys[id];
                return (
                  <li key={id} className="flex items-center gap-3 py-2.5">
                    <div className="flex flex-col">
                      <button
                        type="button"
                        className="flex size-11 items-center justify-center text-muted hover:text-fg"
                        onClick={() => useForge.getState().moveItem(tab, index, -1)}
                        aria-label="Move up"
                      >
                        <ArrowUp className="size-4" />
                      </button>
                      <button
                        type="button"
                        className="flex size-11 items-center justify-center text-muted hover:text-fg"
                        onClick={() => useForge.getState().moveItem(tab, index, 1)}
                        aria-label="Move down"
                      >
                        <ArrowDown className="size-4" />
                      </button>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm">{item.label}</div>
                      <div className="font-mono text-[10px] text-faint">
                        {item.placeholder ? "MP placeholder" : item.kind}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="min-h-11 min-w-16 border border-border px-2 py-2 font-mono text-[11px] text-fg"
                      onClick={() => setListening(id)}
                    >
                      {listening === id ? "Press…" : (key ?? "—")}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <aside className="flex flex-col gap-4">
            <div className="border border-border bg-surface p-4">
              <div className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">Open overlay</div>
              <button
                type="button"
                className="mt-2 w-full border border-border px-3 py-3 font-mono text-sm"
                onClick={() => setListening("open")}
              >
                {listening === "open" ? "Press a key…" : settings.openMenuKey}
              </button>
              <label className="mt-4 flex items-center justify-between gap-3 text-sm">
                <span>Freeze while open</span>
                <input
                  type="checkbox"
                  checked={settings.freezeOnMenu}
                  onChange={(e) => useForge.getState().patchSettings({ freezeOnMenu: e.target.checked })}
                  className="size-4 accent-accent"
                />
              </label>
            </div>
            <div className="border border-border bg-surface p-4">
              <div className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">Look</div>
              <Field
                label="Background alpha"
                value={settings.bgAlpha}
                min={0.5}
                max={1}
                step={0.02}
                onChange={(v) => useForge.getState().patchSettings({ bgAlpha: v })}
              />
              <Field
                label="Menu X"
                value={settings.menuX}
                min={8}
                max={200}
                step={1}
                onChange={(v) => useForge.getState().patchSettings({ menuX: v })}
              />
              <Field
                label="Menu Y"
                value={settings.menuY}
                min={48}
                max={220}
                step={1}
                onChange={(v) => useForge.getState().patchSettings({ menuY: v })}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="accent" size="sm" onClick={exportJson}>
                Export JSON
              </Button>
              <Button variant="outline" size="sm" onClick={() => useForge.getState().resetHotkeys()}>
                Reset keys
              </Button>
              <Button variant="outline" size="sm" onClick={() => useForge.getState().resetLayout()}>
                Reset layout
              </Button>
            </div>
          </aside>
        </section>
      </div>
      {listening ? <KeyListener id={listening} onDone={() => setListening(null)} /> : null}
    </AppShell>
  );
}

function Field({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="mt-3 block text-xs text-muted">
      {label}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-accent"
      />
    </label>
  );
}

function KeyListener({ id, onDone }: { id: string; onDone: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/70"
      onKeyDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.code === "Escape") {
          onDone();
          return;
        }
        const label = codeToLabel(e.code);
        if (id === "open") useForge.getState().setOpenMenuKey(label);
        else useForge.getState().setHotkey(id, label);
        onDone();
      }}
      tabIndex={0}
      ref={(el) => el?.focus()}
    >
      <div className="border border-border bg-surface px-8 py-6 text-center">
        <div className="font-display text-3xl">Press a key</div>
        <div className="mt-2 text-sm text-muted">Escape cancels</div>
      </div>
    </div>
  );
}

function codeToLabel(code: string) {
  if (/^F\d{1,2}$/.test(code)) return code;
  if (code === "Insert") return "Insert";
  if (code.startsWith("Key") && code.length === 4) return code.slice(3);
  if (code.startsWith("Digit")) return code.slice(5);
  return code;
}
