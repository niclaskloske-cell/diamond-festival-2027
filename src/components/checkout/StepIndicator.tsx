import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const STEPS = ["Ticket", "Anzahl", "Daten", "Übersicht", "Zahlung"];

export function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-1.5 sm:gap-2">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const state = step < current ? "done" : step === current ? "active" : "idle";
        return (
          <li key={label} className="flex items-center gap-1.5 sm:gap-2">
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-full text-[0.65rem] font-bold transition-colors",
                state === "done" && "bg-diamond text-[#04141b]",
                state === "active" && "border border-diamond text-diamond-light",
                state === "idle" && "border border-white/15 text-faint",
              )}
            >
              {state === "done" ? <Check className="size-3" /> : step}
            </span>
            <span
              className={cn(
                "hidden text-[0.65rem] font-semibold uppercase tracking-[0.08em] sm:inline",
                state === "idle" ? "text-faint" : "text-white",
              )}
            >
              {label}
            </span>
            {step < STEPS.length && (
              <span className="mx-1 h-px w-4 bg-white/12 sm:w-6" aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}
