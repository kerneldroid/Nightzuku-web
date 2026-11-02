import { useEffect, useRef, type ReactNode } from "react";
import { motion, useInView } from "motion/react";
import { AsciiCurtain, type CurtainHandle } from "./AsciiCurtain";

export const spring = { type: "spring", stiffness: 380, damping: 26 } as const; // M3E fast spatial
export const springSlow = { type: "spring", stiffness: 160, damping: 20 } as const; // M3E default spatial

export function AsciiReveal({
  children,
  className = "",
  cover = "#000000",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  cover?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const curtain = useRef<CurtainHandle>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => curtain.current?.reveal(), delay);
    return () => clearTimeout(t);
  }, [inView, delay]);
  return (
    <div ref={ref} className={`relative ${className}`}>
      {children}
      <AsciiCurtain ref={curtain} cover={cover} />
    </div>
  );
}

export function FadeUp({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ ...springSlow, delay }}
    >
      {children}
    </motion.div>
  );
}
