import { useEffect, useRef } from "react";
import { animate, useInView, useMotionValue, useMotionValueEvent } from "motion/react";

const N = 128;

type ShapeFn = (t: number) => number;

// Polar approximations of the M3 Expressive shape library.
export const SHAPES: Record<string, ShapeFn> = {
  circle: () => 1,
  cookie9: (t) => 1 + 0.075 * Math.cos(9 * t),
  clover4: (t) => 0.92 + 0.14 * Math.cos(4 * t),
  sunny8: (t) => 1 + 0.055 * Math.cos(8 * t),
  square: (t) => 0.9 * Math.pow(Math.pow(Math.abs(Math.cos(t)), 5) + Math.pow(Math.abs(Math.sin(t)), 5), -1 / 5),
  cookie12: (t) => 1 + 0.05 * Math.cos(12 * t),
  pentagon: (t) => 1 + 0.07 * Math.cos(5 * t),
  clover8: (t) => 0.95 + 0.08 * Math.cos(8 * t),
};

const sample = (fn: ShapeFn) => {
  const a = new Float32Array(N);
  for (let i = 0; i < N; i++) a[i] = fn((i / N) * Math.PI * 2);
  return a;
};

type Props = {
  sequence?: (keyof typeof SHAPES)[];
  className?: string;
  fill?: string;
  interval?: number;
  stiffness?: number;
  damping?: number;
};

export function MorphShape({
  sequence = ["cookie9", "clover4", "sunny8", "square", "cookie12", "pentagon"],
  className,
  fill = "currentColor",
  interval = 2400,
  stiffness = 220,
  damping = 14,
}: Props) {
  const pathRef = useRef<SVGPathElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const hostRef = useRef<SVGSVGElement>(null);
  const radii = useRef(sequence.map((k) => sample(SHAPES[k])));
  const mv = useMotionValue(0);
  const rot = useMotionValue(0);
  const step = useRef(0);
  // Offscreen shapes must not keep rebuilding a 128-point path at 60fps.
  const inView = useInView(hostRef, { margin: "25% 0px" });

  const draw = (v: number, r: number) => {
    const list = radii.current;
    const base = Math.floor(v);
    const f = v - base;
    const A = list[((base % list.length) + list.length) % list.length];
    const B = list[(((base + 1) % list.length) + list.length) % list.length];
    let d = "";
    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 2;
      const rr = 46 * (A[i] + (B[i] - A[i]) * f);
      const x = 50 + rr * Math.cos(t);
      const y = 50 + rr * Math.sin(t);
      d += (i ? "L" : "M") + x.toFixed(2) + " " + y.toFixed(2);
    }
    pathRef.current?.setAttribute("d", d + "Z");
    gRef.current?.setAttribute("transform", `rotate(${r} 50 50)`);
  };

  useMotionValueEvent(mv, "change", (v) => draw(v, rot.get()));
  useMotionValueEvent(rot, "change", (r) => draw(mv.get(), r));

  useEffect(() => {
    draw(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!inView) return;
    const id = setInterval(() => {
      step.current += 1;
      animate(mv, step.current, { type: "spring", stiffness, damping });
      animate(rot, step.current * 60, { type: "spring", stiffness: stiffness * 0.6, damping: damping * 1.2 });
    }, interval);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, interval, stiffness, damping]);

  return (
    <svg ref={hostRef} viewBox="0 0 100 100" className={className} aria-hidden>
      <g ref={gRef}>
        <path ref={pathRef} fill={fill} />
      </g>
    </svg>
  );
}
