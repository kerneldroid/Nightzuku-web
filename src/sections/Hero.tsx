import { motion, useReducedMotion } from "motion/react";
import { RELEASES, REPO, VERSION, PLATFORMS, TICKER } from "../data";
import { Button } from "../components/Button";
import { MorphShape } from "../components/MorphShape";
import { Scramble } from "../components/Scramble";
import { AsciiImage } from "../components/AsciiImage";
import { springSlow } from "../components/Reveal";
import { GitHubIcon } from "./Nav";

export function Hero() {
  const reduced = useReducedMotion();
  const shot = PLATFORMS[0].shots[0];

  return (
    <section id="top" className="relative overflow-hidden px-5 pt-28 pb-20 md:px-8 md:pt-36 md:pb-28">
      <div className="dot-grid dot-grid-fade pointer-events-none absolute inset-0" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="label mb-6 flex flex-wrap items-center gap-3"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="nz-pulse absolute inset-0 rounded-full bg-nothing" />
            </span>
            Shizuku fork · kerneldroid · {VERSION}
          </motion.div>

          <h1 className="font-dot text-[15.5vw] leading-[0.85] font-black tracking-tight text-on sm:text-[96px] lg:text-[112px] xl:text-[128px]">
            <Scramble text="NIGHT" duration={700} />
            <br />
            <span className="text-primary">
              <Scramble text="ZUKU" duration={700} delay={250} />
            </span>
            <span className="blink text-nothing">_</span>
          </h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ ...springSlow, delay: 0.55 }}
            className="mt-7 h-px max-w-lg origin-left bg-gradient-to-r from-outline to-transparent"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springSlow, delay: 0.6 }}
            className="mt-7 max-w-lg text-lg leading-relaxed text-on/80 md:text-xl"
          >
            Apps call Android system APIs directly with root or ADB privileges. Dual-wire protocol, ADB modules,
            Material&nbsp;3 Expressive UI. Targets Android&nbsp;16/17.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springSlow, delay: 0.75 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Button href={RELEASES} external>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
                <path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5M5 19.5h14" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Download APK
            </Button>
            <Button href={REPO} variant="tonal" external>
              <GitHubIcon />
              Source
            </Button>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 grid max-w-md grid-cols-3 border-t border-outline pt-5"
          >
            {[
              ["License", "Apache 2.0"],
              ["Lang", "Kotlin · Rust"],
              ["Package", "kerneldroid"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="label">{k}</dt>
                <dd className="mt-1.5 font-mono text-[13px] text-on">{v}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Visual */}
        <div className="relative mx-auto flex w-full max-w-[420px] items-center justify-center">
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.3 }}
            className="absolute inset-[-6%] text-primary-container"
          >
            <MorphShape className="h-full w-full" />
          </motion.div>

          <motion.div
            initial={{ y: 60, opacity: 0, rotate: -4 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 140, damping: 16, delay: 0.45 }}
            className="relative w-[62%]"
          >
            <motion.div
              animate={reduced ? { y: 0 } : { y: [0, -10, 0] }}
              transition={
                reduced ? { duration: 0 } : { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.4 }
              }
              className="overflow-hidden rounded-[34px] border-[5px] border-surface-3 bg-black shadow-2xl shadow-black"
            >
              <AsciiImage
                src={shot.src}
                alt="Nightzuku home screen on a phone"
                className="block aspect-[704/1568] w-full"
                cols={52}
                duration={1500}
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -24, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.95 }}
            className="absolute bottom-24 -left-3 flex items-center gap-3 rounded-2xl border border-outline bg-surface-2/95 px-4 py-3 backdrop-blur-md sm:-left-6"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-container">
              <span className="relative flex h-2 w-2">
                <span className="nz-pulse absolute inset-0 rounded-full bg-primary" />
              </span>
            </span>
            <div>
              <p className="text-[13px] leading-tight font-medium text-on">Nightzuku is running</p>
              <p className="font-mono text-[10.5px] tracking-wide text-muted">{VERSION} · ADB</p>
            </div>
          </motion.div>

          <div className="label absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
            [ screenshots/phone/main.png ]
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div className="relative mt-20 -mx-5 border-y border-outline/60 bg-surface/60 py-3.5 md:mt-28 md:-mx-8">
        <div className="nz-marquee flex w-max">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
              {TICKER.map((t) => (
                <span key={t} className="flex items-center">
                  <span className="label px-6">{t}</span>
                  <span className="h-1 w-1 rounded-full bg-outline" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
