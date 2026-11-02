import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

const GLYPHS = "!<>-_\\/[]{}=+*^?#%@01:;.";

type Props = {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p";
};

/** Left-to-right ASCII resolve. Fires once when scrolled into view. */
export function Scramble({ text, className, duration = 900, delay = 0, as = "span" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [out, setOut] = useState(() => text.replace(/\S/g, "\u00a0"));

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOut(text);
      return;
    }
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now + delay;
      const p = Math.max(0, (now - start) / duration);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === " ") {
          s += " ";
          continue;
        }
        const at = i / text.length;
        if (p > at + 0.25) s += ch;
        else if (p > at - 0.1) s += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        else s += "\u00a0";
      }
      setOut(s);
      if (p < 1.3) raf = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, text, duration, delay]);

  const Tag = as as "span";
  return (
    <Tag ref={ref as React.Ref<HTMLSpanElement>} className={className} aria-label={text}>
      <span aria-hidden>{out}</span>
    </Tag>
  );
}
