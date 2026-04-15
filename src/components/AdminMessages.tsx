"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MailOpen,
  Search,
  ChevronDown,
  ChevronUp,
  Clock,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { SupabaseClient } from "@supabase/supabase-js";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type ContactMessage = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  message: string;
  read_at: string | null;
  created_at: string;
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AdminMessages({ supabase }: { supabase: SupabaseClient }) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  async function loadMessages() {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (err) throw err;
      setMessages((data as ContactMessage[]) ?? []);
    } catch (e: any) {
      setError(e.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id: string) {
    const { error: err } = await supabase
      .from("contact_messages")
      .update({ read_at: new Date().toISOString() })
      .eq("id", id);

    if (!err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, read_at: new Date().toISOString() } : m,
        ),
      );
    }
  }

  async function markAsUnread(id: string) {
    const { error: err } = await supabase
      .from("contact_messages")
      .update({ read_at: null })
      .eq("id", id);

    if (!err) {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read_at: null } : m)),
      );
    }
  }

  async function deleteMessage(id: string) {
    const { error: err } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (!err) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (expanded === id) setExpanded(null);
    }
  }

  useEffect(() => {
    void loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    let list = [...messages];

    if (filter === "unread") list = list.filter((m) => !m.read_at);
    if (filter === "read") list = list.filter((m) => m.read_at);

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (m) =>
          m.first_name.toLowerCase().includes(q) ||
          m.last_name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q),
      );
    }

    return list;
  }, [messages, filter, search]);

  const unreadCount = messages.filter((m) => !m.read_at).length;

  return (
    <div className="rounded-[2rem] border border-[#8C9FAE]/30 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-[#1F2661]">
            Contact Messages
          </h2>
          <p className="text-sm text-[#8C9FAE]">
            {filtered.length} messages{" "}
            {unreadCount > 0 && (
              <span className="font-semibold text-[#ff4676]">
                · {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        <Button variant="ghost" onClick={() => void loadMessages()}>
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8C9FAE]" />
          <Input
            placeholder="Search by name, email, or message…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11"
          />
        </div>
        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as "all" | "unread" | "read")
          }
          className="rounded-2xl border border-[#8C9FAE]/30 bg-white px-4 py-2.5 text-sm font-medium text-[#1F2661] shadow-sm outline-none focus:border-[#1F2661] focus:ring-4 focus:ring-[#1F2661]/10"
        >
          <option value="all">All Messages</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
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
          Loading messages…
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-8 text-center text-sm text-[#8C9FAE]">
          {search || filter !== "all"
            ? "No messages match your filters."
            : "No contact messages yet."}
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {filtered.map((msg, idx) => {
              const isOpen = expanded === msg.id;
              const isUnread = !msg.read_at;

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`rounded-2xl border transition-all ${
                    isUnread
                      ? "border-[#7FF46A]/60 bg-[#7FF46A]/5"
                      : "border-[#8C9FAE]/30 bg-white"
                  }`}
                >
                  {/* Row header */}
                  <button
                    onClick={() => {
                      setExpanded(isOpen ? null : msg.id);
                      if (!isOpen && isUnread) void markAsRead(msg.id);
                    }}
                    className="flex w-full items-center gap-3 px-5 py-4 text-left"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        isUnread
                          ? "bg-[#7FF46A]/20 text-[#1F2661]"
                          : "bg-[#8C9FAE]/10 text-[#8C9FAE]"
                      }`}
                    >
                      {isUnread ? (
                        <Mail className="h-4 w-4" />
                      ) : (
                        <MailOpen className="h-4 w-4" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-bold ${isUnread ? "text-[#1F2661]" : "text-[#5a6879]"}`}
                        >
                          {msg.first_name} {msg.last_name}
                        </span>
                        {isUnread && (
                          <Badge className="border-[#7FF46A]/40 bg-[#e8f8e5] text-[#1F2661] text-[10px] px-1.5 py-0">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="truncate text-xs text-[#8C9FAE]">
                        {msg.email}
                        {msg.phone ? ` · ${msg.phone}` : ""}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-[#5a6879]">
                        {msg.message}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 text-xs text-[#8C9FAE]">
                      <Clock className="h-3 w-3" />
                      {new Date(msg.created_at).toLocaleDateString()}
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-[#8C9FAE]/20 px-5 py-4"
                    >
                      <div className="grid gap-3 sm:grid-cols-2 mb-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C9FAE]">
                            Name
                          </p>
                          <p className="text-sm font-semibold text-[#1F2661]">
                            {msg.first_name} {msg.last_name}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C9FAE]">
                            Email
                          </p>
                          <a
                            href={`mailto:${msg.email}`}
                            className="text-sm text-[#1F2661] underline hover:text-[#7FF46A]"
                          >
                            {msg.email}
                          </a>
                        </div>
                        {msg.phone && (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C9FAE]">
                              Phone
                            </p>
                            <p className="text-sm text-[#1F2661]">
                              {msg.phone}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C9FAE]">
                            Received
                          </p>
                          <p className="text-sm text-[#1F2661]">
                            {new Date(msg.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C9FAE] mb-1">
                          Message
                        </p>
                        <div className="rounded-xl bg-[#fafcff] border border-[#eef2f5] p-4 text-sm text-[#1F2661] whitespace-pre-wrap leading-relaxed">
                          {msg.message}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={`mailto:${msg.email}?subject=Re: Your message to Firs' Dibs BZ`}
                          className="rounded-full bg-[#1F2661] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#7FF46A] hover:text-[#1F2661]"
                        >
                          📧 Reply via Email
                        </a>
                        {msg.phone && (
                          <a
                            href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#128C7E]"
                          >
                            💬 WhatsApp
                          </a>
                        )}
                        <button
                          onClick={() =>
                            msg.read_at
                              ? void markAsUnread(msg.id)
                              : void markAsRead(msg.id)
                          }
                          className="rounded-full border border-[#8C9FAE]/30 px-4 py-2 text-xs font-semibold text-[#5a6879] transition hover:bg-[#eef2f5]"
                        >
                          {msg.read_at ? "Mark Unread" : "Mark Read"}
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete this message permanently?")) {
                              void deleteMessage(msg.id);
                            }
                          }}
                          className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          <X className="mr-1 inline h-3 w-3" />
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
