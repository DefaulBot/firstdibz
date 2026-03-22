"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Copy, ChevronLeft, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ItemDetail } from "@/lib/types";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { formatBzd } from "@/lib/utils";
import { addCartItem, useCart } from "@/lib/cart";

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
    images.find((x) => x.id === item.current_image)?.id ?? images[0]?.id,
  );

  const cartEntry = useMemo(
    () => cartItems.find((x) => String(x.product_id) === String(item.id)),
    [cartItems, item.id],
  );

  const [saved, setSaved] = useState<boolean>(false);
  const [hasOrder, setHasOrder] = useState<boolean>(false);
  const [busy, setBusy] = useState<"save" | "cart" | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const activeUrl = images.find((x) => x.id === active)?.image ?? item.image;

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
              {images.slice(0, 6).map((img) => (
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
          <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
            <h1 className="text-xl font-extrabold text-zinc-900">
              {item.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-end gap-3">
              <div className="text-2xl font-black text-[#0f2f63]">
                {item.price.formatted}
              </div>
              <div className="text-sm font-semibold text-zinc-500">
                Item #{item.id}
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-xs font-bold text-zinc-600">Earn</div>
                <div className="mt-1 text-lg font-extrabold text-zinc-900">
                  {item.points_earned ?? "—"} pts
                </div>
                <div className="text-xs text-zinc-600">
                  ({item.points_earned_in_dollars_formatted ?? "—"})
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-xs font-bold text-zinc-600">Status</div>
                <div className="mt-1 text-lg font-extrabold text-zinc-900">
                  {item.out_of_stock ? "Out of stock" : "Available"}
                </div>
                <div className="text-xs text-zinc-600">
                  Preorder window may apply
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button
                className="flex-1"
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
                className="flex-1"
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
              <div className="mt-3 rounded-2xl border border-[#87ef61] bg-[#87ef61]/10 p-4 text-sm text-zinc-800">
                This item is already in your cart. Quantity:{" "}
                <b>{cartEntry.quantity}</b>.
              </div>
            ) : null}

            {hasOrder ? (
              <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                You already have a preorder for this item. Deposit is typically{" "}
                <b>{formatBzd(item.price.value / 2)}</b>.
              </div>
            ) : null}

            {flash ? (
              <div className="mt-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
                {flash}
              </div>
            ) : null}
          </div>

          <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-extrabold text-zinc-900">
              Payment timeline
            </div>
            <div className="mt-3 space-y-3">
              {(item.preorder_chart ?? []).map((row) => (
                <div
                  key={row.name}
                  className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
                >
                  <div className="text-sm font-semibold text-zinc-700">
                    {row.name}
                  </div>
                  <div className="text-sm font-extrabold text-zinc-900">
                    {row.value}
                  </div>
                </div>
              ))}

              {!item.preorder_chart?.length ? (
                <div className="text-sm text-zinc-600">
                  No schedule provided for this item yet.
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-[2rem] border border-zinc-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
            <div className="text-sm font-extrabold text-zinc-900">Share</div>
            <div className="mt-2 text-sm text-zinc-600">
              {item.share_text ?? "Send this item to a friend."}
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="ghost" onClick={copyLink}>
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
