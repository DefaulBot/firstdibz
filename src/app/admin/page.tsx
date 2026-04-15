"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BarChart3,
  LogOut,
  Package,
  Search,
  ShoppingCart,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Mail,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/components/AuthProvider";
import { formatBzd } from "@/lib/utils";
import { OrderDetailsModal, OrderEditModal } from "@/components/OrderModals";
import { AdminMessages } from "@/components/AdminMessages";
import { AdminCustomers } from "@/components/AdminCustomers";
import type {
  OrderStatus,
  ProductSummary,
  OrdersQueryRow,
  OrderRow,
} from "@/lib/types";

type AdminTab = "orders" | "messages" | "customers";

type ProductImageItem = {
  key?: number;
  id?: number;
  image?: string;
  small_image?: string;
};

type ItemApiResponse = {
  source?: string;
  item?: {
    id?: number;
    title?: string;
    price?: string | number | null;
    image?: string | null;
    images?: ProductImageItem[];
  };
  pageProps?: {
    data?: {
      id?: number;
      title?: string;
      price?: string | number | null;
      image?: string | null;
      images?: ProductImageItem[];
    };
  };
};

function toNumber(value: unknown): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.-]/g, "");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function parseApiPrice(value: unknown): number | null {
  if (value == null) return null;
  const parsed = toNumber(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeOrderRow(row: OrdersQueryRow): Omit<OrderRow, "products"> {
  return {
    id: row.id,
    status: row.status,
    product_id: toNumber(row.product_id),
    quantity: toNumber(row.quantity),
    total_amount: toNumber(row.total_amount),
    deposit_amount: toNumber(row.deposit_amount),
    balance_amount: toNumber(row.balance_amount),
    amount_paid: toNumber(row.amount_paid),
    points_earned: toNumber(row.points_earned),
    created_at: row.created_at,
    user_id: row.user_id,
    profiles: row.profiles,
  };
}

function normalizeItemPayload(
  payload: ItemApiResponse,
  fallbackId: number,
): ProductSummary | null {
  // Handle both the new API format { item } and legacy format { pageProps: { data } }
  const item = payload?.item || payload?.pageProps?.data;
  if (!item) return null;

  const image =
    item.image ||
    item.images?.[0]?.image ||
    item.images?.[0]?.small_image ||
    null;

  return {
    id: toNumber(item.id ?? fallbackId),
    title: item.title?.trim() || `Item #${fallbackId}`,
    image,
    price: parseApiPrice(item.price),
  };
}

async function fetchProductById(
  productId: number,
): Promise<ProductSummary | null> {
  try {
    const response = await fetch(`/api/items/${productId}`, {
      method: "GET",
      cache: "no-store",
      credentials: "same-origin",
    });

    if (!response.ok) {
      console.error(`Failed to fetch product ${productId}: ${response.status}`);
      return null;
    }

    const payload = (await response.json()) as ItemApiResponse;
    return normalizeItemPayload(payload, productId);
  } catch (error) {
    console.error(`Failed to fetch product ${productId}`, error);
    return null;
  }
}

async function fetchProductsByIds(
  productIds: number[],
): Promise<Map<number, ProductSummary>> {
  const uniqueIds = [
    ...new Set(productIds.filter((id) => Number.isFinite(id) && id > 0)),
  ];

  const results = await Promise.all(
    uniqueIds.map((id) => fetchProductById(id)),
  );
  const map = new Map<number, ProductSummary>();

  for (const product of results) {
    if (product) {
      map.set(product.id, product);
    }
  }

  return map;
}

function textIncludes(
  value: string | null | undefined,
  query: string,
): boolean {
  if (!value) return false;
  return value.toLowerCase().includes(query);
}

export default function AdminPage() {
  const router = useRouter();
  const {
    user,
    loading: authLoading,
    supabase,
    signOut,
    supabaseConfigured,
  } = useAuth();

  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | OrderStatus>("all");
  const [sortBy, setSortBy] = useState<"recent" | "amount">("recent");
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("orders");
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);

  async function load() {
    if (!user || !supabase) return;

    setLoading(true);
    setError(null);

    try {
      const { data: adminData, error: adminErr } = await supabase
        .from("profiles")
        .select("id,email,display_name,is_admin")
        .eq("id", user.id)
        .maybeSingle();

      if (adminErr) {
        console.error("Admin profile check error:", adminErr);
        throw adminErr;
      }

      if (!adminData?.is_admin) {
        setError("You do not have admin access.");
        return;
      }

      const { data: ordersData, error: ordersErr } = await supabase
        .from("orders")
        .select(
          "id,status,product_id,quantity,total_amount,deposit_amount,balance_amount,amount_paid,points_earned,created_at,user_id",
        )
        .order("created_at", { ascending: false });

      if (ordersErr) {
        console.error("Orders query error:", ordersErr);
        throw ordersErr;
      }

      // Fetch user profiles separately
      const userIds = (ordersData as any[]).map((order) => order.user_id);
      const { data: profilesData, error: profilesErr } = await supabase
        .from("profiles")
        .select("id,email,display_name,phone_number")
        .in("id", userIds);

      if (profilesErr) {
        console.error("Profiles query error:", profilesErr);
        throw profilesErr;
      }

      const profilesMap = new Map(
        (profilesData as any[]).map((p) => [
          p.id,
          {
            email: p.email,
            display_name: p.display_name,
            phone_number: p.phone_number,
          },
        ]),
      );

      const normalizedOrders = ((ordersData as any[]) ?? []).map((order) => {
        const baseOrder = normalizeOrderRow({
          ...order,
          profiles: profilesMap.get(order.user_id) || null,
        } as OrdersQueryRow);
        return {
          ...baseOrder,
          profiles: profilesMap.get(order.user_id) || null,
        };
      });

      const productMap = await fetchProductsByIds(
        normalizedOrders.map((order) => order.product_id),
      );

      const mergedOrders: OrderRow[] = normalizedOrders.map((order) => ({
        ...order,
        products: productMap.get(order.product_id) ?? null,
      }));

      setOrders(mergedOrders);
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to load admin panel";
      setError(message);
    } finally {
      setLoading(false);
    }

    // Load unread message count separately so it doesn't block orders
    try {
      const { data: msgData, error: msgErr } = await supabase
        .from("contact_messages")
        .select("id")
        .is("read_at", null);

      if (!msgErr && msgData) {
        setUnreadMsgCount(msgData.length);
      }
    } catch {
      // Table may not exist yet — silently ignore
    }
  }

  async function saveOrderChanges(updates: {
    status: OrderStatus;
    amount_paid: number;
  }) {
    if (!selectedOrder || !supabase) return;

    setIsSaving(true);

    try {
      const nextAmountPaid = toNumber(updates.amount_paid);
      const nextBalance = Math.max(
        selectedOrder.total_amount - nextAmountPaid,
        0,
      );

      const { error: updateErr } = await supabase
        .from("orders")
        .update({
          status: updates.status,
          amount_paid: nextAmountPaid,
          balance_amount: nextBalance,
        })
        .eq("id", selectedOrder.id);

      if (updateErr) throw updateErr;

      setOrders((current) =>
        current.map((order) =>
          order.id === selectedOrder.id
            ? {
                ...order,
                status: updates.status,
                amount_paid: nextAmountPaid,
                balance_amount: nextBalance,
              }
            : order,
        ),
      );

      setSelectedOrder((current) =>
        current
          ? {
              ...current,
              status: updates.status,
              amount_paid: nextAmountPaid,
              balance_amount: nextBalance,
            }
          : null,
      );
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to save order";
      throw new Error(message);
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    if (!supabaseConfigured) return;

    if (!authLoading && !user) {
      router.push("/signin?redirect=%2Fadmin");
      return;
    }

    if (!authLoading && user) {
      void load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user?.id, supabaseConfigured]);

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    if (filterStatus !== "all") {
      filtered = filtered.filter((order) => order.status === filterStatus);
    }

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter(
        (order) =>
          textIncludes(order.profiles?.email, q) ||
          textIncludes(order.profiles?.display_name, q) ||
          textIncludes(order.products?.title, q) ||
          order.id.toLowerCase().includes(q),
      );
    }

    if (sortBy === "amount") {
      filtered.sort((a, b) => b.total_amount - a.total_amount);
    } else {
      filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    }

    return filtered;
  }, [orders, filterStatus, searchQuery, sortBy]);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.total_amount,
      0,
    );
    const totalPaid = orders.reduce((sum, order) => sum + order.amount_paid, 0);
    const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalOrders,
      totalRevenue,
      totalPaid,
      avgOrder,
    };
  }, [orders]);

  if (authLoading) {
    return (
      <div className="rounded-[2rem] border border-[#8C9FAE]/30 bg-white p-8 text-sm text-[#8C9FAE]">
        Loading…
      </div>
    );
  }

  if (!supabaseConfigured) {
    return (
      <div className="rounded-[2rem] border border-[#8C9FAE]/30 bg-white p-8 text-sm text-[#8C9FAE]">
        Supabase is not configured. Add <b>NEXT_PUBLIC_SUPABASE_URL</b> and{" "}
        <b>NEXT_PUBLIC_SUPABASE_ANON_KEY</b> to <b>.env.local</b>.
      </div>
    );
  }

  if (error === "You do not have admin access.") {
    return (
      <div className="rounded-[2rem] border border-red-200 bg-red-50 p-8">
        <div className="text-lg font-extrabold text-red-700">Access Denied</div>
        <div className="mt-2 text-sm text-red-600">{error}</div>
        <Button className="mt-4" onClick={() => router.push("/")}>
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#1F2661] text-white shadow-soft">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#1F2661]">
                Admin Panel
              </h1>
              <p className="text-sm text-[#8C9FAE]">
                Manage pre-orders and customer data
              </p>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={async () => {
            await signOut();
            router.push("/signin");
          }}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          icon={<ShoppingCart className="h-5 w-5" />}
          label="Total Orders"
          value={String(stats.totalOrders)}
          color="blue"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Total Revenue"
          value={formatBzd(stats.totalRevenue)}
          color="emerald"
        />
        <StatCard
          icon={<CheckCircle className="h-5 w-5" />}
          label="Amount Paid"
          value={formatBzd(stats.totalPaid)}
          color="green"
        />
        <StatCard
          icon={<Package className="h-5 w-5" />}
          label="Avg Order"
          value={formatBzd(stats.avgOrder)}
          color="purple"
        />
        <StatCard
          icon={<Mail className="h-5 w-5" />}
          label="Unread Messages"
          value={String(unreadMsgCount)}
          color={unreadMsgCount > 0 ? "amber" : "blue"}
        />
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 rounded-2xl bg-[#f0f6ff] p-1.5">
        {(
          [
            {
              key: "orders",
              label: "Orders",
              icon: <ShoppingCart className="h-4 w-4" />,
            },
            {
              key: "messages",
              label: "Messages",
              icon: <Mail className="h-4 w-4" />,
              badge: unreadMsgCount > 0 ? unreadMsgCount : undefined,
            },
            {
              key: "customers",
              label: "Customers",
              icon: <Users className="h-4 w-4" />,
            },
          ] as {
            key: AdminTab;
            label: string;
            icon: ReactNode;
            badge?: number;
          }[]
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? "bg-white text-[#1F2661] shadow-sm"
                : "text-[#8C9FAE] hover:text-[#1F2661]"
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.badge != null && (
              <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#ff4676] px-1.5 text-[10px] font-bold text-white">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "messages" && supabase && (
        <AdminMessages supabase={supabase} />
      )}

      {activeTab === "customers" && supabase && (
        <AdminCustomers supabase={supabase} />
      )}

      {activeTab === "orders" && (
        <div className="rounded-[2rem] border border-[#8C9FAE]/30 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#1F2661]">
                All Pre-Orders
              </h2>
              <p className="text-sm text-[#8C9FAE]">
                {filteredOrders.length} orders found
              </p>
            </div>
          </div>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8C9FAE]" />
              <Input
                placeholder="Search by email, name, product, or order ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value as "all" | OrderStatus)
                }
                className="rounded-2xl border border-[#8C9FAE]/30 bg-white px-4 py-2.5 text-sm font-medium text-[#1F2661] shadow-sm outline-none focus:border-[#1F2661] focus:ring-4 focus:ring-[#1F2661]/10"
              >
                <option value="all">All Status</option>
                <option value="preorder">Preorder</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "recent" | "amount")
                }
                className="rounded-2xl border border-[#8C9FAE]/30 bg-white px-4 py-2.5 text-sm font-medium text-[#1F2661] shadow-sm outline-none focus:border-[#1F2661] focus:ring-4 focus:ring-[#1F2661]/10"
              >
                <option value="recent">Recent</option>
                <option value="amount">Highest Amount</option>
              </select>
            </div>
          </div>

          {error && error !== "You do not have admin access." ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="py-8 text-center text-sm text-[#8C9FAE]">
              Loading orders…
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-8 text-center text-sm text-[#8C9FAE]">
              {searchQuery || filterStatus !== "all"
                ? "No orders match your filters."
                : "No orders yet."}
            </div>
          ) : (
            <div className="space-y-3 overflow-x-auto">
              {filteredOrders.map((order, idx) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <OrderRow
                    order={order}
                    onEdit={(nextOrder) => {
                      setSelectedOrder(nextOrder);
                      setShowEditModal(true);
                    }}
                    onDetails={(nextOrder) => {
                      setSelectedOrder(nextOrder);
                      setShowDetailsModal(true);
                    }}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      <OrderDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />

      <OrderEditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onSave={saveOrderChanges}
        isSaving={isSaving}
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  color: "blue" | "emerald" | "green" | "purple" | "amber";
}) {
  const colorMap: Record<string, string> = {
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    green: "border-green-200 bg-green-50 text-green-700",
    purple: "border-purple-200 bg-purple-50 text-purple-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
  };

  const iconColorMap: Record<string, string> = {
    blue: "text-blue-600",
    emerald: "text-emerald-600",
    green: "text-green-600",
    purple: "text-purple-600",
    amber: "text-amber-600",
  };

  return (
    <div className={`rounded-[2rem] border p-4 ${colorMap[color]}`}>
      <div className="flex items-center gap-2">
        <div className={iconColorMap[color]}>{icon}</div>
        <div className="text-xs font-bold uppercase tracking-wide opacity-75">
          {label}
        </div>
      </div>
      <div className="mt-2 text-2xl font-black">{value}</div>
    </div>
  );
}

function OrderRow({
  order,
  onEdit,
  onDetails,
}: {
  order: OrderRow;
  onEdit: (order: OrderRow) => void;
  onDetails: (order: OrderRow) => void;
}) {
  const paid = order.amount_paid;
  const deposit = order.deposit_amount;
  const total = order.total_amount;
  const due = paid < deposit ? deposit - paid : paid < total ? total - paid : 0;
  const dueLabel =
    paid < deposit ? "Deposit due" : paid < total ? "Remaining due" : "Paid";

  const statusColors: Record<OrderStatus, string> = {
    preorder: "border-amber-200 bg-amber-50 text-amber-700",
    paid: "border-green-200 bg-green-50 text-green-700",
    cancelled: "border-red-200 bg-red-50 text-red-700",
  };

  const statusIcons: Record<OrderStatus, ReactNode> = {
    preorder: <Clock className="h-3 w-3" />,
    paid: <CheckCircle className="h-3 w-3" />,
    cancelled: <AlertCircle className="h-3 w-3" />,
  };

  return (
    <div className="flex flex-col gap-4 rounded-[2rem] border border-[#8C9FAE]/30 bg-[#D9EBDD]/20 p-4 sm:flex-row sm:items-center">
      <div className="relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-xl border border-[#8C9FAE]/30 bg-white sm:w-24">
        {order.products?.image ? (
          <img
            src={order.products.image}
            alt={order.products.title}
            className="h-full w-full object-contain p-2"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-xs text-zinc-400">
            No image
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="line-clamp-1 text-sm font-extrabold text-[#1F2661]">
              {order.products?.title ?? `Item #${order.product_id}`}
            </div>
            <div className="mt-1 text-xs text-[#8C9FAE]">
              Order #{order.id.slice(0, 8)} •{" "}
              {new Date(order.created_at).toLocaleDateString()}
            </div>
            {order.profiles && (
              <div className="mt-1 text-xs text-[#8C9FAE]">
                <span className="font-medium text-[#1F2661]">
                  {order.profiles.display_name || "Unknown"}
                </span>{" "}
                ({order.profiles.email})
                {order.profiles.phone_number && (
                  <>
                    {" · "}
                    <a
                      href={`https://wa.me/${order.profiles.phone_number.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[#1F2661] hover:text-[#7FF46A] transition-colors"
                    >
                      📱 {order.profiles.phone_number}
                    </a>
                  </>
                )}
              </div>
            )}
          </div>

          <Badge
            className={`flex items-center gap-1 border ${statusColors[order.status]}`}
          >
            {statusIcons[order.status]}
            <span className="capitalize">{order.status}</span>
          </Badge>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3">
          <DetailItem label="Total" value={formatBzd(total)} />
          <DetailItem label="Paid" value={formatBzd(paid)} />
          <DetailItem
            label={dueLabel}
            value={due > 0 ? formatBzd(due) : "—"}
            highlight={due > 0}
          />
        </div>
      </div>

      <div className="flex gap-2 sm:flex-col">
        <Button size="sm" variant="ghost" onClick={() => onEdit(order)}>
          Edit
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onDetails(order)}>
          Details
        </Button>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg ${highlight ? "border border-amber-200 bg-amber-50 p-2" : "p-2"}`}
    >
      <div className="text-xs font-bold uppercase tracking-wider text-[#8C9FAE]">
        {label}
      </div>
      <div
        className={`mt-1 font-extrabold ${highlight ? "text-amber-700" : "text-[#1F2661]"}`}
      >
        {value}
      </div>
    </div>
  );
}
