"use client";

import * as React from "react";

export type CategoriesNavProps = {
  categories: string[];
  /** Controlled active value */
  value?: string;
  /** Uncontrolled initial active value */
  defaultValue?: string;
  onChange?: (value: string) => void;
  scrollAmount?: number;
  className?: string;
};

export function CategoriesNav({
  categories,
  value,
  defaultValue,
  onChange,
  scrollAmount = 260,
  className = "",
}: CategoriesNavProps) {
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<string>(() => {
    if (defaultValue && categories.includes(defaultValue)) return defaultValue;
    return categories[0] ?? "";
  });

  const active = isControlled ? (value as string) : internalValue;

  const [canLeft, setCanLeft] = React.useState<boolean>(false);
  const [canRight, setCanRight] = React.useState<boolean>(false);

  const updateScrollState = React.useCallback((): void => {
    const el = scrollerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanLeft(scrollLeft > 0);
    setCanRight(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  React.useEffect(() => {
    updateScrollState();

    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = (): void => updateScrollState();
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => updateScrollState());
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [updateScrollState]);

  React.useEffect(() => {
    // If categories change and active no longer exists, reset to first item.
    if (categories.length > 0 && !categories.includes(active)) {
      const next = categories[0];
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    }
  }, [categories, active, isControlled, onChange]);

  const scrollBy = (dir: -1 | 1): void => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * scrollAmount, behavior: "smooth" });
  };

  const select = (cat: string): void => {
    if (!isControlled) setInternalValue(cat);
    onChange?.(cat);
  };

  return (
    <nav aria-label="Categories" className={className}>
      <div className="relative flex items-center">
        {/* Left */}
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          disabled={!canLeft}
          aria-label="Scroll categories left"
          className="absolute left-0 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white/90 shadow-sm backdrop-blur transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft />
        </button>

        {/* Categories */}
        <div
          ref={scrollerRef}
          className="no-scrollbar mx-11 flex w-full gap-2 overflow-x-auto scroll-smooth py-2"
        >
          {categories.map((cat) => {
            const isActive = cat === active;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => select(cat)}
                aria-current={isActive ? "true" : undefined}
                className={[
                  "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition",
                  isActive
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-300 hover:bg-neutral-50",
                ].join(" ")}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Right */}
        <button
          type="button"
          onClick={() => scrollBy(1)}
          disabled={!canRight}
          aria-label="Scroll categories right"
          className="absolute right-0 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white/90 shadow-sm backdrop-blur transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight />
        </button>
      </div>
    </nav>
  );
}

function ChevronLeft(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M15 18l-6-6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
