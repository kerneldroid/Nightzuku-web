import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { PIPELINE } from "../data";
import { SectionHead } from "../components/SectionHead";
import { MorphShape } from "../components/MorphShape";

/** Packet travelling along an ASCII wire. */
function AsciiFlow({ vertical = false, offset = 0 }: { vertical?: boolean; offset?: number }) {
  const LEN = vertical ? 5 : 9;
  const [t, setT] = useState(offset);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setT((v) => v + 1), 110);
    return () => clearInterval(id);
  }, []);
  const head = t % (LEN + 4);
  const chars: string[] = Array.from({ length: LEN }, (_, i) => {
    if (i === head) return vertical ? "▼" : "■";
    if (i === head - 1) return "=";
    if (i === head - 2) return "-";
    return "·";
  });
  chars.push(vertical ? "v" : ">");
  return (
    <div
      aria-hidden
      className={`flex font-mono text-sm text-primary ${vertical ? "flex-col items-center py-2 leading-[1.1]" : "items-center px-1"}`}
    >
      {chars.map((c, i) => (
        <span key={i} className={c === "■" || c === "▼" ? "text-nothing" : c === "·" ? "text-muted/50" : ""}>
          {c}
        </span>
      ))}
    </div>
  );
}

export function How() {
  return (
    <section id="how" className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead n="03" label="Binder proxy" title="HOW">
          <p className="max-w-sm text-on/70">
            The system server checks caller UID/PID. Nightzuku runs as root or shell, so forwarded calls carry those privileges.
          </p>
        </SectionHead>

        <div className="relative overflow-hidden rounded-[40px] bg-surface-2 p-6 md:p-12">
          <MorphShape
            className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 text-surface-3"
            sequence={["clover8", "cookie12", "sunny8", "clover4"]}
            interval={3200}
          />
          <div className="relative flex flex-col items-stretch lg:flex-row lg:items-center">
            {PIPELINE.map((n, i) => (
              <div key={n.id} className="flex flex-col items-center lg:flex-1 lg:flex-row">
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 220, damping: 16, delay: i * 0.15 }}
                  className={`w-full flex-1 p-6 text-center ${
                    i === 1 ? "rounded-[999px] bg-primary text-on-primary" : "rounded-[28px] bg-black text-on"
                  }`}
                >
                  <div className="font-mono text-[15px] font-bold tracking-wide break-all">{n.id}</div>
                  <div className={`mt-1 text-sm ${i === 1 ? "text-on-primary/75" : "text-muted"}`}>{n.sub}</div>
                </motion.div>
                {i < PIPELINE.length - 1 && (
                  <>
                    <div className="lg:hidden">
                      <AsciiFlow vertical offset={i * 3} />
                    </div>
                    <div className="hidden lg:block">
                      <AsciiFlow offset={i * 4} />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="relative mt-10 grid gap-6 border-t border-outline pt-8 md:grid-cols-3">
            {[
              ["Native wire", "kerneldroid.nightzuku.INightService — flat Parcel transactions, per-UID capability masks, execFast."],
              ["Legacy wire", "Classic Shizuku binder for clients requesting legacy permissions. Existing integrations keep working."],
              ["Routing", "ClientRouting picks the wire per package. TransactGuard verifies target binders before forwarding."],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="label text-primary">{k}</div>
                <p className="mt-2 text-[15px] leading-relaxed text-on/75">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
