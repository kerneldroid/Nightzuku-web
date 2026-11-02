import { motion } from "motion/react";
import { FACTS } from "../data";
import { SectionHead } from "../components/SectionHead";

export function Facts() {
  return (
    <section id="facts" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead n="01" label="Specification" title="FACTS">
          <p className="max-w-sm text-on/70">Fork of RikkaApps/Shizuku. Same proxy model, extended server, rebuilt manager.</p>
        </SectionHead>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FACTS.map((f, i) => (
            <motion.article
              key={f.k}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: (i % 3) * 0.07 }}
              style={{ borderRadius: 28 }}
              whileHover={{ borderRadius: 48 }}
              className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden bg-surface-2 p-7 transition-colors hover:bg-surface-3"
            >
              <div className="flex items-start justify-between">
                <span className="font-dot text-4xl font-black text-primary/90">{String(i + 1).padStart(2, "0")}</span>
                <span className="relative flex h-2 w-2">
                  <span className="nz-pulse absolute inset-0 rounded-full bg-outline transition-colors duration-300 group-hover:bg-nothing" />
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold tracking-tight">{f.k}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-on/70">{f.v}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
