import { REPO } from "../data";
import { AsciiText } from "../components/AsciiText";

export function Footer() {
  return (
    <footer className="relative overflow-hidden px-5 pt-16 pb-28 md:px-8 md:pb-12">
      <div className="mx-auto max-w-6xl border-t border-outline pt-10">
        <div className="grid gap-8 text-sm text-on/60 md:grid-cols-3">
          <div>
            <div className="label mb-3">License</div>
            Apache 2.0. Launcher icon reserved for Nightzuku. Package ID: kerneldroid.nightzuku.
          </div>
          <div>
            <div className="label mb-3">Upstream</div>
            <a className="underline decoration-outline underline-offset-4 hover:text-on" href="https://github.com/RikkaApps/Shizuku" target="_blank" rel="noreferrer">
              RikkaApps/Shizuku
            </a>
            {" · "}
            <a className="underline decoration-outline underline-offset-4 hover:text-on" href="https://github.com/RikkaApps/Shizuku-API" target="_blank" rel="noreferrer">
              Shizuku-API
            </a>
          </div>
          <div>
            <div className="label mb-3">Credits</div>
            Razgame — app list fix. Porter (d4rken-org) — hardening ideas.
          </div>
        </div>
        <a
          href={REPO}
          target="_blank"
          rel="noreferrer"
          className="mt-14 block font-dot text-[16vw] leading-none font-black tracking-tight text-surface-3 transition-colors duration-500 select-none hover:text-primary-container md:text-[14vw] xl:text-[168px]"
        >
          <AsciiText text="NIGHTZUKU" duration={1100} />
        </a>
        <div className="label mt-4 flex justify-between">
          <span>kerneldroid/Nightzuku</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-nothing" /> Apache 2.0
          </span>
        </div>
      </div>
    </footer>
  );
}
