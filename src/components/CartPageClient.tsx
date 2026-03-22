"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import { useAuth } from "./AuthProvider";
import { useCart } from "@/lib/cart";
import { formatBzd } from "@/lib/utils";

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

export function CartPageClient() {
  const router = useRouter();
  const {
    user,
    loading: authLoading,
    supabase,
    supabaseConfigured,
  } = useAuth();

  const { items, count, subtotal, setQuantity, removeItem, clearAll } =
    useCart();

  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const hasUnavailable = items.some((item) => item.out_of_stock);
  const deposit = useMemo(() => roundMoney(subtotal / 2), [subtotal]);
  const balance = useMemo(
    () => roundMoney(subtotal - deposit),
    [subtotal, deposit],
  );

  function requireAuth() {
    if (!supabaseConfigured || !supabase) {
      setFlash(
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      );
      return false;
    }

    if (authLoading) return false;

    if (!user) {
      const redirect = encodeURIComponent("/cart");
      router.push(`/signin?redirect=${redirect}`);
      return false;
    }

    return true;
  }

  async function checkout() {
    if (!items.length) {
      setFlash("Your cart is empty.");
      return;
    }

    if (hasUnavailable) {
      setFlash("Remove out-of-stock items before continuing.");
      return;
    }

    if (!requireAuth()) return;

    setBusy(true);
    setFlash(null);

    try {
      const payload = items.map((line) => {
        const total_amount = roundMoney(line.price * line.quantity);
        const deposit_amount = roundMoney(total_amount / 2);
        const balance_amount = roundMoney(total_amount - deposit_amount);
        const points_earned = Math.max(10, Math.round(total_amount * 2.5));

        return {
          user_id: user!.id,
          product_id: line.product_id,
          quantity: line.quantity,
          status: "preorder",
          total_amount,
          deposit_amount,
          balance_amount,
          amount_paid: 0,
          points_earned,
        };
      });

      const { error } = await supabase!
        .from("orders")
        .upsert(payload, { onConflict: "user_id,product_id" });

      if (error) throw error;

      await supabase!
        .from("saved_items")
        .delete()
        .eq("user_id", user!.id)
        .in(
          "product_id",
          items.map((x) => x.product_id),
        );

      clearAll();
      router.push("/account");
    } catch (e: any) {
      setFlash(e?.message ?? "Could not create preorders");
    } finally {
      setBusy(false);
    }
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link
          href="/search"
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Continue shopping
        </Link>

        <div className="mt-6 rounded-[2rem] border border-zinc-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
            <ShoppingCart className="h-8 w-8 text-zinc-600" />
          </div>
          <h1 className="mt-4 text-2xl font-black text-zinc-900">
            Your cart is empty
          </h1>
          <p className="mt-2 text-zinc-600">
            Add items from a product page, then finish your preorder here.
          </p>
          <div className="mt-6">
            <Link href="/search">
              <Button>Browse items</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/search"
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Continue shopping
        </Link>

        <button
          onClick={() => clearAll()}
          className="text-sm font-semibold text-zinc-500 hover:text-zinc-800"
        >
          Clear cart
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr,0.9fr]">
        <div className="space-y-4">
          {items.map((line) => (
            <div
              key={String(line.product_id)}
              className="rounded-[2rem] border border-zinc-200 bg-white p-4 shadow-sm sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative h-28 w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white sm:w-28">
                  <Image
                    src={line.image}
                    alt={line.title}
                    fill
                    className="object-contain p-3"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <Link
                    href={`/item/${line.product_id}`}
                    className="text-lg font-extrabold text-zinc-900 hover:underline"
                  >
                    {line.title}
                  </Link>

                  <div className="mt-1 text-sm font-semibold text-zinc-500">
                    Item #{line.product_id}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="text-lg font-black text-[#0f2f63]">
                      {formatBzd(line.price)}
                    </div>

                    {line.out_of_stock ? (
                      <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                        Out of stock
                      </span>
                    ) : (
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                        Available
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50">
                      <button
                        onClick={() =>
                          setQuantity(line.product_id, line.quantity - 1)
                        }
                        className="px-3 py-2 text-zinc-700 hover:text-zinc-900"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span className="min-w-[48px] text-center text-sm font-bold text-zinc-900">
                        {line.quantity}
                      </span>

                      <button
                        onClick={() =>
                          setQuantity(line.product_id, line.quantity + 1)
                        }
                        className="px-3 py-2 text-zinc-700 hover:text-zinc-900"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-sm font-semibold text-zinc-700">
                      Line total:{" "}
                      <span className="font-extrabold text-zinc-900">
                        {formatBzd(line.price * line.quantity)}
                      </span>
                    </div>

                    <button
                      onClick={() => removeItem(line.product_id)}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {flash ? (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
              {flash}
            </div>
          ) : null}
        </div>

        <div>
          <div className="sticky top-28 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-zinc-900">Order summary</h2>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm text-zinc-600">
                <span>Items</span>
                <span className="font-semibold text-zinc-900">{count}</span>
              </div>

              <div className="flex items-center justify-between text-sm text-zinc-600">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900">
                  {formatBzd(subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-zinc-600">
                <span>Deposit due now</span>
                <span className="font-semibold text-zinc-900">
                  {formatBzd(deposit)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-zinc-600">
                <span>Balance later</span>
                <span className="font-semibold text-zinc-900">
                  {formatBzd(balance)}
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              Your cart items will only become preorders when you click the
              button below.
            </div>

            <div className="mt-5">
              <Button className="w-full" onClick={checkout} disabled={busy}>
                {busy ? "Creating preorders…" : "Create preorders from cart"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
