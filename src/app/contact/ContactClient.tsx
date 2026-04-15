"use client";

import { useState, type FormEvent } from "react";
import { HeroBar } from "@/components/ui/HeroBar";
import { COMPANY } from "@/lib/company";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

const empty: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ContactClient() {
  const [form, setForm] = useState<FormState>(empty);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("success");
      setForm(empty);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to send message.");
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-5xl mt-40 md:mt-44">
      <HeroBar
        title="Contact Us"
        description="We'd love to hear from you"
        accent="💬 Response within 24 hours"
      />

      <div className="grid gap-8 md:grid-cols-2 mt-6">
        {/* Left – Business info */}
        <div className="space-y-6">
          {/* Info card */}
          <div className="rounded-2xl border border-[#eef2f5] bg-white p-6">
            <h3 className="text-lg font-bold text-[#1F2661] mb-4">
              📍 Get In Touch
            </h3>
            <ul className="space-y-3 text-sm text-[#5a6879]">
              <li className="flex items-start gap-2">
                <span className="text-base">📱</span>
                <div>
                  <p className="font-semibold text-[#1F2661]">
                    Phone / WhatsApp
                  </p>
                  <p>{COMPANY.phone}</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-base">📧</span>
                <div>
                  <p className="font-semibold text-[#1F2661]">Email</p>
                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="underline hover:text-[#7FF46A]"
                  >
                    {COMPANY.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-base">📸</span>
                <div>
                  <p className="font-semibold text-[#1F2661]">Instagram</p>
                  <a
                    href={COMPANY.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-[#7FF46A]"
                  >
                    {COMPANY.instagramHandle}
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Hours card */}
          <div className="rounded-2xl border border-[#eef2f5] bg-white p-6">
            <h3 className="text-lg font-bold text-[#1F2661] mb-4">
              🕐 Business Hours
            </h3>
            <ul className="space-y-1 text-sm text-[#5a6879]">
              {COMPANY.hours.map((h) => (
                <li key={h.day} className="flex justify-between">
                  <span className="font-semibold text-[#1F2661]">{h.day}</span>
                  <span>{h.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap gap-3">
            <a
              href={COMPANY.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#128C7E]"
            >
              💬 WhatsApp
            </a>
            <a
              href={COMPANY.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#bc1888] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              📸 Instagram
            </a>
            <a
              href={`mailto:${COMPANY.email}`}
              className="rounded-full bg-[#1F2661] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ff4676]"
            >
              📧 Email
            </a>
          </div>

          {/* Map */}
          <div className="overflow-hidden rounded-2xl border border-[#eef2f5]">
            <iframe
              title="Firs' Dibs BZ Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60890.64484818982!2d-88.23285570000001!3d17.496889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f5a530b3f28b6d3%3A0x3a9aec73783e792b!2sBelize%20City%2C%20Belize!5e0!3m2!1sen!2sus!4v1695836583455!5m2!1sen!2sus"
              width="100%"
              height="220"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Right – Contact form */}
        <div className="rounded-2xl border border-[#eef2f5] bg-white p-6">
          <h3 className="text-lg font-bold text-[#1F2661] mb-1">
            📝 Send a Message
          </h3>
          <p className="text-sm text-[#5a6879] mb-5">
            Fill out the form below and we'll get back to you within 24 hours.
          </p>

          {status === "success" ? (
            <div className="rounded-xl bg-[#e8f8e5] p-6 text-center">
              <p className="text-3xl mb-2">✅</p>
              <p className="font-bold text-[#1F2661]">Message Sent!</p>
              <p className="text-sm text-[#5a6879] mt-1">
                Thanks for reaching out. We'll reply within 24 hours.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-4 rounded-full bg-[#1F2661] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#7FF46A] hover:text-[#1F2661]"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold text-[#1F2661]">
                    First Name <span className="text-[#ff4676]">*</span>
                  </span>
                  <input
                    required
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#eef2f5] bg-[#fafcff] px-4 py-2.5 text-sm text-[#1F2661] outline-none transition focus:border-[#7FF46A] focus:ring-2 focus:ring-[#7FF46A]/30"
                    placeholder="Jane"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-[#1F2661]">
                    Last Name <span className="text-[#ff4676]">*</span>
                  </span>
                  <input
                    required
                    value={form.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#eef2f5] bg-[#fafcff] px-4 py-2.5 text-sm text-[#1F2661] outline-none transition focus:border-[#7FF46A] focus:ring-2 focus:ring-[#7FF46A]/30"
                    placeholder="Doe"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-semibold text-[#1F2661]">
                  Email <span className="text-[#ff4676]">*</span>
                </span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#eef2f5] bg-[#fafcff] px-4 py-2.5 text-sm text-[#1F2661] outline-none transition focus:border-[#7FF46A] focus:ring-2 focus:ring-[#7FF46A]/30"
                  placeholder="jane@example.com"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-[#1F2661]">
                  Phone
                </span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#eef2f5] bg-[#fafcff] px-4 py-2.5 text-sm text-[#1F2661] outline-none transition focus:border-[#7FF46A] focus:ring-2 focus:ring-[#7FF46A]/30"
                  placeholder="+501 000-0000"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-[#1F2661]">
                  Message <span className="text-[#ff4676]">*</span>
                </span>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className="mt-1 w-full resize-none rounded-xl border border-[#eef2f5] bg-[#fafcff] px-4 py-2.5 text-sm text-[#1F2661] outline-none transition focus:border-[#7FF46A] focus:ring-2 focus:ring-[#7FF46A]/30"
                  placeholder="How can we help you?"
                />
              </label>

              {status === "error" && (
                <p className="rounded-lg bg-[#ffe8ec] px-4 py-2 text-sm text-[#ff4676]">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-full bg-[#1F2661] py-3 text-sm font-semibold text-white transition hover:bg-[#7FF46A] hover:text-[#1F2661] disabled:opacity-50"
              >
                {status === "loading" ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="h-8" />
    </div>
  );
}
