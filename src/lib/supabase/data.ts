import type { CatalogItem, ItemDetail, PreorderChartRow } from "../types";
import { formatBzd } from "../utils";
import { createSupabaseServerClient } from "./server";

type DbProduct = {
  id: number;
  title: string;
  price: number;
  original_price: number | null;
  discount: string | null;
  image: string;
  only_left_in_stock: number | null;
  new_arrival: boolean | null;
  out_of_stock: boolean | null;
  points_earned: number | null;
  points_earned_dollars: number | null;
  share_text: string | null;
  share_link: string | null;
  current_image: number | null;
};

type DbImage = {
  id: number;
  key: number | null;
  image: string;
  small_image: string;
};

type DbChartRow = {
  name: string;
  value: string;
  sort_order: number;
};

function toMoney(value: number) {
  return { value, formatted: formatBzd(value) };
}

function toCatalogItem(row: DbProduct): CatalogItem {
  return {
    id: row.id,
    title: row.title,
    price: toMoney(Number(row.price)),
    originalPrice:
      row.original_price == null ? null : toMoney(Number(row.original_price)),
    discount: row.discount,
    image: row.image,
    onlyLeftInStock: row.only_left_in_stock,
    newArrival: row.new_arrival,
  };
}

function fallbackDetailFromCatalog(base: CatalogItem): ItemDetail {
  const img450 = base.image
    .replace("odnHeight=180", "odnHeight=450")
    .replace("odnWidth=180", "odnWidth=450");

  const points = Math.max(10, Math.round(base.price.value * 2.5));
  const pointsDollars = base.price.value * 0.025;

  return {
    ...base,
    images: [
      { key: 1, id: base.id * 10 + 1, image: img450, small_image: base.image },
    ],
    current_image: base.id * 10 + 1,
    points_earned: points,
    points_earned_in_dollars_formatted: formatBzd(pointsDollars),
    preorder_chart: [
      { name: "Deadline to order", value: "Next Friday" },
      { name: "Initial payment due", value: formatBzd(base.price.value / 2) },
      { name: "Arrival date", value: "In ~4–6 weeks" },
      { name: "Remaining payment due", value: formatBzd(base.price.value / 2) },
    ],
    share_text: `Check out this ${base.title.slice(0, 42)}...`,
    share_link: `/item/${base.id}`,
    out_of_stock: null,
  };
}

export async function supabaseSearchItems(params: {
  q?: string;
  min?: number;
  max?: number;
  sort?: "relevance" | "price_asc" | "price_desc";
}): Promise<CatalogItem[]> {
  const supabase = createSupabaseServerClient();

  const q = (params.q ?? "").trim();
  const min = typeof params.min === "number" ? params.min : undefined;
  const max = typeof params.max === "number" ? params.max : undefined;

  let query = supabase
    .from("products")
    .select(
      "id,title,price,original_price,discount,image,only_left_in_stock,new_arrival,out_of_stock,points_earned,points_earned_dollars,share_text,share_link,current_image",
    );

  if (q) query = query.ilike("title", `%${q}%`);
  if (typeof min === "number") query = query.gte("price", min);
  if (typeof max === "number") query = query.lte("price", max);

  const sort = params.sort ?? "relevance";
  if (sort === "price_asc") query = query.order("price", { ascending: true });
  else if (sort === "price_desc")
    query = query.order("price", { ascending: false });
  else query = query.order("id", { ascending: false });

  const { data, error } = await query.limit(80);
  if (error) throw error;
  return (data as DbProduct[]).map(toCatalogItem);
}

export async function supabaseGetItem(id: number): Promise<ItemDetail | null> {
  const supabase = createSupabaseServerClient();

  const { data: prod, error } = await supabase
    .from("products")
    .select(
      "id,title,price,original_price,discount,image,only_left_in_stock,new_arrival,out_of_stock,points_earned,points_earned_dollars,share_text,share_link,current_image",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!prod) return null;

  const base = toCatalogItem(prod as DbProduct);

  const [{ data: imgs }, { data: chart }] = await Promise.all([
    supabase
      .from("product_images")
      .select("id,key,image,small_image")
      .eq("product_id", id)
      .order("id", { ascending: true }),
    supabase
      .from("product_preorder_chart")
      .select("name,value,sort_order")
      .eq("product_id", id)
      .order("sort_order", { ascending: true }),
  ]);

  const images = (imgs as DbImage[] | null) ?? [];
  const preorder_chart = (
    (chart as DbChartRow[] | null) ?? []
  ).map<PreorderChartRow>((r) => ({
    name: r.name,
    value: r.value,
  }));

  const points = (prod as DbProduct).points_earned;
  const pointsDollars = (prod as DbProduct).points_earned_dollars;

  const detail: ItemDetail = {
    ...base,
    images:
      images.length > 0
        ? images.map((x) => ({
            id: x.id,
            key: x.key ?? 0,
            image: x.image,
            small_image: x.small_image,
          }))
        : undefined,
    current_image:
      (prod as DbProduct).current_image ?? images[0]?.id ?? undefined,
    points_earned: points ?? undefined,
    points_earned_in_dollars_formatted:
      pointsDollars == null ? undefined : formatBzd(Number(pointsDollars)),
    preorder_chart: preorder_chart.length ? preorder_chart : undefined,
    share_text: (prod as DbProduct).share_text ?? undefined,
    share_link: (prod as DbProduct).share_link ?? undefined,
    out_of_stock: (prod as DbProduct).out_of_stock,
  };

  // If the DB doesn't store the richer fields for this product yet, mimic the mock fallback.
  if (
    !detail.images?.length ||
    !detail.preorder_chart?.length ||
    !detail.points_earned
  ) {
    const fallback = fallbackDetailFromCatalog(base);
    return {
      ...fallback,
      ...detail,
      images: detail.images?.length ? detail.images : fallback.images,
      preorder_chart: detail.preorder_chart?.length
        ? detail.preorder_chart
        : fallback.preorder_chart,
      points_earned: detail.points_earned ?? fallback.points_earned,
      points_earned_in_dollars_formatted:
        detail.points_earned_in_dollars_formatted ??
        fallback.points_earned_in_dollars_formatted,
    };
  }

  return detail;
}
