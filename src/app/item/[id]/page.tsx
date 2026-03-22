import { notFound } from "next/navigation";
import { getItem } from "@/lib/dataSource";
import { ItemDetailClient } from "@/components/ItemDetailClient";

export default async function ItemPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return notFound();

  const { item } = await getItem(id);
  if (!item) return notFound();

  return <ItemDetailClient item={item} />;
}
