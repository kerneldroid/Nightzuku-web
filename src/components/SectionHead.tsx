import type { ReactNode } from "react";
import { Scramble } from "./Scramble";

export function SectionHead({ n, label, title, children }: { n: string; label: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="label mb-4 flex items-center gap-3">
          <span className="text-primary">{n}</span>
          <span className="h-px w-8 bg-outline" />
          {label}
        </div>
        <h2 className="font-dot text-5xl leading-none font-black tracking-tight md:text-7xl">
          <Scramble text={title} />
        </h2>
      </div>
      {children}
    </div>
  );
}
