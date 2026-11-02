import { useEffect, useRef, useState } from "react";
import { MotionConfig } from "motion/react";
import { AsciiCurtain, type CurtainHandle } from "./components/AsciiCurtain";
import { ThemeProvider } from "./theme/ThemeProvider";
import { Nav } from "./sections/Nav";
import { Hero } from "./sections/Hero";
import { Facts } from "./sections/Facts";
import { Gallery } from "./sections/Gallery";
import { How } from "./sections/How";
import { Install } from "./sections/Install";
import { Footer } from "./sections/Footer";

/** Full-viewport ASCII dissolve on first load. */
function Intro() {
  const ref = useRef<CurtainHandle>(null);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(async () => {
      await ref.current?.reveal();
      setDone(true);
    }, 120);
    return () => clearTimeout(t);
  }, []);
  if (done) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[100]">
      <AsciiCurtain ref={ref} duration={950} />
    </div>
  );
}

/** Ambient substrate: dot grid, primary glow, slow scanline. */
function Substrate() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="dot-grid absolute inset-0 opacity-40" />
      <div
        className="absolute -top-[20%] -right-[15%] h-[70vh] w-[70vh] rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-primary) 13%, transparent), transparent 62%)",
        }}
      />
      <div
        className="absolute top-[45%] -left-[20%] h-[60vh] w-[60vh] rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-nothing) 6%, transparent), transparent 65%)",
        }}
      />
      <div
        className="nz-scan absolute inset-x-0 top-0 h-[26vh]"
        style={{
          background:
            "linear-gradient(to bottom, transparent, color-mix(in srgb, var(--color-primary) 4%, transparent), transparent)",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,transparent_35%,rgba(0,0,0,0.85)_100%)]" />
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <div className="relative min-h-screen bg-bg text-on">
          <Intro />
          <Substrate />
          <Nav />
          <main className="relative z-10">
            <Hero />
            <Facts />
            <Gallery />
            <How />
            <Install />
          </main>
          <div className="relative z-10">
            <Footer />
          </div>
        </div>
      </ThemeProvider>
    </MotionConfig>
  );
}
