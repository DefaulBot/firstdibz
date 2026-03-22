"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  CalendarClock,
  CreditCard,
  LogOut,
  Package,
  Sparkles,
  User2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { CatalogItem } from "@/lib/types";
import { formatBzd } from "@/lib/utils";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { ProductGrid } from "@/components/ProductGrid";

type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  points: number;
};

type OrderRow = {
  id: string;
  status: "preorder" | "paid" | "cancelled";
  product_id: number;
  quantity: number;
  total_amount: number;
  deposit_amount: number;
  balance_amount: number;
  amount_paid: number;
  points_earned: number;
  created_at: string;
  products: {
    id: number;
    title: string;
    image: string;
    price: number;
  } | null;
};

export default function AccountPage() {
  const router = useRouter();
  const {
    user,
    loading: authLoading,
    supabase,
    signOut,
    supabaseConfigured,
  } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [savedItems, setSavedItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!user || !supabase) return;
    setLoading(true);
    setError(null);
    try {
      const [
        { data: prof, error: pErr },
        { data: ord, error: oErr },
        { data: saved, error: sErr },
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select("id,email,display_name,points")
          .eq("id", user.id)
          .maybeSingle(),
        supabase
          .from("orders")
          .select(
            "id,status,product_id,quantity,total_amount,deposit_amount,balance_amount,amount_paid,points_earned,created_at",
          )
          .neq("status", "cancelled")
          .order("created_at", { ascending: false }),
        supabase
          .from("saved_items")
          .select("product_id,created_at")
          .order("created_at", { ascending: false }),
      ]);

      if (pErr) throw pErr;
      if (oErr) throw oErr;
      if (sErr) throw sErr;

      setProfile(prof as any);

      // Fetch product details from the API for orders
      const ordersWithProducts: OrderRow[] = [];
      const productIds = new Set(
        (ord as any[])?.map((o) => o.product_id) ?? [],
      );

      // For each unique product ID, fetch its details
      const productCache: Record<number, any> = {};
      for (const productId of productIds) {
        try {
          const response = await fetch(`/api/items/${productId}`);
          if (response.ok) {
            const data = await response.json();
            productCache[productId] = data.item;
          }
        } catch (e) {
          console.error(`Failed to fetch product ${productId}:`, e);
        }
      }

      // Enrich orders with product data
      for (const order of (ord as any[]) ?? []) {
        const product = productCache[order.product_id];
        ordersWithProducts.push({
          ...order,
          products: product
            ? {
                id: product.id,
                title: product.title,
                image: product.image,
                price: product.price.value,
              }
            : null,
        });
      }

      setOrders(ordersWithProducts);

      // Fetch product details for saved items
      const savedProductIds = new Set(
        (saved as any[])?.map((s) => s.product_id) ?? [],
      );
      const savedProductCache: Record<number, any> = {};
      for (const productId of savedProductIds) {
        try {
          const response = await fetch(`/api/items/${productId}`);
          if (response.ok) {
            const data = await response.json();
            savedProductCache[productId] = data.item;
          }
        } catch (e) {
          console.error(`Failed to fetch product ${productId}:`, e);
        }
      }

      const savedAsCatalog: CatalogItem[] = ((saved as any[]) ?? [])
        .map((r) => savedProductCache[r.product_id])
        .filter(Boolean)
        .map((p) => ({
          id: p.id,
          title: p.title,
          image: p.image,
          price: {
            value: p.price.value,
            formatted: p.price.formatted,
          },
        }));

      setSavedItems(savedAsCatalog);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load account");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!supabaseConfigured) return;
    if (!authLoading && !user) {
      router.push("/signin?redirect=%2Faccount");
      return;
    }
    if (!authLoading && user) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user?.id]);

  const stats = useMemo(() => {
    const preorderCount = orders.length;
    const points = profile?.points ?? 0;
    return { preorderCount, points };
  }, [orders.length, profile?.points]);

  async function payNextDue(order: OrderRow) {
    if (!user || !supabase) return;
    const paid = Number(order.amount_paid);
    const deposit = Number(order.deposit_amount);
    const total = Number(order.total_amount);

    const due =
      paid < deposit ? deposit - paid : paid < total ? total - paid : 0;
    if (due <= 0) return;

    const { error } = await supabase.from("order_payments").insert({
      user_id: user.id,
      order_id: order.id,
      amount: Number(due.toFixed(2)),
      method: "manual",
      note: "Dashboard payment",
    });
    if (error) {
      setError(error.message);
      return;
    }
    await load();
  }

  if (authLoading) {
    return (
      <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 text-sm text-zinc-600">
        Loading…
      </div>
    );
  }

  if (!supabaseConfigured) {
    return (
      <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 text-sm text-zinc-600">
        Supabase is not configured. Add <b>NEXT_PUBLIC_SUPABASE_URL</b> and{" "}
        <b>NEXT_PUBLIC_SUPABASE_ANON_KEY</b> to <b>.env.local</b>.
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <aside className="lg:col-span-4">
        <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0f2f63] text-white shadow-soft">
              <User2 className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-zinc-900">
                {profile?.display_name ?? "Account"}
              </div>
              <div className="text-sm text-zinc-600">{user?.email}</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Stat
              icon={<Package className="h-4 w-4" />}
              label="Preorders"
              value={String(stats.preorderCount)}
            />
            <Stat
              icon={<Sparkles className="h-4 w-4" />}
              label="Points"
              value={String(stats.points)}
            />
          </div>

          <div className="mt-5 flex gap-2">
            <Link href="/search" className="flex-1">
              <Button className="w-full" variant="ghost">
                Browse
              </Button>
            </Link>
            <Button
              className="flex-1"
              variant="primary"
              onClick={async () => {
                await signOut();
                router.push("/signin");
              }}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      <section className="lg:col-span-8">
        <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-lg font-extrabold text-zinc-900">
                Your preorders
              </div>
              <div className="text-sm text-zinc-600">
                Track what’s due and what’s already paid.
              </div>
            </div>
            <Badge className="border-blue-200 bg-blue-50 text-blue-700">
              Supabase
            </Badge>
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="mt-6 rounded-[2rem] border border-zinc-200 bg-zinc-50 p-8 text-center text-sm text-zinc-600">
              Loading your dashboard…
            </div>
          ) : null}

          {!loading && orders.length === 0 ? (
            <div className="mt-6 rounded-[2rem] border border-zinc-200 bg-zinc-50 p-8 text-center text-sm text-zinc-600">
              No preorders yet.
            </div>
          ) : null}

          <div className="mt-5 grid gap-4">
            {orders.map((order) => {
              const product = order.products;
              const paid = Number(order.amount_paid);
              const deposit = Number(order.deposit_amount);
              const total = Number(order.total_amount);
              const due =
                paid < deposit
                  ? deposit - paid
                  : paid < total
                    ? total - paid
                    : 0;
              const dueLabel =
                paid < deposit
                  ? "Deposit due"
                  : paid < total
                    ? "Remaining due"
                    : "Paid";

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid gap-4 rounded-[2rem] border border-zinc-200 bg-zinc-50 p-4 sm:grid-cols-12 sm:items-center"
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-zinc-200 bg-white sm:col-span-3">
                    {product?.image ? (
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-contain p-3"
                      />
                    ) : null}
                  </div>
                  <div className="sm:col-span-6">
                    <div className="line-clamp-2 text-sm font-extrabold text-zinc-900">
                      {product?.title ?? `Item #${order.product_id}`}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-black text-[#0f2f63]">
                        {formatBzd(Number(product?.price ?? total))}
                      </span>
                      <span className="text-zinc-500">
                        · Item #{order.product_id}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <MiniPill
                        icon={<CalendarClock className="h-4 w-4" />}
                        label="Status"
                        value={order.status}
                      />
                      <MiniPill
                        icon={<CreditCard className="h-4 w-4" />}
                        label={dueLabel}
                        value={
                          due > 0 ? formatBzd(Number(due.toFixed(2))) : "—"
                        }
                      />
                      <MiniPill
                        icon={<Sparkles className="h-4 w-4" />}
                        label="Earn"
                        value={`${order.points_earned} pts`}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 sm:col-span-3 sm:justify-end">
                    <Link href={`/item/${order.product_id}`}>
                      <Button>View</Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {savedItems.length ? (
          <div className="mt-6 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-extrabold text-zinc-900">
                  Saved items
                </div>
                <div className="text-sm text-zinc-600">
                  Items you've saved for later.
                </div>
              </div>
              <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                {savedItems.length}
              </Badge>
            </div>
            <div className="mt-4">
              <ProductGrid items={savedItems} />
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
      <div className="flex items-center gap-2 text-xs font-bold text-zinc-600">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-xl font-black text-zinc-900">{value}</div>
    </div>
  );
}

function MiniPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs">
      <span className="text-zinc-500">{icon}</span>
      <span className="font-bold text-zinc-700">{label}:</span>
      <span className="font-extrabold text-zinc-900">{value}</span>
    </div>
  );
}
