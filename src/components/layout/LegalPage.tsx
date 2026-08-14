import type { ReactNode } from "react";

import { DiamondMark } from "@/components/effects/DiamondMark";

/** Shared shell for Impressum / Datenschutz / AGB — kept simple and readable on purpose. */
export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="container-x flex-1 py-32">
      <DiamondMark className="size-8 text-diamond-light" />
      <h1 className="mt-6 font-display text-display-md uppercase text-white">{title}</h1>
      <div className="prose-invert mt-8 max-w-2xl space-y-4 text-sm leading-relaxed text-muted">
        {children}
      </div>
    </main>
  );
}
