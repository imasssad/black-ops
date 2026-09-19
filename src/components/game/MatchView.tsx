import { useEffect, useRef, useState, type PointerEvent } from "react";
import { drawMatch } from "@/lib/game/draw";
import { loadGameArt } from "@/lib/game/assets";
import { unlockAudio } from "@/lib/game/sfx";
import { CATEGORIES } from "@/lib/menu-catalog";
import { useForge, WORLD, type InputFrame } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Hud } from "./Hud";
import { ModMenu, activate, cycleCategory } from "./ModMenu";

type Keys = Set<string>;

function frameFrom(keys: Keys, aimX: number, aimY: number, fire: boolean): InputFrame {
  let ax = 0;
  let ay = 0;
  if (keys.has("KeyA") || keys.has("ArrowLeft")) ax -= 1;
  if (keys.has("KeyD") || keys.has("ArrowRight")) ax += 1;
  if (keys.has("KeyW") || keys.has("ArrowUp")) ay -= 1;
  if (keys.has("KeyS") || keys.has("ArrowDown")) ay += 1;
  const len = Math.hypot(ax, ay) || 1;
  return {
    ax: ax / len,
    ay: ay / len,
    aimX,
    aimY,
    fire: fire || keys.has("Space"),
    melee: keys.has("KeyV") || keys.has("KeyF"),
  };
}

export function MatchView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const keysRef = useRef<Keys>(new Set());
  const aimRef = useRef({ x: WORLD.w / 2, y: WORLD.h / 2 });
  const fireRef = useRef(false);
  const stickRef = useRef({ x: 0, y: 0, active: false });
  const [stickPos, setStickPos] = useState({ x: 0, y: 0, show: false });
  const phase = useForge((s) => s.match.phase);
  const menuOpen = useForge((s) => s.menuOpen);
  const demo = useForge((s) => s.match.demoPlaying);

  useEffect(() => {
    void loadGameArt();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent, down: boolean) => {
      if (e.repeat && down) return;
      const code = e.code;
      const s = useForge.getState();
      const openCode = keyToCode(s.settings.openMenuKey);
      if (down && (code === openCode || code === "Insert" || code === "KeyI") && !isTyping(e)) {
        e.preventDefault();
        s.setMenuOpen(!s.menuOpen);
        return;
      }
      if (down && !s.menuOpen && !isTyping(e)) {
        for (const [id, key] of Object.entries(s.settings.hotkeys)) {
          if (keyToCode(key) === code) {
            e.preventDefault();
            activate(id);
            return;
          }
        }
      }
      if (s.menuOpen && down) {
        const layout = s.settings.layout[s.category];
        if (e.shiftKey && (code === "ArrowUp" || code === "KeyW")) {
          e.preventDefault();
          s.moveItem(s.category, s.cursor, -1);
          s.setCursor(Math.max(0, s.cursor - 1));
          return;
        }
        if (e.shiftKey && (code === "ArrowDown" || code === "KeyS")) {
          e.preventDefault();
          s.moveItem(s.category, s.cursor, 1);
          s.setCursor(Math.min(layout.length - 1, s.cursor + 1));
          return;
        }
        if (code === "ArrowDown" || code === "KeyS") {
          e.preventDefault();
          s.setCursor((s.cursor + 1) % layout.length);
          return;
        }
        if (code === "ArrowUp" || code === "KeyW") {
          e.preventDefault();
          s.setCursor((s.cursor - 1 + layout.length) % layout.length);
          return;
        }
        if (code === "ArrowRight" || code === "KeyD" || code === "Tab") {
          e.preventDefault();
          cycleCategory(1);
          return;
        }
        if (code === "ArrowLeft" || code === "KeyA") {
          e.preventDefault();
          cycleCategory(-1);
          return;
        }
        if (code === "Enter" || code === "Space") {
          e.preventDefault();
          const id = layout[s.cursor];
          if (id) activate(id);
          return;
        }
        if (code === "Escape" || code === "Backspace") {
          e.preventDefault();
          s.setMenuOpen(false);
          return;
        }
      }
      if (!isTyping(e) && !s.menuOpen) {
        if (down) keysRef.current.add(code);
        else keysRef.current.delete(code);
      }
    };
    const down = (e: KeyboardEvent) => onKey(e, true);
    const up = (e: KeyboardEvent) => onKey(e, false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    const blur = () => keysRef.current.clear();
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const s = useForge.getState();
      const m = s.match;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      if (m.phase === "playing") {
        const stick = stickRef.current;
        const keys = keysRef.current;
        let input = frameFrom(keys, aimRef.current.x, aimRef.current.y, fireRef.current);
        if (stick.active) {
          input = { ...input, ax: stick.x, ay: stick.y };
        }
        s.tick(dt, input);
      }
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawMatch(ctx, useForge.getState().match, rect.width, rect.height);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const probe = {
      getYaw: () => useForge.getState().match.angle,
      getSpeed: () => {
        const k = keysRef.current;
        const stick = stickRef.current;
        if (stick.active) return Math.hypot(stick.x, stick.y);
        let ax = 0;
        let ay = 0;
        if (k.has("KeyA")) ax -= 1;
        if (k.has("KeyD")) ax += 1;
        if (k.has("KeyW")) ay -= 1;
        if (k.has("KeyS")) ay += 1;
        return Math.hypot(ax, ay);
      },
      setKeys: (codes: string[]) => {
        keysRef.current = new Set(codes);
      },
      getPos: () => {
        const m = useForge.getState().match;
        return { x: m.x, y: m.y };
      },
    };
    window.__controlsTest = probe;
    return () => {
      delete window.__controlsTest;
    };
  }, []);

  const toWorld = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const r = canvas.getBoundingClientRect();
    aimRef.current.x = ((clientX - r.left) / r.width) * WORLD.w;
    aimRef.current.y = ((clientY - r.top) / r.height) * WORLD.h;
  };

  return (
    <div
      ref={wrapRef}
      className="relative h-[calc(100dvh-52px)] min-h-[420px] overflow-hidden bg-bg touch-none"
      onPointerMove={(e) => {
        if (e.pointerType === "mouse") toWorld(e.clientX, e.clientY);
      }}
      onPointerDown={(e) => {
        if (e.pointerType === "mouse" && e.button === 0) fireRef.current = true;
      }}
      onPointerUp={() => {
        fireRef.current = false;
      }}
      onPointerLeave={() => {
        fireRef.current = false;
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
      <div className="scanline absolute inset-0 z-[1] opacity-40" />
      <Hud />
      <ModMenu />
      {phase === "boot" || phase === "over" || phase === "down" ? (
        <StartGate />
      ) : null}
      {phase === "playing" ? (
        <>
          <TouchStick
            onChange={(x, y, active) => {
              stickRef.current = { x, y, active };
              setStickPos({ x, y, show: active });
            }}
            pos={stickPos}
          />
          <div className="absolute right-4 bottom-28 z-20 flex flex-col gap-2 sm:hidden">
            <button
              type="button"
              className="size-16 rounded-full border border-border bg-surface/80 text-xs tracking-[0.14em] text-fg uppercase"
              onPointerDown={(e) => {
                e.preventDefault();
                fireRef.current = true;
              }}
              onPointerUp={() => {
                fireRef.current = false;
              }}
            >
              Fire
            </button>
            <button
              type="button"
              className="size-12 rounded-full border border-border bg-surface/80 text-[10px] tracking-[0.14em] text-fg uppercase"
              onClick={() => useForge.getState().setMenuOpen(!menuOpen)}
            >
              Menu
            </button>
          </div>
        </>
      ) : null}
      {demo ? (
        <div className="absolute top-3 left-1/2 z-20 -translate-x-1/2 border border-accent/40 bg-bg/80 px-3 py-1 font-mono text-[10px] tracking-[0.18em] text-accent uppercase">
          Demo running
        </div>
      ) : null}
      {phase === "playing" && !menuOpen ? (
        <div className="absolute bottom-3 left-1/2 z-10 hidden -translate-x-1/2 font-mono text-[10px] tracking-[0.16em] text-faint uppercase sm:block">
          WASD move · mouse aim · click fire · V melee
        </div>
      ) : null}
      <CatStrip />
    </div>
  );
}

function CatStrip() {
  const open = useForge((s) => s.menuOpen);
  const cat = useForge((s) => s.category);
  if (!open) return null;
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 flex gap-1 overflow-x-auto border-t border-border bg-bg/90 px-2 py-2 sm:hidden">
      {CATEGORIES.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => useForge.getState().setCategory(c.id)}
          className={
            "shrink-0 px-3 py-2 font-mono text-[10px] tracking-[0.14em] uppercase " +
            (cat === c.id ? "text-accent" : "text-muted")
          }
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}

function StartGate() {
  const phase = useForge((s) => s.match.phase);
  const round = useForge((s) => s.match.round);
  const kills = useForge((s) => s.match.kills);
  const start = () => {
    unlockAudio();
    useForge.getState().resetMatch();
  };
  const demo = () => {
    unlockAudio();
    void runDemo();
  };
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-bg/82 px-6 text-center">
      <p className="font-mono text-[11px] tracking-[0.28em] text-accent uppercase">Element 115</p>
      <h1 className="mt-2 font-display text-6xl leading-none sm:text-7xl">FORGE 115</h1>
      <p className="mt-3 max-w-md text-sm text-muted">
        {phase === "boot"
          ? "A Zombies overlay that sits on the match. Points, rounds, weapons, perks — close it and Green Run keeps running."
          : phase === "down"
            ? "You went down. Auto-revive was off."
            : `Match over. Round ${round} · ${kills} kills.`}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button variant="accent" size="lg" onClick={start} className="min-w-40 tracking-[0.14em] uppercase">
          Drop in
        </Button>
        <Button variant="outline" size="lg" onClick={demo} className="min-w-40 tracking-[0.14em] uppercase">
          Run demo
        </Button>
      </div>
      <p className="mt-6 max-w-sm font-mono text-[11px] leading-relaxed text-faint">
        F4 opens the menu · F1 god mode · F5 skip round · F6 +5000
      </p>
    </div>
  );
}

async function runDemo() {
  const s = useForge.getState();
  s.resetMatch();
  s.setDemoPlaying(true);
  s.pushLog("Demo sequence.");
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  await sleep(700);
  s.setMenuOpen(true);
  s.setCategory("combat");
  await sleep(500);
  s.applyItem("godMode");
  await sleep(450);
  s.setCategory("points");
  await sleep(350);
  s.applyItem("add5000");
  await sleep(400);
  s.setCategory("weapons");
  await sleep(350);
  s.applyItem("giveWeapon", "ray_gun_zm");
  await sleep(400);
  s.setCategory("rounds");
  await sleep(350);
  s.applyItem("skipRound");
  await sleep(500);
  s.setCategory("perks");
  await sleep(300);
  s.applyItem("givePerk", "juggernog");
  await sleep(400);
  s.setMenuOpen(false);
  s.setDemoPlaying(false);
  s.pushLog("Demo complete — overlay closed, match still live.");
}

function TouchStick({
  onChange,
  pos,
}: {
  onChange: (x: number, y: number, active: boolean) => void;
  pos: { x: number; y: number; show: boolean };
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className="absolute bottom-24 left-4 z-20 size-28 rounded-full border border-border bg-surface/50 sm:hidden"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        move(e);
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) move(e);
      }}
      onPointerUp={() => onChange(0, 0, false)}
    >
      <div
        className="absolute top-1/2 left-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/50 bg-accent/30"
        style={
          pos.show
            ? { transform: `translate(calc(-50% + ${pos.x * 28}px), calc(-50% + ${pos.y * 28}px))` }
            : undefined
        }
      />
    </div>
  );

  function move(e: PointerEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width * 2 - 1;
    const y = (e.clientY - r.top) / r.height * 2 - 1;
    const mag = Math.min(1, Math.hypot(x, y) || 1);
    const nx = (x / (Math.hypot(x, y) || 1)) * mag;
    const ny = (y / (Math.hypot(x, y) || 1)) * mag;
    onChange(nx, ny, true);
  }
}

function isTyping(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null;
  return t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
}

function keyToCode(key: string) {
  if (/^F\d{1,2}$/.test(key)) return key;
  if (key === "Insert") return "Insert";
  if (key.length === 1) return `Key${key.toUpperCase()}`;
  return key;
}

declare global {
  interface Window {
    __controlsTest?: {
      getYaw: () => number;
      getSpeed: () => number;
      setKeys: (codes: string[]) => void;
      getPos?: () => { x: number; y: number };
    };
  }
}
