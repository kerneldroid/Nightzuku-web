import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

const NOISE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>[]{}=+*#%";

type Props = {
  text: string;
  className?: string;
  /** ms for the full decode */
  duration?: number;
  delay?: number;
  /** decode on mount instead of on scroll into view */
  immediate?: boolean;
  /** change this value to replay the decode */
  replayKey?: string | number;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
};

/**
 * Monospace decode: glyphs resolve left to right out of ASCII noise.
 * Every character keeps its own box, so the readout never shifts layout.
 */
export function AsciiText({
  text,
  className,
  duration = 620,
  delay = 0,
  immediate = false,
  replayKey,
  as: Tag = "span",
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduced = useReducedMotion();
  const [edge, setEdge] = useState<number | null>(null);

  useEffect(() => {
    if (!(immediate || inView)) return;
    if (reduced) {
      setEdge(Number.MAX_SAFE_INTEGER);
      return;
    }
    let raf = 0;
    let start = 0;
    const total = text.length + 6;
    setEdge(0);
    const tick = (now: number) => {
      if (!start) start = now;
      const t = now - start - delay;
      const p = t <= 0 ? 0 : Math.min(1, t / duration);
      setEdge(p * total);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setEdge(Number.MAX_SAFE_INTEGER);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, inView, immediate, reduced, duration, delay, replayKey]);

  const words = text.split(" ");
  let n = -1;

  return (
    <Tag
      // @ts-expect-error polymorphic ref across intrinsic tags
      ref={ref}
      className={className}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wi) => (
          <span key={`${word}-${wi}`}>
            <span className="inline-block whitespace-nowrap">
              {word.split("").map((ch, ci) => {
                n += 1;
                const i = n;
                let glyph = "\u00a0";
                if (edge === null) glyph = "\u00a0";
                else if (i < edge - 6) glyph = ch;
                else if (i < edge) glyph = NOISE[(Math.random() * NOISE.length) | 0];
                return (
                  <span key={ci} className="relative inline-block">
                    <span className="invisible">{ch}</span>
                    <span className="absolute inset-x-0 top-0 text-center">{glyph}</span>
                  </span>
                );
              })}
            </span>
            {wi < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </Tag>
  );
}
