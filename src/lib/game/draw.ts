import { PADS, WORLD, type Match } from "@/lib/store";
import { ART, blitSheet, dirRow } from "./assets";

const DIRT = "#1a1c16";
const DIRT2 = "#141610";
const PATH = "#2a2d22";
const FENCE = "#3a3d32";
const EYE = "#8a3d35";
const TOXIN = "#6f9e5a";
const BONE = "#e6e1d3";

let mapCache: HTMLCanvasElement | null = null;

function proceduralMap(): HTMLCanvasElement {
  if (mapCache) return mapCache;
  const c = document.createElement("canvas");
  c.width = WORLD.w;
  c.height = WORLD.h;
  const g = c.getContext("2d")!;
  g.fillStyle = DIRT;
  g.fillRect(0, 0, WORLD.w, WORLD.h);
  for (let i = 0; i < 40; i++) {
    g.fillStyle = i % 2 ? DIRT2 : "#1f2218";
    g.globalAlpha = 0.45;
    g.fillRect((i * 97) % WORLD.w, (i * 61) % WORLD.h, 110, 64);
  }
  g.globalAlpha = 1;
  // corn
  g.strokeStyle = "#3a432c";
  g.lineWidth = 1.2;
  for (let x = 8; x < WORLD.w; x += 10) {
    for (let y = 8; y < WORLD.h; y += 16) {
      if (Math.abs(y - 292) < 36 || Math.abs(x - 420) < 28) continue;
      g.beginPath();
      g.moveTo(x, y + 10);
      g.lineTo(x + ((x * y) % 5) - 2, y);
      g.stroke();
    }
  }
  g.fillStyle = PATH;
  g.fillRect(0, 270, WORLD.w, 44);
  g.fillRect(400, 0, 40, WORLD.h);
  g.strokeStyle = "#b08948";
  g.setLineDash([10, 14]);
  g.beginPath();
  g.moveTo(0, 292);
  g.lineTo(WORLD.w, 292);
  g.moveTo(420, 0);
  g.lineTo(420, WORLD.h);
  g.stroke();
  g.setLineDash([]);
  building(g, 180, 140, 90, 56, "#2b241c");
  building(g, 580, 110, 110, 70, "#26281f");
  building(g, 640, 380, 130, 80, "#221e18");
  building(g, 90, 400, 100, 74, "#1c221c");
  building(g, 390, 50, 80, 48, "#2a2018");
  mapCache = c;
  return c;
}

export function drawMatch(ctx: CanvasRenderingContext2D, m: Match, w: number, h: number) {
  const follow = m.thirdPerson || Math.abs(m.fov - 80) > 0.6;
  const zoom = follow ? Math.max(1, 90 / m.fov) : 1;
  let camX = follow ? m.x : WORLD.w / 2;
  let camY = follow ? m.y : WORLD.h / 2;
  if (m.thirdPerson) {
    camX -= Math.cos(m.angle) * 52;
    camY -= Math.sin(m.angle) * 52;
  }
  const viewW = WORLD.w / zoom;
  const viewH = WORLD.h / zoom;
  camX = Math.max(viewW / 2, Math.min(WORLD.w - viewW / 2, camX));
  camY = Math.max(viewH / 2, Math.min(WORLD.h - viewH / 2, camY));

  const trauma = Math.min(1, m.trauma);
  const kick = trauma * trauma * 11;
  ctx.save();
  ctx.fillStyle = DIRT;
  ctx.fillRect(0, 0, w, h);
  ctx.translate(w / 2 + (Math.random() - 0.5) * kick, h / 2 + (Math.random() - 0.5) * kick);
  ctx.scale(w / viewW, h / viewH);
  ctx.translate(-camX, -camY);

  if (ART.map) ctx.drawImage(ART.map, 0, 0, WORLD.w, WORLD.h);
  else ctx.drawImage(proceduralMap(), 0, 0);

  ctx.save();
  ctx.globalAlpha = 0.32 + Math.sin(performance.now() / 380) * 0.1;
  ctx.fillStyle = TOXIN;
  ctx.beginPath();
  ctx.arc(430, 300, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (!m.doorsOpen) {
    ctx.strokeStyle = FENCE;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(300, 180);
    ctx.lineTo(300, 250);
    ctx.moveTo(520, 320);
    ctx.lineTo(600, 320);
    ctx.stroke();
  }

  for (const pad of PADS) {
    ctx.fillStyle = "rgba(111,158,90,0.16)";
    ctx.fillRect(pad.x - 11, pad.y - 11, 22, 22);
  }

  for (const t of m.tracers) {
    ctx.strokeStyle = `rgba(230,225,211,${Math.min(1, t.life * 4)})`;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(t.x, t.y);
    ctx.lineTo(t.tx, t.ty);
    ctx.stroke();
  }

  for (const p of m.pickups) drawPickup(ctx, p.x, p.y, p.kind, p.life);

  const now = performance.now();
  for (const z of m.zombies) {
    const col = Math.floor((now / 140 + z.id) % 4);
    const row = dirRow(z.angle);
    if (ART.zombie) blitSheet(ctx, ART.zombie, row, col, z.x, z.y, z.crawl ? 30 : 38);
    else drawZombie(ctx, z.x, z.y, z.angle, z.hp / z.maxHp, z.crawl);
    ctx.fillStyle = "rgba(138,61,53,0.85)";
    ctx.fillRect(z.x - 10, z.y - 22, 20 * (z.hp / z.maxHp), 2);
  }

  for (const b of m.bits) {
    ctx.fillStyle = b.color;
    ctx.globalAlpha = Math.max(0, b.life);
    ctx.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
    ctx.globalAlpha = 1;
  }

  drawPlayer(ctx, m);

  for (const p of m.pops) {
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = BONE;
    ctx.font = "700 11px 'Share Tech Mono', monospace";
    ctx.fillText(p.text, p.x - 8, p.y);
    ctx.globalAlpha = 1;
  }

  const vg = ctx.createRadialGradient(camX, camY, Math.min(viewW, viewH) * 0.18, camX, camY, Math.max(viewW, viewH) * 0.72);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = vg;
  ctx.fillRect(camX - viewW, camY - viewH, viewW * 2, viewH * 2);

  ctx.restore();

  if (m.visionNight) {
    ctx.fillStyle = "rgba(48, 86, 36, 0.32)";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(12, 16, 10, 0.18)";
    for (let y = 0; y < h; y += 3) ctx.fillRect(0, y, w, 1);
  }
  if (m.notifyFlash > 0) {
    ctx.fillStyle = `rgba(111, 158, 90, ${Math.min(0.28, m.notifyFlash * 0.22)})`;
    ctx.fillRect(0, 0, w, h);
  }
}

function drawPickup(ctx: CanvasRenderingContext2D, x: number, y: number, kind: string, life: number) {
  const bob = Math.sin(performance.now() / 180 + x) * 3;
  const colors: Record<string, string> = {
    nuke: "#8a3d35",
    insta: "#b08948",
    double: "#6f9e5a",
    ammo: "#cfd4c4",
    carpenter: "#8b8a7a",
    sale: "#b08948",
  };
  const letters: Record<string, string> = {
    nuke: "N",
    insta: "I",
    double: "D",
    ammo: "M",
    carpenter: "C",
    sale: "F",
  };
  ctx.save();
  ctx.translate(x, y + bob);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = colors[kind] ?? TOXIN;
  ctx.globalAlpha = Math.min(1, life / 3);
  ctx.fillRect(-7, -7, 14, 14);
  ctx.restore();
  ctx.fillStyle = BONE;
  ctx.font = "700 9px 'Share Tech Mono', monospace";
  ctx.textAlign = "center";
  ctx.fillText(letters[kind] ?? "?", x, y + bob + 3);
  ctx.textAlign = "start";
}

function building(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: string) {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(x, y, w, 6);
  ctx.fillStyle = "rgba(230,225,211,0.08)";
  ctx.fillRect(x + 8, y + 12, 10, 8);
  ctx.fillRect(x + 24, y + 12, 10, 8);
}

function drawZombie(ctx: CanvasRenderingContext2D, x: number, y: number, ang: number, hp: number, crawl: boolean) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang);
  ctx.fillStyle = "#2a241c";
  ctx.fillRect(crawl ? -10 : -7, -5, crawl ? 20 : 16, 10);
  ctx.fillStyle = "#1a1612";
  ctx.fillRect(6, -4, 7, 8);
  ctx.fillStyle = EYE;
  ctx.fillRect(10, -3, 2, 2);
  ctx.fillRect(10, 1, 2, 2);
  ctx.fillStyle = "rgba(138,61,53,0.8)";
  ctx.fillRect(-6, -8, 12 * hp, 2);
  ctx.restore();
}

function drawPlayer(ctx: CanvasRenderingContext2D, m: Match) {
  const col = m.moving ? Math.floor(m.walkT * 9) % 4 : 0;
  const row = dirRow(m.angle);
  if (m.godMode) {
    ctx.strokeStyle = TOXIN;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.arc(m.x, m.y, 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  if (ART.player) blitSheet(ctx, ART.player, row, col, m.x, m.y, m.thirdPerson ? 38 : 30);
  else {
    ctx.save();
    ctx.translate(m.x, m.y);
    ctx.rotate(m.angle);
    ctx.fillStyle = m.thirdPerson ? "#8b8a7a" : "#cfd4c4";
    ctx.fillRect(-8, -6, 16, 12);
    ctx.fillStyle = TOXIN;
    ctx.fillRect(6, -2, 12, 3);
    ctx.fillStyle = "#0c0d0b";
    ctx.fillRect(-2, -3, 5, 6);
    ctx.restore();
  }
  const now = performance.now() / 1000;
  if (now - m.lastFire < 0.07) {
    ctx.fillStyle = "#f2e6c4";
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.arc(m.x + Math.cos(m.angle) * 18, m.y + Math.sin(m.angle) * 18, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  ctx.strokeStyle = TOXIN;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(m.x, m.y);
  ctx.lineTo(m.x + Math.cos(m.angle) * 16, m.y + Math.sin(m.angle) * 16);
  ctx.stroke();
}
