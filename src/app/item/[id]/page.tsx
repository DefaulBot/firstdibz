import { notFound } from "next/navigation";
import { getItem } from "@/lib/dataSource";
import { ItemDetailClient } from "@/components/ItemDetailClient";

export default async function ItemPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  console.log("📄 ItemPage - Received params:", params);
  console.log("📄 ItemPage - Received searchParams:", searchParams);

  const id = Number(params.id);
  const variationId = searchParams.variation_id
    ? Number(searchParams.variation_id)
    : undefined;
  const variation2Id = searchParams.variation2_id
    ? Number(searchParams.variation2_id)
    : undefined;

  console.log("📄 ItemPage - Parsed values:", {
    id,
    variationId,
    variation2Id,
    isValidId: Number.isFinite(id),
  });

  if (!Number.isFinite(id)) {
    console.warn("❌ ItemPage - Invalid ID, showing 404");
    return notFound();
  }

  console.log("🔍 ItemPage - Calling getItem with variation parameters:", {
    id,
    variationId,
    variation2Id,
  });
  const { item, source } = await getItem(id, variationId, variation2Id);

  console.log("📊 ItemPage - getItem result:", {
    found: !!item,
    source,
    itemId: item?.id,
    itemTitle: item?.title,
    price: item?.price,
    selectedVariationId: item?.variation_id,
    selectedVariation2Id: item?.variation2_id,
    hasImages: item?.images && item.images.length > 0,
    imageCount: item?.images?.length,
    preorderChart: item?.preorder_chart,
  });

  if (!item) {
    console.warn("⚠️ ItemPage - Item not found, showing 404");
    return notFound();
  }

  console.log("✅ ItemPage - Full item data loaded:", {
    id: item.id,
    title: item.title,
    price: item.price,
    image: item.image,
    currentImage: item.current_image,
    imagesCount: item.images?.length,
    preorderChartCount: item.preorder_chart?.length,
    variationId: item.variation_id,
    variationCount: item.variation_array?.length,
    variation2Id: item.variation2_id,
    variation2Count: item.variation2_array?.length,
    outOfStock: item.out_of_stock,
    newArrival: item.newArrival,
    pointsEarned: item.points_earned,
  });

  console.log("🎨 ItemPage - Rendering ItemDetailClient with full item data");
  return <ItemDetailClient item={item} />;
}
