import type { CatalogItem, ItemDetail } from "./types";
import { getItemDetail, searchCatalog } from "./mockData";
import { supabaseGetItem, supabaseSearchItems } from "./supabase/data";
import { vshopItem, vshopSearch } from "./vshop";

export type DataSource = "supabase" | "live" | "mock";

function asFinite(n: unknown): number | undefined {
  if (typeof n === "number" && Number.isFinite(n)) return n;
  if (typeof n === "string" && n.trim()) {
    const v = Number(n);
    if (Number.isFinite(v)) return v;
  }
  return undefined;
}

function applyPriceAndSort(
  items: CatalogItem[],
  params: {
    min?: number;
    max?: number;
    sort?: "relevance" | "price_asc" | "price_desc";
  },
) {
  const min = asFinite(params.min);
  const max = asFinite(params.max);

  let out = items.filter((it) => {
    const p = it.price.value;
    if (typeof min === "number" && p < min) return false;
    if (typeof max === "number" && p > max) return false;
    return true;
  });

  if ((params.sort ?? "relevance") === "price_asc")
    out = [...out].sort((a, b) => a.price.value - b.price.value);
  if ((params.sort ?? "relevance") === "price_desc")
    out = [...out].sort((a, b) => b.price.value - a.price.value);

  return out;
}

/**
 * Main search function used by both API routes and Server Components.
 * Products are fetched from the VShop API (live data).
 * Orders are stored in Supabase.
 */
export async function searchItems(params: {
  q?: string;
  min?: number;
  max?: number;
  sort?: "relevance" | "price_asc" | "price_desc";
}): Promise<{ items: CatalogItem[]; source: DataSource }> {
  const q = (params.q ?? "").trim();

  // Always try live VShop first for products
  const mode = (process.env.VSHOP_MODE || "live").toLowerCase() as
    | "live"
    | "mock";

  if (mode === "live" && q) {
    try {
      const live = await vshopSearch(q);
      return { items: applyPriceAndSort(live, params), source: "live" };
    } catch (error) {
      console.error("VShop search error:", error);
      // Fall through to fallback
    }
  }

  // Fallback to mock data if no search term or VShop fails
  return {
    items: applyPriceAndSort(searchCatalog(params), params),
    source: "mock",
  };
}

/**
 * Item detail used by both API routes and Server Components.
 * Products are fetched from the VShop API (live data).
 * Orders are stored in Supabase.
 */
export async function getItem(
  id: number,
  variationId?: number,
  variation2Id?: number,
): Promise<{ item: ItemDetail | null; source: DataSource }> {
  const mode = (process.env.VSHOP_MODE || "live").toLowerCase() as
    | "live"
    | "mock";

  if (mode === "live") {
    try {
      const live = await vshopItem(id, variationId, variation2Id);
      return { item: live, source: "live" };
    } catch (error) {
      console.error("VShop item fetch error:", error);
      // Fall through to fallback
    }
  }

  const mockItem = getItemDetail(id);
  console.log("Fallback to mock data:", { item: mockItem, source: "mock" });
  return { item: mockItem, source: "mock" };
}
