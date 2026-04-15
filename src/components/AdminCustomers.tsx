"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Users, Star, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatBzd } from "@/lib/utils";
import type { SupabaseClient } from "@supabase/supabase-js";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type CustomerProfile = {
  id: string;
  email: string | null;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  city: string | null;
  points: number;
  is_admin: boolean;
  created_at: string;
  order_count: number;
  total_spent: number;
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AdminCustomers({ supabase }: { supabase: SupabaseClient }) {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "points" | "spent">("recent");

  async function loadCustomers() {
    setLoading(true);
    setError(null);
    try {
      // Fetch profiles
      const { data: profiles, error: profErr } = await supabase
        .from("profiles")
        .select(
          "id,email,display_name,first_name,last_name,phone_number,city,points,is_admin,created_at",
        )
        .order("created_at", { ascending: false });

      if (profErr) throw profErr;

      // Fetch order aggregates
      const { data: orders, error: ordErr } = await supabase
        .from("orders")
        .select("user_id,total_amount");

      if (ordErr) throw ordErr;

      // Aggregate order data per user
      const orderMap = new Map<string, { count: number; total: number }>();
      for (const o of orders as { user_id: string; total_amount: number }[]) {
        const existing = orderMap.get(o.user_id) ?? { count: 0, total: 0 };
        existing.count += 1;
        existing.total += Number(o.total_amount) || 0;
        orderMap.set(o.user_id, existing);
      }

      const merged: CustomerProfile[] = ((profiles as any[]) ?? []).map(
        (p) => ({
          ...p,
          points: Number(p.points) || 0,
          order_count: orderMap.get(p.id)?.count ?? 0,
          total_spent: orderMap.get(p.id)?.total ?? 0,
        }),
      );

      setCustomers(merged);
    } catch (e: any) {
      setError(e.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    let list = [...customers];

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.email?.toLowerCase().includes(q) ||
          c.display_name?.toLowerCase().includes(q) ||
          c.first_name?.toLowerCase().includes(q) ||
          c.last_name?.toLowerCase().includes(q) ||
          c.phone_number?.includes(q) ||
          c.city?.toLowerCase().includes(q),
      );
    }

    if (sortBy === "points") {
      list.sort((a, b) => b.points - a.points);
    } else if (sortBy === "spent") {
      list.sort((a, b) => b.total_spent - a.total_spent);
    } else {
      list.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    }

    return list;
  }, [customers, search, sortBy]);

  const totalPoints = customers.reduce((s, c) => s + c.points, 0);

  return (
    <div className="rounded-[2rem] border border-[#8C9FAE]/30 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-[#1F2661]">
            Customer Directory
          </h2>
          <p className="text-sm text-[#8C9FAE]">
            {filtered.length} customers · {totalPoints.toLocaleString()} total
            points in circulation
          </p>
        </div>
        <Button variant="ghost" onClick={() => void loadCustomers()}>
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8C9FAE]" />
          <Input
            placeholder="Search by name, email, phone, or city…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value as "recent" | "points" | "spent")
          }
          className="rounded-2xl border border-[#8C9FAE]/30 bg-white px-4 py-2.5 text-sm font-medium text-[#1F2661] shadow-sm outline-none focus:border-[#1F2661] focus:ring-4 focus:ring-[#1F2661]/10"
        >
          <option value="recent">Newest First</option>
          <option value="points">Most Points</option>
          <option value="spent">Highest Spend</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="py-8 text-center text-sm text-[#8C9FAE]">
          Loading customers…
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-8 text-center text-sm text-[#8C9FAE]">
          {search ? "No customers match your search." : "No customers yet."}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((customer, idx) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="flex flex-col gap-3 rounded-2xl border border-[#8C9FAE]/30 bg-[#D9EBDD]/20 p-4 sm:flex-row sm:items-center"
            >
              {/* Avatar */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1F2661] text-sm font-bold text-white">
                {(
                  customer.display_name?.[0] ??
                  customer.email?.[0] ??
                  "?"
                ).toUpperCase()}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-[#1F2661]">
                    {customer.display_name ||
                      [customer.first_name, customer.last_name]
                        .filter(Boolean)
                        .join(" ") ||
                      "Unknown"}
                  </span>
                  {customer.is_admin && (
                    <Badge className="border-purple-200 bg-purple-50 text-purple-700 text-[10px] px-1.5 py-0">
                      Admin
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-[#8C9FAE]">
                  {customer.email}
                  {customer.phone_number ? ` · ${customer.phone_number}` : ""}
                  {customer.city ? ` · ${customer.city}` : ""}
                </p>
                <p className="mt-0.5 text-[10px] text-[#8C9FAE]">
                  Joined {new Date(customer.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* Stats */}
              <div className="flex gap-4 text-center">
                <div className="rounded-xl bg-[#f0f6ff] px-3 py-2">
                  <div className="flex items-center gap-1 text-xs text-[#8C9FAE]">
                    <Star className="h-3 w-3" /> Points
                  </div>
                  <div className="text-sm font-black text-[#1F2661]">
                    {customer.points.toLocaleString()}
                  </div>
                </div>
                <div className="rounded-xl bg-[#f0f6ff] px-3 py-2">
                  <div className="flex items-center gap-1 text-xs text-[#8C9FAE]">
                    <ShoppingBag className="h-3 w-3" /> Orders
                  </div>
                  <div className="text-sm font-black text-[#1F2661]">
                    {customer.order_count}
                  </div>
                </div>
                <div className="rounded-xl bg-[#f0f6ff] px-3 py-2">
                  <div className="flex items-center gap-1 text-xs text-[#8C9FAE]">
                    <Users className="h-3 w-3" /> Spent
                  </div>
                  <div className="text-sm font-black text-[#1F2661]">
                    {formatBzd(customer.total_spent)}
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="flex gap-2 sm:flex-col">
                {customer.email && (
                  <a
                    href={`mailto:${customer.email}`}
                    className="rounded-xl border border-[#8C9FAE]/30 px-3 py-1.5 text-xs font-semibold text-[#1F2661] transition hover:bg-[#eef2f5]"
                  >
                    📧 Email
                  </a>
                )}
                {customer.phone_number && (
                  <a
                    href={`https://wa.me/${customer.phone_number.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-[#8C9FAE]/30 px-3 py-1.5 text-xs font-semibold text-[#1F2661] transition hover:bg-[#eef2f5]"
                  >
                    💬 WhatsApp
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
