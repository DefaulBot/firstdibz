"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Filter, ArrowUpDown, X } from "lucide-react";
import type { CatalogItem } from "@/lib/types";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { ProductGrid } from "./ProductGrid";
import { cn, formatBzd } from "@/lib/utils";

type Sort = "relevance" | "price_asc" | "price_desc";

export function SearchClient({
  initialQ,
  initialMin,
  initialMax,
  initialSort,
  initialItems,
  initialSource,
}: {
  initialQ: string;
  initialMin?: number;
  initialMax?: number;
  initialSort?: Sort;
  initialItems: CatalogItem[];
  initialSource: "supabase" | "live" | "mock";
}) {
  const router = useRouter();

  const [q, setQ] = useState(initialQ);
  const [min, setMin] = useState(initialMin?.toString() ?? "");
  const [max, setMax] = useState(initialMax?.toString() ?? "");
  const [sort, setSort] = useState<Sort>(initialSort ?? "relevance");

  const [items, setItems] = useState<CatalogItem[]>(initialItems);
  const [source, setSource] = useState<"supabase" | "live" | "mock">(
    initialSource,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<number | null>(null);

  const queryString = useMemo(() => {
    const sp = new URLSearchParams();
    const qv = q.trim();
    const minv = min.trim();
    const maxv = max.trim();
    const minNum = Number(minv);
    const maxNum = Number(maxv);
    if (qv) sp.set("q", qv);
    if (minv && Number.isFinite(minNum)) sp.set("min", String(minNum));
    if (maxv && Number.isFinite(maxNum)) sp.set("max", String(maxNum));
    if (sort !== "relevance") sp.set("sort", sort);
    const s = sp.toString();
    return s ? `?${s}` : "";
  }, [q, min, max, sort]);

  useEffect(() => {
    let cancelled = false;

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      // keep URL in sync (no page reload)
      router.replace(`/search${queryString}`);

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/search${queryString}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as {
          items: CatalogItem[];
          source?: "supabase" | "live" | "mock";
        };
        if (!cancelled) {
          setItems(json.items || []);
          if (json.source) setSource(json.source);
        }
      } catch (e: any) {
        console.error("Search error:", e);
        if (!cancelled) setError(e?.message ?? "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [queryString, router]);

  const minNum = Number(min);
  const maxNum = Number(max);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-lg font-extrabold text-[#0f2f63] font-montserrat">
              Browse Our Collection
            </div>
            <div className="text-sm text-zinc-600">
              Search, filter by price, then reserve your favorite items!
            </div>
          </div>
          <div className="flex gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold",
                source === "live"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : source === "supabase"
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-zinc-200 bg-zinc-50 text-zinc-700",
              )}
              title={
                source === "live"
                  ? "Results fetched live from VShop (via server proxy)"
                  : source === "supabase"
                    ? "Results loaded from Supabase"
                    : "Using seeded sample data (fallback)"
              }
            >
              {source === "live"
                ? "Live"
                : source === "supabase"
                  ? "Database"
                  : "Sample"}
            </span>
            <Button
              variant="ghost"
              onClick={() => {
                setQ("");
                setMin("");
                setMax("");
                setSort("relevance");
              }}
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-12">
          <div className="md:col-span-6">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
            />
          </div>

          <div className="md:col-span-3">
            <div className="relative">
              <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                value={min}
                onChange={(e) => setMin(e.target.value)}
                placeholder="Min price"
                inputMode="decimal"
                className="pl-11"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="relative">
              <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                value={max}
                onChange={(e) => setMax(e.target.value)}
                placeholder="Max price"
                inputMode="decimal"
                className="pl-11"
              />
            </div>
          </div>

          <div className="md:col-span-4">
            <label className="mb-1 block text-xs font-semibold text-zinc-600">
              Sort
            </label>
            <div className="relative">
              <ArrowUpDown className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="h-11 w-full appearance-none rounded-2xl border border-zinc-200 bg-white pl-11 pr-9 text-sm font-semibold text-zinc-800 shadow-sm outline-none transition focus:border-[#0f2f63] focus:ring-4 focus:ring-[#0f2f63]/10"
              >
                <option value="relevance">Relevance</option>
                <option value="price_asc">Price: low → high</option>
                <option value="price_desc">Price: high → low</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                ▾
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-600">
          <span className="font-semibold text-zinc-800">Showing</span>
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-700">
            {items.length}
          </span>
          <span>items</span>
          {(Number.isFinite(minNum) && min.trim()) ||
          (Number.isFinite(maxNum) && max.trim()) ? (
            <span className="text-xs">
              · Price range{" "}
              <span className="font-semibold text-zinc-800">
                {min.trim() ? formatBzd(minNum) : "Any"} —{" "}
                {max.trim() ? formatBzd(maxNum) : "Any"}
              </span>
            </span>
          ) : null}
        </div>
      </div>

      {error ? (
        <div className="rounded-[2rem] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Couldn&apos;t load results:{" "}
          <span className="font-semibold">{error}</span>
        </div>
      ) : null}

      {loading ? <SkeletonGrid /> : <ProductGrid items={items} />}

      {!loading && !error && items.length === 0 ? (
        <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-600">
          No matches. Try a broader search (e.g., “necklace”) or clear filters.
        </div>
      ) : null}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-3xl border border-zinc-200 bg-white"
        >
          <div className="aspect-[4/3] bg-zinc-100" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-5/6 rounded-full bg-zinc-100" />
            <div className="h-4 w-2/3 rounded-full bg-zinc-100" />
            <div className="h-5 w-1/3 rounded-full bg-zinc-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
