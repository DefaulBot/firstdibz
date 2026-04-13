"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Copy, ChevronLeft, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ItemDetail, PreorderChartRow } from "../lib/types";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { formatBzd } from "../lib/utils";
import { addCartItem, useCart } from "../lib/cart";

export function ItemDetailClient({ item }: { item: ItemDetail }) {
  const router = useRouter();
  const {
    user,
    loading: authLoading,
    supabase,
    supabaseConfigured,
  } = useAuth();

  const { items: cartItems } = useCart();

  const images = useMemo(() => item.images ?? [], [item.images]);
  const [active, setActive] = useState(
    images.find((x: (typeof images)[0]) => x.id === item.current_image)?.id ??
      images[0]?.id,
  );

  const cartEntry = useMemo(
    () =>
      cartItems.find(
        (x: (typeof cartItems)[0]) => String(x.product_id) === String(item.id),
      ),
    [cartItems, item.id],
  );

  const [saved, setSaved] = useState<boolean>(false);
  const [hasOrder, setHasOrder] = useState<boolean>(false);
  const [busy, setBusy] = useState<"save" | "cart" | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [selectedVariationId, setSelectedVariationId] = useState<
    number | undefined
  >(item.variation_id);
  const [selectedVariation2Id, setSelectedVariation2Id] = useState<
    number | undefined
  >(item.variation2_id);

  const activeUrl =
    images.find((x: (typeof images)[0]) => x.id === active)?.image ??
    item.image;

  async function copyLink() {
    const url =
      typeof window !== "undefined"
        ? window.location.href
        : item.share_link || "";

    try {
      if (url) await navigator.clipboard.writeText(url);
    } catch {
      // ignore
    }
  }

  async function refreshUserState() {
    if (!supabase || !user) {
      setSaved(false);
      setHasOrder(false);
      return;
    }

    const [{ data: savedRows }, { data: orderRows }] = await Promise.all([
      supabase
        .from("saved_items")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", item.id)
        .limit(1),
      supabase
        .from("orders")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", item.id)
        .neq("status", "cancelled")
        .limit(1),
    ]);

    setSaved(Boolean(savedRows?.length));
    setHasOrder(Boolean(orderRows?.length));
  }

  useEffect(() => {
    if (!authLoading) {
      void refreshUserState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, authLoading, item.id]);

  function requireAuth() {
    if (!supabaseConfigured || !supabase) {
      setFlash(
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      );
      return false;
    }
    if (authLoading) return false;
    if (!user) {
      const redirect = encodeURIComponent(`/item/${item.id}`);
      router.push(`/signin?redirect=${redirect}`);
      return false;
    }
    return true;
  }

  function handleVariationSelect(variationId: number) {
    setSelectedVariationId(variationId);
    // Build URL with variation parameters
    const params = new URLSearchParams();
    params.set("variation_id", String(variationId));
    if (selectedVariation2Id) {
      params.set("variation2_id", String(selectedVariation2Id));
    }
    const newUrl = `/item/${item.id}?${params.toString()}`;
    console.log("🎨 Navigating to variation:", { variationId, newUrl });
    router.push(newUrl);
  }

  function handleVariation2Select(variation2Id: number) {
    setSelectedVariation2Id(variation2Id);
    // Build URL with variation parameters
    const params = new URLSearchParams();
    if (selectedVariationId) {
      params.set("variation_id", String(selectedVariationId));
    }
    params.set("variation2_id", String(variation2Id));
    const newUrl = `/item/${item.id}?${params.toString()}`;
    console.log("🎨 Navigating to variation2:", { variation2Id, newUrl });
    router.push(newUrl);
  }

  async function toggleSave() {
    if (!requireAuth()) return;

    setBusy("save");
    setFlash(null);

    try {
      if (saved) {
        await supabase!
          .from("saved_items")
          .delete()
          .eq("user_id", user!.id)
          .eq("product_id", item.id);

        setSaved(false);
        setFlash("Removed from saved items.");
      } else {
        await supabase!
          .from("saved_items")
          .upsert(
            { user_id: user!.id, product_id: item.id },
            { onConflict: "user_id,product_id" },
          );

        setSaved(true);
        setFlash("Saved for later.");
      }
    } catch (e: any) {
      setFlash(e?.message ?? "Could not update saved items");
    } finally {
      setBusy(null);
    }
  }

  async function addToCart() {
    if (hasOrder) {
      router.push("/account");
      return;
    }

    if (cartEntry) {
      router.push("/cart");
      setFlash("This item is already in your cart.");
      return;
    }

    if (item.out_of_stock) {
      setFlash("This item is currently out of stock.");
      return;
    }

    setBusy("cart");
    setFlash(null);
    console.log(item);
    try {
      addCartItem({
        product_id: item.id,
        title: item.title,
        image: item.image,
        price: item.price.value,
        out_of_stock: item?.out_of_stock ?? false,
        points_earned: item?.points_earned ?? null,
      });

      setFlash("Added to cart.");
    } catch (e: any) {
      setFlash(e?.message ?? "Could not add item to cart");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/search"
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to search
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={copyLink}>
            <Copy className="h-4 w-4" />
            Copy link
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <motion.div
            key={activeUrl}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="relative aspect-square overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm"
          >
            <Image
              src={activeUrl}
              alt={item.title}
              fill
              className="object-contain p-8"
              priority
            />
            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                Preorder
              </Badge>
              {item.points_earned ? (
                <Badge className="border-zinc-200 bg-white/70 text-zinc-700">
                  <Sparkles className="mr-1 h-3.5 w-3.5" />
                  {item.points_earned} pts
                </Badge>
              ) : null}
            </div>
          </motion.div>

          {images.length > 1 ? (
            <div className="grid grid-cols-6 gap-2">
              {images.slice(0, 6).map((img: (typeof images)[0]) => (
                <button
                  key={img.id}
                  onClick={() => setActive(img.id)}
                  className={`relative aspect-square overflow-hidden rounded-2xl border bg-white ${
                    img.id === active
                      ? "border-[#0f2f63]"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                  aria-label="Select image"
                >
                  <Image
                    src={img.small_image}
                    alt="thumbnail"
                    fill
                    className="object-contain p-2"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] border border-[#8C9FAE]/30 bg-white p-6 shadow-sm">
            <h1 className="text-xl font-extrabold text-[#1F2661]">
              {item.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-end gap-3">
              <div className="text-2xl font-black text-[#1F2661]">
                {item.price.formatted}
              </div>
              <div className="text-sm font-semibold text-[#8C9FAE]">
                Item #{item.id}
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#8C9FAE]/30 bg-[#D9EBDD]/40 p-4">
                <div className="text-xs font-bold text-[#549866]">Earn</div>
                <div className="mt-1 text-lg font-extrabold text-[#1F2661]">
                  {item.points_earned ?? "—"} pts
                </div>
                <div className="text-xs text-[#8C9FAE]">
                  ({item.points_earned_in_dollars_formatted ?? "—"})
                </div>
              </div>
              <div className="rounded-2xl border border-[#8C9FAE]/30 bg-[#D9EBDD]/40 p-4">
                <div className="text-xs font-bold text-[#549866]">Status</div>
                <div className="mt-1 text-lg font-extrabold text-[#1F2661]">
                  {item.out_of_stock ? "Out of stock" : "Available"}
                </div>
                <div className="text-xs text-[#8C9FAE]">
                  Preorder window may apply
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button
                className="flex-1 bg-[#1F2661] hover:bg-[#1F2661]/90 text-white"
                onClick={addToCart}
                disabled={busy === "cart"}
              >
                {hasOrder
                  ? "View preorder"
                  : cartEntry
                    ? "Go to cart"
                    : busy === "cart"
                      ? "Adding…"
                      : "Add to cart"}
              </Button>

              <Button
                variant="secondary"
                className="flex-1 bg-[#549866] hover:bg-[#549866]/90 text-white"
                onClick={toggleSave}
                disabled={busy === "save"}
              >
                {busy === "save"
                  ? "Saving…"
                  : saved
                    ? "Saved"
                    : "Save for later"}
              </Button>
            </div>

            {cartEntry && !hasOrder ? (
              <div className="mt-3 rounded-2xl border border-[#7FF46A] bg-[#7FF46A]/15 p-4 text-sm text-[#1F2661]">
                This item is already in your cart. Quantity:{" "}
                <b>{cartEntry.quantity}</b>.
              </div>
            ) : null}

            {hasOrder ? (
              <div className="mt-3 rounded-2xl border border-[#549866] bg-[#D9EBDD] p-4 text-sm text-[#1F2661]">
                You already have a preorder for this item. Deposit is typically{" "}
                <b>{formatBzd(item.price.value / 2)}</b>.
              </div>
            ) : null}

            {flash ? (
              <div className="mt-3 rounded-2xl border border-[#8C9FAE]/30 bg-[#D9EBDD]/40 p-4 text-sm text-[#1F2661]">
                {flash}
              </div>
            ) : null}
          </div>

          {item.variation_array && item.variation_array.length > 0 ? (
            <div className="rounded-[2rem] border border-[#8C9FAE]/30 bg-white p-6 shadow-sm">
              <div className="text-sm font-extrabold text-[#1F2661] mb-3">
                {item.variation ?? "Options"}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {item.variation_array.map(
                  (variation: (typeof item.variation_array)[0]) => {
                    const isSelected = selectedVariationId === variation.id;
                    const isOutOfStock = !!variation.not_available;
                    return (
                      <button
                        key={variation.id}
                        onClick={() => handleVariationSelect(variation.id)}
                        disabled={isOutOfStock}
                        className={`relative p-3 rounded-2xl border transition-all text-left group ${
                          isSelected
                            ? "border-[#1F2661] bg-[#D9EBDD] ring-2 ring-[#1F2661]"
                            : isOutOfStock
                              ? "border-[#8C9FAE]/30 opacity-50 cursor-not-allowed"
                              : "border-[#8C9FAE]/30 hover:border-[#1F2661] hover:bg-[#D9EBDD]/40 cursor-pointer"
                        }`}
                      >
                        {variation.color_url && item.has_variation_color_url ? (
                          <img
                            src={variation.color_url}
                            alt={variation.title}
                            className="w-full h-12 rounded mb-2 object-cover"
                          />
                        ) : null}
                        <div className="text-xs font-semibold text-[#1F2661]">
                          {variation.title}
                        </div>
                        {isSelected ? (
                          <div className="text-xs font-bold text-[#1F2661]">
                            Selected
                          </div>
                        ) : null}
                        {isOutOfStock ? (
                          <div className="text-xs text-red-600 font-bold">
                            Out of stock
                          </div>
                        ) : null}
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          ) : null}

          {item.variation2_array && item.variation2_array.length > 0 ? (
            <div className="rounded-[2rem] border border-[#8C9FAE]/30 bg-white p-6 shadow-sm">
              <div className="text-sm font-extrabold text-[#1F2661] mb-3">
                {item.variation2 ?? "Additional Options"}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {item.variation2_array.map(
                  (variation: (typeof item.variation2_array)[0]) => {
                    const isSelected = selectedVariation2Id === variation.id;
                    const isOutOfStock = !!variation.not_available;
                    return (
                      <button
                        key={variation.id}
                        onClick={() => handleVariation2Select(variation.id)}
                        disabled={isOutOfStock}
                        className={`p-3 rounded-2xl border transition-all text-left ${
                          isSelected
                            ? "border-[#1F2661] bg-[#D9EBDD] ring-2 ring-[#1F2661]"
                            : isOutOfStock
                              ? "border-[#8C9FAE]/30 opacity-50 cursor-not-allowed"
                              : "border-[#8C9FAE]/30 hover:border-[#1F2661] hover:bg-[#D9EBDD]/40 cursor-pointer"
                        }`}
                      >
                        <div className="text-xs font-semibold text-[#1F2661]">
                          {variation.title}
                        </div>
                        {isSelected ? (
                          <div className="text-xs font-bold text-[#1F2661]">
                            Selected
                          </div>
                        ) : null}
                        {isOutOfStock ? (
                          <div className="text-xs text-red-600 font-bold">
                            Out of stock
                          </div>
                        ) : null}
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          ) : null}

          <div className="rounded-[2rem] border border-[#8C9FAE]/30 bg-white p-6 shadow-sm">
            <div className="text-sm font-extrabold text-[#1F2661]">
              Payment timeline
            </div>
            <div className="mt-3 space-y-3">
              {(item.preorder_chart ?? []).map((row: PreorderChartRow) => (
                <div
                  key={row.name}
                  className="flex items-center justify-between rounded-2xl border border-[#8C9FAE]/30 bg-[#D9EBDD]/30 px-4 py-3"
                >
                  <div className="text-sm font-semibold text-[#1F2661]">
                    {row.name}
                  </div>
                  <div className="text-sm font-extrabold text-[#1F2661]">
                    {row.value}
                  </div>
                </div>
              ))}

              {!item.preorder_chart?.length ? (
                <div className="text-sm text-[#8C9FAE]">
                  No schedule provided for this item yet.
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#8C9FAE]/30 bg-[#D9EBDD] p-6 shadow-sm">
            <div className="text-sm font-extrabold text-[#1F2661]">Share</div>
            <div className="mt-2 text-sm text-[#549866]">
              {item.share_text ?? "Send this item to a friend."}
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="ghost"
                onClick={copyLink}
                className="text-[#1F2661]"
              >
                <Copy className="h-4 w-4" />
                Copy link
              </Button>
              {item.share_link ? (
                <a
                  className="inline-flex"
                  href={item.share_link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="ghost">Open original</Button>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
