import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

const RAMP = " .:-=+*#%@";
const CELL = 12;

export type CurtainHandle = {
  /** Cover with an ASCII wave, call onMid when fully covered, then reveal. */
  swap: (onMid?: () => void | Promise<void>) => Promise<void>;
  /** Reveal from fully covered. */
  reveal: () => Promise<void>;
};

type Props = {
  className?: string;
  startCovered?: boolean;
  cover?: string;
  ink?: string;
  duration?: number;
};

export const AsciiCurtain = forwardRef<CurtainHandle, Props>(function AsciiCurtain(
  { className = "", startCovered = true, cover = "#000000", ink = "#b4c5f8", duration = 750 },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grid = useRef({ cols: 0, rows: 0, cell: CELL, seeds: new Float32Array(0) });
  const state = useRef<{ covered: boolean; busy: boolean }>({ covered: startCovered, busy: false });
  const reduced = useRef(false);

  const paintStatic = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    if (state.current.covered) {
      ctx.fillStyle = cover;
      ctx.fillRect(0, 0, c.width, c.height);
    }
  }, [cover]);

  const resize = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.max(1, Math.round(r.width * dpr));
    c.height = Math.max(1, Math.round(r.height * dpr));
    const ctx = c.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Bigger cells on phones: ~45% fewer glyphs for the same intro.
    const cell = r.width < 640 ? 16 : CELL;
    const cols = Math.ceil(r.width / cell);
    const rows = Math.ceil(r.height / cell);
    const seeds = new Float32Array(cols * rows);
    for (let i = 0; i < seeds.length; i++) seeds[i] = Math.random();
    grid.current = { cols, rows, cell, seeds };
    if (!state.current.busy) paintStatic();
  }, [paintStatic]);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    resize();
    const ro = new ResizeObserver(resize);
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, [resize]);

  const run = useCallback(
    (mode: "in" | "out") =>
      new Promise<void>((resolve) => {
        const c = canvasRef.current;
        if (!c) return resolve();
        if (reduced.current) {
          state.current.covered = mode === "out";
          paintStatic();
          return resolve();
        }
        const ctx = c.getContext("2d")!;
        state.current.busy = true;
        const t0 = performance.now();
        const frameMs = 1000 / 40;
        let last = 0;
        const frame = (now: number) => {
          if (now - last < frameMs) {
            requestAnimationFrame(frame);
            return;
          }
          last = now;
          const p = Math.min(1, (now - t0) / duration);
          const { cols, rows, cell, seeds } = grid.current;
          const w = c.width;
          const h = c.height;
          ctx.save();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, w, h);
          ctx.restore();
          ctx.font = `700 ${cell - 1}px "Space Mono", monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const diag = cols + rows;
          for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
              const s = seeds[y * cols + x];
              const t = ((x + y) / diag) * 0.72 + s * 0.28;
              const l = Math.max(0, Math.min(1, (p * 1.45 - t) / 0.45));
              const coveredCell = mode === "in" ? l < 0.5 : l >= 0.5;
              const px = x * cell;
              const py = y * cell;
              const k = l > 0 && l < 1 ? Math.sin(l * Math.PI) : 0;
              if (coveredCell || k > 0.15) {
                ctx.fillStyle = cover;
                ctx.globalAlpha = coveredCell ? 1 : k * 0.85;
                ctx.fillRect(px, py, cell, cell);
              }
              if (k > 0.05) {
                const ch = RAMP[Math.min(RAMP.length - 1, Math.round(k * (RAMP.length - 1)))];
                ctx.globalAlpha = 0.35 + k * 0.65;
                ctx.fillStyle = s > 0.985 ? "#d71921" : ink;
                ctx.fillText(ch, px + cell / 2, py + cell / 2 + 1);
              }
            }
          }
          ctx.globalAlpha = 1;
          if (p < 1) requestAnimationFrame(frame);
          else {
            state.current.covered = mode === "out";
            state.current.busy = false;
            paintStatic();
            resolve();
          }
        };
        requestAnimationFrame(frame);
      }),
    [cover, ink, duration, paintStatic],
  );

  useImperativeHandle(
    ref,
    () => ({
      reveal: async () => {
        if (state.current.busy || !state.current.covered) return;
        await run("in");
      },
      swap: async (onMid) => {
        if (state.current.busy) return;
        await run("out");
        await onMid?.();
        await new Promise((r) => setTimeout(r, 80));
        await run("in");
      },
    }),
    [run],
  );

  return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
});
