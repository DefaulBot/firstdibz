"use client";

import { HeroBar } from "@/components/ui/HeroBar";
import { PageSection } from "@/components/ui/PageSection";
import { InfoCard } from "@/components/ui/InfoCard";
import { COMPANY } from "@/lib/company";
import { useCopyToClipboard } from "@/lib/useCopyToClipboard";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const banks = [
  { name: "Belize Bank", account: "100-123456-789", icon: "🏦" },
  { name: "Atlantic Bank", account: "210-987654-321", icon: "🏦" },
  { name: "National Bank of Belize", account: "300-555666-777", icon: "🏦" },
];

const wallets = [
  { name: "Digiwallet", detail: COMPANY.digiwalletId, icon: "📱" },
  { name: "E-Kyash", detail: COMPANY.eykashEmail, icon: "📱" },
];

const paymentMethods = [
  {
    title: "🏦 Bank Transfer",
    badge: "Available Now",
    badgeVariant: "green" as const,
    description:
      "Pay directly from your bank account using an electronic fund transfer or a deposit at any branch.",
  },
  {
    title: "💳 Credit / Debit Card",
    badge: "Coming Soon",
    badgeVariant: "default" as const,
    description:
      "We're working on adding credit and debit card payment through a secure gateway. Stay tuned!",
  },
  {
    title: "🛍️ Cash on Pickup",
    badge: "Available",
    badgeVariant: "green" as const,
    description:
      "If you selected free pickup in Belize City, you can pay the remaining 50% balance in cash when you collect your order.",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function PaymentMethodsClient() {
  const { copy, copied } = useCopyToClipboard();

  return (
    <div className="mx-auto max-w-4xl mt-40 md:mt-44">
      <HeroBar
        title="Payment Methods"
        description="Multiple convenient ways to pay"
        accent="💰 Secure & Easy 💰"
      />

      {/* Overview cards */}
      <PageSection
        title="How to Pay"
        description="Choose the method that works best for you."
      />

      <div className="grid gap-4 md:grid-cols-3 mb-10">
        {paymentMethods.map((m) => (
          <InfoCard
            key={m.title}
            title={m.title}
            badge={m.badge}
            badgeVariant={m.badgeVariant}
          >
            <p className="text-sm text-[#5a6879]">{m.description}</p>
          </InfoCard>
        ))}
      </div>

      {/* Bank transfer details */}
      <PageSection
        title="🏦 Bank Transfer Details"
        description="Transfer your 50% deposit (or full payment) to any of the following accounts. Then send your receipt screenshot via WhatsApp."
      />

      <div className="space-y-3 mb-10">
        {banks.map((b) => (
          <div
            key={b.account}
            className="flex items-center justify-between rounded-2xl border border-[#eef2f5] bg-white px-5 py-4 transition hover:border-[#7FF46A] hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{b.icon}</span>
              <div>
                <p className="font-bold text-[#1F2661]">{b.name}</p>
                <p className="font-mono text-sm text-[#5a6879]">{b.account}</p>
              </div>
            </div>
            <button
              onClick={() => copy(b.account)}
              className="rounded-full bg-[#1F2661] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#7FF46A] hover:text-[#1F2661]"
            >
              {copied ? "✅ Copied!" : "📋 Copy"}
            </button>
          </div>
        ))}
      </div>

      {/* Digital wallets */}
      <PageSection
        title="📱 Digital Wallets"
        description="Send payment instantly using these mobile-money services."
      />

      <div className="space-y-3 mb-10">
        {wallets.map((w) => (
          <div
            key={w.detail}
            className="flex items-center justify-between rounded-2xl border border-[#eef2f5] bg-white px-5 py-4 transition hover:border-[#7FF46A] hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{w.icon}</span>
              <div>
                <p className="font-bold text-[#1F2661]">{w.name}</p>
                <p className="font-mono text-sm text-[#5a6879]">{w.detail}</p>
              </div>
            </div>
            <button
              onClick={() => copy(w.detail)}
              className="rounded-full bg-[#1F2661] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#7FF46A] hover:text-[#1F2661]"
            >
              {copied ? "✅ Copied!" : "📋 Copy"}
            </button>
          </div>
        ))}
      </div>

      {/* How-to instruction box */}
      <div className="rounded-2xl bg-[#f0f6ff] border border-[#eef2f5] p-6 mb-10">
        <h3 className="text-lg font-bold text-[#1F2661] mb-3">
          📸 How to Complete Your Payment
        </h3>
        <ol className="list-decimal ml-5 space-y-2 text-sm text-[#5a6879]">
          <li>
            <span className="font-semibold text-[#1F2661]">
              Make the transfer
            </span>{" "}
            — Use bank transfer, Digiwallet, or E-Kyash to send your 50%
            deposit.
          </li>
          <li>
            <span className="font-semibold text-[#1F2661]">
              Screenshot the receipt
            </span>{" "}
            — Take a clear screenshot or photo of your payment confirmation.
          </li>
          <li>
            <span className="font-semibold text-[#1F2661]">
              Send via WhatsApp
            </span>{" "}
            — Forward the receipt to our WhatsApp at{" "}
            <span className="font-mono text-[#7FF46A]">{COMPANY.phone}</span>{" "}
            with your name and order number.
          </li>
          <li>
            <span className="font-semibold text-[#1F2661]">Confirmation</span> —
            We will confirm your payment and update your order status within a
            few hours.
          </li>
        </ol>
      </div>

      {/* WhatsApp CTA */}
      <div className="rounded-3xl bg-[#f0f6ff] border border-[#eef2f5] p-8 text-center mb-8">
        <h3 className="text-lg font-bold text-[#1F2661] mb-2">
          💬 Ready to send your receipt?
        </h3>
        <p className="text-sm text-[#5a6879] mb-4">
          Tap below to open WhatsApp and send your payment screenshot directly
          to us.
        </p>
        <a
          href={COMPANY.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#128C7E]"
        >
          💬 WhatsApp Us Now
        </a>
        <p className="text-xs text-[#8a9bb0] mt-3">
          {COMPANY.phone} | {COMPANY.email}
        </p>
      </div>
    </div>
  );
}
