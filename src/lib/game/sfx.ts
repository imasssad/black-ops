let ac: AudioContext | null = null;

function ctx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ac) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ac = new C();
  }
  return ac;
}

export function unlockAudio() {
  const c = ctx();
  if (c && c.state === "suspended") void c.resume();
}

function tone(freq: number, dur: number, type: OscillatorType, vol: number, slide = 0) {
  const c = ctx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.value = vol;
  o.connect(g);
  g.connect(c.destination);
  const t0 = c.currentTime;
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t0 + dur);
  o.start(t0);
  o.stop(t0 + dur + 0.02);
}

export const sfx = {
  fire: () => tone(180 + Math.random() * 40, 0.05, "square", 0.035, -80),
  hit: () => tone(90, 0.07, "sawtooth", 0.03, -40),
  kill: () => {
    tone(140, 0.12, "square", 0.04, -90);
    tone(320, 0.08, "triangle", 0.02, 40);
  },
  pickup: () => tone(520, 0.16, "triangle", 0.04, 180),
  toggle: () => tone(440, 0.06, "square", 0.025),
  menu: () => tone(260, 0.08, "triangle", 0.03),
  down: () => tone(70, 0.28, "sawtooth", 0.05, -50),
};
