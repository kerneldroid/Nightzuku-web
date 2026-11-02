import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

const RAMP = " .:-=+*#%@";
const NOISE = "!<>-_\\/[]{}=+*^?#01";
const cache = new Map<string, HTMLImageElement>();

export function loadImage(src: string): Promise<HTMLImageElement> {
  const hit = cache.get(src);
  if (hit?.complete && hit.naturalWidth) return Promise.resolve(hit);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => {
      cache.set(src, img);
      resolve(img);
    };
    img.onerror = () => reject(new Error(`load failed: ${src}`));
    img.src = src;
  });
}

type Grid = { cols: number; rows: number; lum: Float32Array };

function sample(img: HTMLImageElement, cols: number, rows: number): Grid | null {
  const c = document.createElement("canvas");
  c.width = cols;
  c.height = rows;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, cols, rows);
  try {
    const d = ctx.getImageData(0, 0, cols, rows).data;
    const lum = new Float32Array(cols * rows);
    for (let i = 0; i < cols * rows; i++) {
      const r = d[i * 4];
      const g = d[i * 4 + 1];
      const b = d[i * 4 + 2];
      const l = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      lum[i] = Math.pow(l, 0.68);
    }
    return { cols, rows, lum };
  } catch {
    return null; // tainted canvas — caller falls back to synthetic noise
  }
}

function synthetic(cols: number, rows: number): Grid {
  const lum = new Float32Array(cols * rows);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const dx = (x / cols - 0.5) * 2;
      const dy = (y / rows - 0.5) * 2;
      lum[y * cols + x] = Math.max(0, 0.85 - Math.hypot(dx, dy * 0.7)) * 0.9;
    }
  }
  return { cols, rows, lum };
}

/** Read a live theme token (they are rewritten by MCU at runtime). */
function token(name: string, fallback: string): [number, number, number] {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const hex = /^#([0-9a-f]{6})$/i.exec(raw);
  if (!hex) return fallback.match(/\w\w/g)!.map((h) => parseInt(h, 16)) as [number, number, number];
  const n = parseInt(hex[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

type Props = {
  src: string;
  alt: string;
  className?: string;
  /** target character columns on desktop */
  cols?: number;
  fit?: "cover" | "contain";
  duration?: number;
  /** bump this number to replay the decode at the same src */
  replayKey?: number;
  /** decode on mount even if the host is just below the fold (hero visual) */
  immediate?: boolean;
  onStatus?: (s: "loading" | "decoding" | "ready" | "error") => void;
};

/**
 * A real screenshot from GitHub, materialised through an ASCII raster.
 * Pixels are read on a canvas, re-drawn as characters, then the screenshot
 * resolves back in on a critically damped curve.
 */
export function AsciiImage({
  src,
  alt,
  className,
  cols = 64,
  fit = "cover",
  duration = 1000,
  replayKey = 0,
  immediate = false,
  onStatus,
}: Props) {
  const host = useRef<HTMLDivElement | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const nextImg = useRef<HTMLImageElement | null>(null);
  const prevImg = useRef<HTMLImageElement | null>(null);
  const inView = useInView(host, { once: true, amount: 0.2 });
  const reduced = useReducedMotion();

  const [shown, setShown] = useState(src);
  const [previous, setPrevious] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(true);
  const lastRun = useRef<string | null>(null);

  useEffect(() => {
    onStatus?.(busy ? "decoding" : failed ? "error" : "ready");
  }, [busy, failed, onStatus]);

  useEffect(() => {
    if (!inView && !immediate) return;
    const runKey = `${src}::${replayKey}`;
    if (lastRun.current === runKey) return;
    const first = lastRun.current === null;
    lastRun.current = runKey;

    let raf = 0;
    let cancelled = false;
    let finished = false;
    setBusy(true);
    setFailed(false);
    setPrevious(first ? null : shown);
    setShown(src);

    const el = host.current;
    const cv = canvas.current;
    if (!el || !cv) return;

    loadImage(src)
      .then((img) => {
        if (cancelled) return;
        const W = el.clientWidth;
        const H = el.clientHeight;
        if (!W || !H) return;

        if (reduced) {
          cv.style.opacity = "0";
          if (nextImg.current) nextImg.current.style.opacity = "1";
          if (prevImg.current) prevImg.current.style.opacity = "0";
          finished = true;
          setBusy(false);
          return;
        }

        const dpr = Math.min(2, window.devicePixelRatio || 1);
        cv.width = Math.floor(W * dpr);
        cv.height = Math.floor(H * dpr);
        const ctx = cv.getContext("2d");
        if (!ctx) return;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const targetCols = W < 420 ? Math.round(cols * 0.62) : cols;
        let fs = W / (targetCols * 0.6);
        ctx.font = `700 ${fs}px "Space Mono", ui-monospace, monospace`;
        const adv = ctx.measureText("M").width || fs * 0.6;
        const nCols = Math.max(8, Math.floor(W / adv));
        const nRows = Math.max(8, Math.floor(H / fs));
        const cw = W / nCols;
        const ch = H / nRows;

        const grid = sample(img, nCols, nRows) ?? synthetic(nCols, nRows);
        const ink = token("--color-primary", "b4c5f8");
        const signal = token("--color-nothing", "d71921");
        const inkCss = `rgb(${ink[0]},${ink[1]},${ink[2]})`;
        const signalCss = `rgb(${signal[0]},${signal[1]},${signal[2]})`;

        // Stable per-cell noise: no Math.random() in the hot loop.
        const noise = new Float32Array(nCols * nRows);
        for (let i = 0; i < noise.length; i++) noise[i] = Math.random();

        // The decode is decorative: 30fps looks identical and halves fillText work.
        const frameMs = 1000 / 30;
        let last = 0;
        const start = performance.now();
        const draw = (now: number) => {
          if (cancelled) return;
          if (now - last < frameMs) {
            raf = requestAnimationFrame(draw);
            return;
          }
          last = now;
          const p = Math.min(1, (now - start) / duration);

          ctx.clearRect(0, 0, W, H);
          ctx.font = `700 ${fs}px "Space Mono", ui-monospace, monospace`;
          ctx.textBaseline = "top";

          const head = p * 1.55;
          for (let y = 0; y < nRows; y++) {
            const rowP = y / nRows;
            const local = head - rowP * 0.55;
            for (let x = 0; x < nCols; x++) {
              const idx = y * nCols + x;
              const l = grid.lum[idx];
              const s = noise[idx];
              let char: string;
              let alpha: number;
              if (local > 0.5) {
                char = RAMP[Math.min(RAMP.length - 1, (l * RAMP.length) | 0)];
                alpha = 0.2 + l * 0.8;
              } else if (local > 0.02) {
                char = NOISE[(s * NOISE.length) | 0];
                alpha = 0.14 + s * 0.35;
              } else {
                continue;
              }
              if (char === " ") continue;
              const near = Math.abs(local - 0.5) < 0.06;
              ctx.fillStyle = near ? signalCss : inkCss;
              ctx.globalAlpha = near ? alpha : alpha * 0.92;
              ctx.fillText(char, x * cw, y * ch);
            }
          }
          ctx.globalAlpha = 1;

          const fade = p < 0.68 ? 1 : 1 - (p - 0.68) / 0.32;
          cv.style.opacity = String(Math.max(0, fade));
          if (prevImg.current) prevImg.current.style.opacity = String(Math.max(0, 1 - p / 0.22));
          if (nextImg.current)
            nextImg.current.style.opacity = String(Math.max(0, Math.min(1, (p - 0.66) / 0.3)));

          if (p < 1) raf = requestAnimationFrame(draw);
          else {
            ctx.clearRect(0, 0, W, H);
            cv.style.opacity = "0";
            // Release the large backing store; the resolved <img> is what stays.
            cv.width = 1;
            cv.height = 1;
            if (nextImg.current) nextImg.current.style.opacity = "1";
            finished = true;
            setBusy(false);
            setPrevious(null);
          }
        };
        raf = requestAnimationFrame(draw);
      })
      .catch(() => {
        if (cancelled) return;
        finished = true;
        setFailed(true);
        setBusy(false);
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      // A cancelled run (StrictMode double-mount, dep change) must not block a retry.
      if (!finished) lastRun.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, inView, immediate, reduced, cols, duration, replayKey]);

  return (
    <div
      ref={host}
      className={`relative overflow-hidden bg-black ${className ?? ""}`}
    >
      {previous && (
        <img
          ref={prevImg}
          src={previous}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"}`}
        />
      )}
      <img
        ref={nextImg}
        src={shown}
        alt={alt}
        loading="eager"
        decoding="async"
        style={{ opacity: 0 }}
        className={`absolute inset-0 h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"}`}
      />
      <canvas
        ref={canvas}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
      {failed && (
        <div className="absolute inset-0 grid place-items-center bg-surface-2 p-6 text-center">
          <div className="space-y-2">
            <p className="label text-nothing">IMAGE UNAVAILABLE</p>
            <p className="font-mono text-[11px] leading-relaxed text-muted">
              {src.split("/").slice(-2).join("/")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
