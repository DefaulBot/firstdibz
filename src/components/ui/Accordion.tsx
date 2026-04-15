"use client";

import { useState, useId } from "react";
import { cn } from "@/lib/utils";

export type AccordionItem = {
  question: string;
  answer: React.ReactNode;
};

/**
 * Accessible single-open accordion.
 * Each item is a <button> with aria-expanded / aria-controls.
 */
export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        const triggerId = `${baseId}-trigger-${idx}`;
        const panelId = `${baseId}-panel-${idx}`;

        return (
          <div
            key={idx}
            className={cn(
              "rounded-2xl border bg-white transition-colors",
              isOpen
                ? "border-[#7FF46A]"
                : "border-[#eef2f5] hover:border-[#7FF46A]",
            )}
          >
            <button
              id={triggerId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="flex w-full items-center justify-between gap-4 bg-[#fafcff] px-5 py-4 text-left transition-colors hover:bg-[#f0f6ff] rounded-2xl"
            >
              <span className="font-bold text-[#1F2661] text-sm sm:text-base">
                {item.question}
              </span>
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white text-lg font-bold transition-transform",
                  isOpen ? "bg-[#ff4676] rotate-45" : "bg-[#1F2661]",
                )}
              >
                +
              </span>
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={cn(
                "overflow-hidden transition-all duration-300",
                isOpen ? "max-h-[600px] border-t border-[#eef2f5]" : "max-h-0",
              )}
            >
              <div className="px-5 py-4 text-[#5a6879] text-sm leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
