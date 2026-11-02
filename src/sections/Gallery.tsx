import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PLATFORMS } from "../data";
import { SectionHead } from "../components/SectionHead";
import { AsciiImage } from "../components/AsciiImage";
import { spring } from "../components/Reveal";
import { useTheme } from "../theme/ThemeProvider";

type Status = "loading" | "decoding" | "ready" | "error";

export function Gallery() {
  const [sel, setSel] = useState({ p: 0, s: 0 });
  const [status, setStatus] = useState<Status>("decoding");
  const [replay, setReplay] = useState(0);
  const { apply } = useTheme();

  const go = (p: number, s: number) => {
    if (p === sel.p && s === sel.s) return;
    setSel({ p, s });
    apply(PLATFORMS[p].shots[s].src);
  };

  const plat = PLATFORMS[sel.p];
  const shot = plat.shots[sel.s];
  const total = plat.shots.length;

  return (
    <section id="screens" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead n="02" label="Loaded from GitHub" title="SCREENS">
          {/* M3E connected button group */}
          <div role="tablist" className="no-scrollbar flex max-w-full gap-1 self-start overflow-x-auto rounded-full bg-surface-2 p-1.5 md:self-auto">
            {PLATFORMS.map((pl, i) => (
              <button
                key={pl.id}
                role="tab"
                aria-selected={sel.p === i}
                onClick={() => go(i, 0)}
                className={`relative h-11 rounded-full px-4 text-sm font-semibold transition-colors sm:px-5 ${
                  sel.p === i ? "text-on-primary" : "text-on/75 hover:text-on"
                }`}
              >
                {sel.p === i && (
                  <motion.span layoutId="plat" transition={spring} className="absolute inset-0 rounded-full bg-primary" />
                )}
                <span className="relative">{pl.name}</span>
              </button>
            ))}
          </div>
        </SectionHead>

        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          {/* Stage */}
          <div className="min-w-0 overflow-hidden rounded-[40px]">
            <div className="dot-grid relative flex h-[540px] items-center justify-center overflow-hidden bg-surface p-6 md:h-[620px] md:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 50% 40%, color-mix(in srgb, var(--color-primary) 10%, transparent), transparent 65%)",
                }}
              />
              <div className="label absolute top-6 left-7 z-10">
                {plat.name} / {shot.label}
              </div>
              <div className="label absolute top-6 right-7 z-10 text-primary">
                {String(sel.s + 1).padStart(2, "0")}/{String(plat.shots.length).padStart(2, "0")}
              </div>

              {plat.frame === "phone" && (
                <div className="relative z-10 h-[86%] aspect-[704/1568] overflow-hidden rounded-[30px] border-[5px] border-surface-3 bg-black shadow-2xl shadow-black">
                  <AsciiImage
                    src={shot.src}
                    alt={`${plat.name}: ${shot.label}`}
                    className="h-full w-full"
                    cols={58}
                    duration={1150}
                    replayKey={replay}
                    onStatus={setStatus}
                  />
                </div>
              )}
              {plat.frame === "watch" && (
                <div className="relative z-10 aspect-square w-[min(78%,340px)] overflow-hidden rounded-full border-[10px] border-surface-3 bg-black shadow-2xl shadow-black">
                  <AsciiImage
                    src={shot.src}
                    alt={`${plat.name}: ${shot.label}`}
                    className="h-full w-full rounded-full"
                    cols={52}
                    duration={1150}
                    replayKey={replay}
                    onStatus={setStatus}
                  />
                </div>
              )}
              {plat.frame === "tv" && (
                <div className="relative z-10 w-full max-w-[760px]">
                  <div className="overflow-hidden rounded-[18px] border-[6px] border-surface-3 bg-black shadow-2xl shadow-black">
                    <AsciiImage
                      src={shot.src}
                      alt={`${plat.name}: ${shot.label}`}
                      className="block aspect-video w-full"
                      cols={96}
                      duration={1150}
                      replayKey={replay}
                      onStatus={setStatus}
                    />
                  </div>
                  <div className="mx-auto h-2 w-24 rounded-b-xl bg-surface-3" />
                </div>
              )}

              <div className="pointer-events-none absolute bottom-6 left-7 z-10 flex items-center gap-2">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    status === "ready" ? "bg-primary" : status === "error" ? "bg-nothing" : "nz-pulse bg-primary-strong"
                  }`}
                />
                <span className="label">
                  {status === "ready" ? "Resolved" : status === "error" ? "No signal" : "Decoding"}
                </span>
              </div>
            </div>
          </div>

          {/* Shot list */}
          <div className="flex min-w-0 flex-col gap-4">
            <div className="no-scrollbar -mx-5 flex min-w-0 gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
              {plat.shots.map((s, i) => {
                const on = sel.s === i;
                return (
                  <motion.button
                    key={plat.id + s.label}
                    onClick={() => go(sel.p, i)}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring, delay: i * 0.04 }}
                    style={{ borderRadius: on ? 18 : 999 }}
                    className={`flex shrink-0 items-center gap-4 px-5 py-3.5 text-left transition-[background,border-radius] duration-300 lg:py-4 ${
                      on ? "bg-primary-container text-primary-strong" : "bg-surface-2 text-on/75 hover:bg-surface-3"
                    }`}
                  >
                    <span className="font-mono text-xs opacity-70">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[15px] font-medium whitespace-nowrap">{s.label}</span>
                    {on && <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-nothing lg:block" />}
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-auto flex items-center gap-2">
              {[-1, 1].map((d) => (
                <motion.button
                  key={d}
                  aria-label={d < 0 ? "Previous screenshot" : "Next screenshot"}
                  onClick={() => go(sel.p, (sel.s + d + total) % total)}
                  style={{ borderRadius: 999 }}
                  whileTap={{ borderRadius: 14, scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 500, damping: 22 }}
                  className="flex h-14 flex-1 items-center justify-center bg-surface-2 text-on hover:bg-surface-3"
                >
                  <svg viewBox="0 0 24 24" className={`h-5 w-5 ${d < 0 ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
                    <path d="M5 12h14m0 0-5-5m5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.button>
              ))}
            </div>

            {/* Caption */}
            <AnimatePresence mode="wait">
              <motion.div
                key={shot.src}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
              >
                <p className="text-[14px] font-medium text-on">{shot.label}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">{shot.note}</p>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setReplay((r) => r + 1)}
                className="label inline-flex items-center gap-2 rounded-full border border-outline px-3.5 py-2 text-muted transition-colors hover:border-primary/50 hover:text-primary"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Replay
              </button>
              <a
                href={shot.src}
                target="_blank"
                rel="noreferrer"
                className="label inline-flex items-center gap-2 rounded-full border border-outline px-3.5 py-2 text-muted transition-colors hover:border-primary/50 hover:text-primary"
              >
                Raw
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path d="M8 16 16 8m0 0H9m7 0v7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
