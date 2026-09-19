export type GameArt = {
  map: HTMLImageElement | null;
  player: HTMLImageElement | null;
  zombie: HTMLImageElement | null;
  ready: boolean;
};

export const ART: GameArt = {
  map: null,
  player: null,
  zombie: null,
  ready: false,
};

function loadImg(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

let pending: Promise<void> | null = null;

export function loadGameArt(): Promise<void> {
  if (ART.ready) return Promise.resolve();
  if (pending) return pending;
  pending = Promise.all([
    loadImg("/maps/green-run.jpg"),
    loadImg("/sprites/player.png"),
    loadImg("/sprites/zombie.png"),
  ]).then(([map, player, zombie]) => {
    ART.map = map;
    ART.player = player;
    ART.zombie = zombie;
    ART.ready = true;
  });
  return pending;
}

/** Sheet rows: 0 up, 1 right, 2 down, 3 left (generation order). */
export function dirRow(angle: number): number {
  let a = angle;
  while (a < 0) a += Math.PI * 2;
  while (a >= Math.PI * 2) a -= Math.PI * 2;
  if (a < Math.PI / 4 || a >= Math.PI * 7 / 4) return 1;
  if (a < Math.PI * 3 / 4) return 2;
  if (a < Math.PI * 5 / 4) return 3;
  return 0;
}

export function blitSheet(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  row: number,
  col: number,
  x: number,
  y: number,
  size: number,
) {
  const cw = img.width / 4;
  const ch = img.height / 4;
  ctx.drawImage(img, col * cw, row * ch, cw, ch, x - size / 2, y - size * 0.72, size, size);
}
