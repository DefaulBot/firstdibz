import { NextResponse } from "next/server";
import { getItem } from "@/lib/dataSource";

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  console.log("📦 API /api/items request:", { id: ctx.params.id });

  const id = Number(ctx.params.id);
  if (!Number.isFinite(id)) {
    console.warn("❌ Invalid item ID:", ctx.params.id);
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  console.log("🔍 Fetching item details for ID:", id);
  const { item, source } = await getItem(id);

  console.log("📊 Fetch result:", {
    found: !!item,
    source,
    itemId: item?.id,
    itemTitle: item?.title,
  });

  if (!item) {
    console.warn("⚠️ Item not found for ID:", id);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  console.log("✅ Returning item data for ID:", id);
  return NextResponse.json({ source, item });
}
