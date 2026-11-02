import type { ReactNode } from "react";
import { motion } from "motion/react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "filled" | "tonal" | "outline";
  external?: boolean;
  className?: string;
};

const styles = {
  filled: "bg-primary text-on-primary",
  tonal: "bg-surface-3 text-on",
  outline: "border border-outline text-on",
};

/** M3 Expressive button: round at rest, morphs toward square on press (spring). */
export function Button({ href, children, variant = "filled", external, className = "" }: Props) {
  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      style={{ borderRadius: 999 }}
      whileHover={{ borderRadius: 22, scale: 1.02 }}
      whileTap={{ borderRadius: 12, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
      className={`inline-flex h-14 items-center justify-center gap-2.5 px-7 text-[15px] font-semibold tracking-tight ${styles[variant]} ${className}`}
    >
      {children}
    </motion.a>
  );
}
