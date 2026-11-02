import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { REPO } from "../data";
import { spring } from "../components/Reveal";
import { AsciiText } from "../components/AsciiText";

export const LINKS = [
  { id: "facts", label: "Facts" },
  { id: "screens", label: "Screens" },
  { id: "how", label: "How" },
  { id: "install", label: "Install" },
];

export function GitHubIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

function useActive() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const els = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

function Pill({ id, label, active, marker }: { id: string; label: string; active: boolean; marker: string }) {
  const [hover, setHover] = useState(0);
  return (
    <a
      href={`#${id}`}
      onMouseEnter={() => setHover((h) => h + 1)}
      className={`relative rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
        active ? "text-on-primary" : "text-on/80 hover:text-on"
      }`}
    >
      {active && (
        <motion.span layoutId={marker} transition={spring} className="absolute inset-0 rounded-full bg-primary" />
      )}
      <span className="relative block">
        <AsciiText text={label} duration={300} replayKey={hover} />
      </span>
    </a>
  );
}

function Pills({ active, id }: { active: string; id: string }) {
  return (
    <>
      {LINKS.map((l) => (
        <Pill key={l.id} id={l.id} label={l.label} active={active === l.id} marker={id} />
      ))}
    </>
  );
}

export function Nav() {
  const active = useActive();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 260, damping: 40, mass: 0.4 });

  return (
    <>
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-nothing via-primary to-primary"
      />

      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...spring, delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 md:px-8"
      >
        <nav className="hidden items-center gap-1 rounded-full border border-outline bg-surface/80 p-1.5 backdrop-blur-md md:flex">
          <Pills active={active} id="nav-top" />
        </nav>
        <a
          href={REPO}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub repository"
          className="ml-auto flex h-11 w-11 items-center justify-center rounded-full border border-outline bg-surface/80 backdrop-blur-md transition-[border-radius,background] duration-300 hover:rounded-2xl hover:bg-surface-3"
        >
          <GitHubIcon />
        </a>
      </motion.header>

      {/* M3E floating toolbar — mobile */}
      <motion.nav
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...spring, delay: 0.3 }}
        className="fixed inset-x-0 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 mx-auto flex w-max max-w-[calc(100vw-1rem)] items-center gap-0.5 overflow-x-auto rounded-full border border-outline bg-surface-2/90 p-1.5 shadow-2xl shadow-black backdrop-blur-md md:hidden"
      >
        <Pills active={active} id="nav-bottom" />
      </motion.nav>
    </>
  );
}
