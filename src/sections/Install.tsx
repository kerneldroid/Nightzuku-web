import { useState } from "react";
import { motion } from "motion/react";
import { DOCS, RELEASES, REPO, VERSION } from "../data";
import { SectionHead } from "../components/SectionHead";
import { Button } from "../components/Button";
import { AsciiReveal } from "../components/Reveal";

const STEPS = [
  { k: "Install", v: `Download the APK from GitHub Releases. Latest: ${VERSION}. Official Shizuku can stay installed.` },
  { k: "Start", v: "Wireless debugging on Android 11+, ADB from a computer, or root. The server process starts with those privileges." },
  { k: "Authorize", v: "Grant access per app. Apps built on the Shizuku API connect through the legacy wire without changes." },
];

const BUILD = `git clone --recurse-submodules ${REPO}.git
cd Nightzuku
./gradlew :manager:assembleDebug`;

/**
 * M3 grouped corners for one connected 5-cell surface: outer silhouette
 * corners stay 28px, corners that meet a neighbour drop to 10px.
 */
const STEP_RADII = [
  "rounded-tl-[28px] rounded-tr-[28px] rounded-br-[10px] rounded-bl-[10px] md:rounded-tr-[10px]",
  "rounded-[10px]",
  "rounded-[10px] md:rounded-tr-[28px]",
];

export function Install() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(BUILD);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <section id="install" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead n="04" label="Setup" title="INSTALL" />

        <div className="grid gap-3 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.k}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: i * 0.08 }}
              className={`border border-outline p-7 ${STEP_RADII[i]}`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-mono text-sm font-bold text-on-primary">
                  {i + 1}
                </span>
                <h3 className="text-xl font-semibold">{s.k}</h3>
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-on/70">{s.v}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1.3fr_1fr]">
          <AsciiReveal cover="#000000" className="overflow-hidden rounded-[10px] lg:rounded-bl-[28px]">
            <div className="relative h-full bg-surface-2 p-6 md:p-7">
              <div className="mb-4 flex items-center justify-between">
                <span className="label">Build from source</span>
                <button
                  onClick={copy}
                  className="rounded-full bg-surface-3 px-4 py-2 font-mono text-xs uppercase tracking-widest text-on transition-[border-radius] duration-300 hover:rounded-lg"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="no-scrollbar overflow-x-auto font-mono text-[13px] leading-7 text-on/90">
                {BUILD.split("\n").map((l) => (
                  <div key={l}>
                    <span className="text-nothing select-none">$ </span>
                    {l}
                  </div>
                ))}
              </pre>
            </div>
          </AsciiReveal>

          <div className="flex flex-col justify-between gap-6 rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[28px] rounded-br-[28px] bg-primary-container p-6 md:p-7 lg:rounded-bl-[10px]">
            <div>
              <span className="label text-primary-strong/70">Docs</span>
              <div className="mt-4 flex flex-wrap gap-2">
                {DOCS.map((d) => (
                  <a
                    key={d.t}
                    href={d.h}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-black/25 px-3.5 py-2 text-sm text-primary-strong transition-[border-radius,background] duration-300 hover:rounded-xl hover:bg-black/40"
                  >
                    {d.t}
                  </a>
                ))}
              </div>
            </div>
            <Button href={RELEASES} external className="w-full sm:w-auto sm:self-start">
              Get {VERSION}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
