"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { formatBzd } from "@/lib/utils";
import type { OrderRow, OrderStatus } from "@/lib/types";

function PaymentInfoItem({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-3">
      <div className="text-xs font-bold uppercase tracking-wide text-zinc-600">
        {label}
      </div>
      <div
        className={`mt-2 text-lg font-bold ${
          highlight ? "text-red-600" : "text-zinc-900"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

export function OrderDetailsModal({
  isOpen,
  onClose,
  order,
}: {
  isOpen: boolean;
  onClose: () => void;
  order: OrderRow | null;
}) {
  if (!order) return null;

  const paid = Number(order.amount_paid);
  const deposit = Number(order.deposit_amount);
  const total = Number(order.total_amount);
  const due = paid < deposit ? deposit - paid : paid < total ? total - paid : 0;
  const dueLabel =
    paid < deposit ? "Deposit due" : paid < total ? "Remaining due" : "Paid";

  const statusColors = {
    preorder: "border-amber-200 bg-amber-50 text-amber-700",
    paid: "border-green-200 bg-green-50 text-green-700",
    cancelled: "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal Container - Fixed centering with flex */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-h-[90vh] max-w-2xl overflow-y-auto px-4 pointer-events-auto sm:px-0"
            >
              <div className="w-full rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-xl sm:p-8">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-zinc-900">
                      Order Details
                    </h2>
                    <p className="mt-1 text-sm text-zinc-600">
                      Order #{order.id.slice(0, 8)}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-2 hover:bg-zinc-100"
                    aria-label="Close modal"
                  >
                    <X className="h-5 w-5 text-zinc-600" />
                  </button>
                </div>

                {/* Customer Info */}
                <div className="mb-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-600">
                    Customer
                  </h3>
                  <div className="mt-2 text-sm text-zinc-900">
                    <div className="font-semibold">
                      {order.profiles?.display_name || "Unknown"}
                    </div>
                    <div className="text-zinc-600">{order.profiles?.email}</div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="mb-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-600">
                    Product
                  </h3>
                  <div className="mt-3">
                    <div className="text-sm font-semibold text-zinc-900">
                      {order.products?.title}
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-zinc-600">Price</div>
                        <div className="mt-1 font-bold text-zinc-900">
                          {formatBzd(Number(order.products?.price))}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-zinc-600">Quantity</div>
                        <div className="mt-1 font-bold text-zinc-900">
                          {order.quantity}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="mb-6 space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-600">
                    Payment
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <PaymentInfoItem label="Total" value={formatBzd(total)} />
                    <PaymentInfoItem
                      label="Deposit"
                      value={formatBzd(deposit)}
                    />
                    <PaymentInfoItem label="Paid" value={formatBzd(paid)} />
                    <PaymentInfoItem
                      label={dueLabel}
                      value={due > 0 ? formatBzd(due) : "—"}
                      highlight={due > 0}
                    />
                  </div>
                </div>

                {/* Status & Points */}
                <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-zinc-200 bg-white p-3">
                    <div className="text-xs font-bold uppercase tracking-wide text-zinc-600">
                      Status
                    </div>
                    <div className="mt-2">
                      <Badge className={`border ${statusColors[order.status]}`}>
                        <span className="capitalize">{order.status}</span>
                      </Badge>
                    </div>
                  </div>
                  <div className="rounded-lg border border-zinc-200 bg-white p-3">
                    <div className="text-xs font-bold uppercase tracking-wide text-zinc-600">
                      Points Earned
                    </div>
                    <div className="mt-2 text-xl font-black text-zinc-900">
                      {order.points_earned}
                    </div>
                  </div>
                  <div className="rounded-lg border border-zinc-200 bg-white p-3">
                    <div className="text-xs font-bold uppercase tracking-wide text-zinc-600">
                      Order Date
                    </div>
                    <div className="mt-2 text-sm font-semibold text-zinc-900">
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <div className="flex gap-2">
                  <Button variant="ghost" className="flex-1" onClick={onClose}>
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export function OrderEditModal({
  isOpen,
  onClose,
  order,
  onSave,
  isSaving,
}: {
  isOpen: boolean;
  onClose: () => void;
  order: OrderRow | null;
  onSave: (updates: {
    status: OrderStatus;
    amount_paid: number;
  }) => Promise<void>;
  isSaving: boolean;
}) {
  const [status, setStatus] = useState<OrderStatus>(
    order?.status || "preorder",
  );
  const [amountPaid, setAmountPaid] = useState<number>(order?.amount_paid || 0);
  const [error, setError] = useState<string | null>(null);

  if (!order) return null;

  const total = Number(order.total_amount);
  const deposit = Number(order.deposit_amount);

  async function handleSave() {
    setError(null);
    try {
      if (amountPaid < 0) {
        setError("Amount paid cannot be negative");
        return;
      }
      if (amountPaid > total) {
        setError(`Amount paid cannot exceed total (${formatBzd(total)})`);
        return;
      }
      await onSave({ status, amount_paid: amountPaid });
      onClose();
    } catch (e: any) {
      setError(e?.message || "Failed to save");
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal Container - Fixed centering with flex */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-h-[90vh] max-w-2xl overflow-y-auto px-4 pointer-events-auto sm:px-0"
            >
              <div className="w-full rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-xl sm:p-8">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-zinc-900">
                      Edit Order
                    </h2>
                    <p className="mt-1 text-sm text-zinc-600">
                      Order #{order.id.slice(0, 8)}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-2 hover:bg-zinc-100"
                    aria-label="Close modal"
                  >
                    <X className="h-5 w-5 text-zinc-600" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="mb-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="text-sm font-semibold text-zinc-900">
                    {order.products?.title}
                  </div>
                  <div className="mt-2 text-sm text-zinc-600">
                    Total:{" "}
                    <span className="font-bold text-zinc-900">
                      {formatBzd(total)}
                    </span>
                    <span className="mx-2 text-zinc-400">•</span>
                    Deposit:{" "}
                    <span className="font-bold text-zinc-900">
                      {formatBzd(deposit)}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-zinc-900">
                    Order Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as OrderStatus)}
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 outline-none focus:border-[#0f2f63] focus:ring-4 focus:ring-[#0f2f63]/10"
                  >
                    <option value="preorder">Preorder</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Amount Paid */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-zinc-900">
                    Amount Paid
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max={total}
                    step="0.01"
                    value={amountPaid}
                    onChange={(e) =>
                      setAmountPaid(parseFloat(e.target.value) || 0)
                    }
                    className="mt-2"
                  />
                  <div className="mt-2 text-xs text-zinc-600">
                    Remaining:{" "}
                    <span className="font-bold">
                      {formatBzd(total - amountPaid)}
                    </span>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    className="flex-1"
                    onClick={onClose}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving…" : "Save Changes"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
