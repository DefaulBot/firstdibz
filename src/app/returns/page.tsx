import type { Metadata } from "next";
import { HeroBar } from "@/components/ui/HeroBar";
import { PageSection } from "@/components/ui/PageSection";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Returns & Cancellations | Firs' Dibs BZ",
  description:
    "Clear, fair cancellation and refund policies for your peace of mind.",
};

const policies = [
  {
    title: "Cancel within 24 hours of deposit",
    subtitle: "Full Refund",
    subtitleColor: "text-[#7FF46A]",
    refund: "✅ Full refund of your 50% deposit",
    refundColor: "text-[#7FF46A]",
    body: "Changed your mind? No problem. If you cancel your order within 24 hours of making your 50% deposit, you'll receive a full refund. No questions asked. Refunds are processed within 3–5 business days to your original payment method.",
  },
  {
    title: "Cancel after 24 hours but before item ships",
    subtitle: "Partial Refund",
    subtitleColor: "text-[#7FF46A]",
    refund: "💰 Refund minus 10% processing fee",
    refundColor: "text-[#ff4676]",
    body: "If you cancel after the first 24 hours but before your item has been shipped, you'll receive a refund minus a 10% processing fee. The remaining 90% of your deposit will be refunded to you.",
  },
  {
    title: "Cancel after item has shipped",
    subtitle: "No Refund on Deposit",
    subtitleColor: "text-[#ff4676]",
    refund: "❌ No refund on your 50% deposit",
    refundColor: "text-[#ff4676]",
    body: "Once your item has been shipped from our facility, the cancellation window closes.",
  },
];

const summaryRows = [
  {
    scenario: "Cancel within 24 hours of deposit",
    result: "Full refund (100% of deposit)",
    good: true,
  },
  {
    scenario: "Cancel after 24 hours, before shipping",
    result: "Refund minus 10% processing fee",
    good: false,
  },
  {
    scenario: "Cancel after item has shipped",
    result: "No refund on deposit",
    good: false,
  },
];

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-4xl mt-40 md:mt-44">
      <HeroBar
        title="Returns & Cancellations"
        description="Clear, fair policies for your peace of mind"
        accent="✨ Contact us for any cancellation request ✨"
      />

      <PageSection
        title="📋 Our Cancellation & Refund Policy"
        description="We believe in transparency. Here's exactly how cancellations and refunds work at Firs' Dibs BZ."
      />

      {/* Policy cards */}
      <div className="space-y-4 mb-8">
        {policies.map((p) => (
          <div
            key={p.title}
            className="rounded-2xl border border-[#eef2f5] bg-white overflow-hidden transition hover:border-[#7FF46A] hover:shadow-sm"
          >
            <div className="flex items-center gap-3 bg-[#fafcff] border-b border-[#eef2f5] px-5 py-4">
              <div>
                <h3 className="font-bold text-[#1F2661]">{p.title}</h3>
                <span className={`text-xs font-semibold ${p.subtitleColor}`}>
                  {p.subtitle}
                </span>
              </div>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-[#5a6879] mb-2">{p.body}</p>
              <p className={`font-bold text-base ${p.refundColor}`}>
                {p.refund}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* After shipped options */}
      <div className="rounded-2xl bg-[#fef5e8] border-l-4 border-[#ff4676] p-5 mb-8">
        <h3 className="font-bold text-[#1F2661] mb-2">
          What happens after an item has shipped?
        </h3>
        <p className="text-sm text-[#5a6879] mb-3">
          Once your order is on its way, you have two choices:
        </p>
        <ul className="space-y-2 ml-5 list-disc text-sm text-[#5a6879]">
          <li>
            <span className="font-semibold text-[#1F2661]">
              ✅ Proceed with the order
            </span>{" "}
            — Pay the remaining 50% balance and receive your item as planned.
            You'll still earn loyalty points on your balance payment!
          </li>
          <li>
            <span className="font-semibold text-[#ff4676]">
              ❌ Forfeit the order
            </span>{" "}
            — If you choose not to complete the purchase, you will forfeit your
            50% deposit with no refund. The item will not be delivered to you.
          </li>
        </ul>
        <p className="text-sm text-[#5a6879] mt-3">
          <span className="font-semibold text-[#7FF46A]">💡 Tip:</span> If
          you're unsure, we recommend proceeding with the order — you've already
          paid half, and you'll receive the product you wanted plus loyalty
          points!
        </p>
      </div>

      {/* Important notes */}
      <div className="rounded-2xl bg-[#f0f6ff] border-l-4 border-[#7FF46A] p-5 mb-8">
        <p className="font-semibold text-[#7FF46A] text-sm mb-2">
          📌 Important Notes:
        </p>
        <ul className="list-disc ml-5 text-sm text-[#5a6879] space-y-1">
          <li>
            All refunds are processed within 3–5 business days after
            cancellation approval.
          </li>
          <li>
            Refunds are issued to the original payment method used for the
            deposit.
          </li>
          <li>
            If you paid via bank transfer, please provide your bank account
            details for the refund.
          </li>
          <li>
            Processing fee (10%) applies only to cancellations made after 24
            hours but before shipping.
          </li>
          <li>
            Once an item is shipped, the deposit is non-refundable under any
            circumstances.
          </li>
        </ul>
      </div>

      {/* Quick reference table */}
      <div className="rounded-2xl border border-[#eef2f5] overflow-hidden mb-8">
        <div className="bg-[#1F2661] px-5 py-3">
          <h4 className="text-white font-bold text-sm">
            Quick Reference Summary
          </h4>
        </div>
        <div className="divide-y divide-[#eef2f5]">
          {summaryRows.map((row) => (
            <div
              key={row.scenario}
              className="flex justify-between items-center px-5 py-3 text-sm"
            >
              <span className="font-semibold text-[#1F2661]">
                {row.scenario}
              </span>
              <span
                className={`font-semibold ${row.good ? "text-[#7FF46A]" : "text-[#ff4676]"}`}
              >
                {row.result}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-3xl bg-[#f0f6ff] border border-[#eef2f5] p-8 text-center mb-8">
        <h3 className="text-lg font-bold text-[#1F2661] mb-2">
          📞 Need to cancel or modify your order?
        </h3>
        <p className="text-sm text-[#5a6879] mb-4">
          Just contact our customer service team and we'll process your request
          as quickly as possible.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={`mailto:${COMPANY.email}`}
            className="rounded-full bg-[#1F2661] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ff4676]"
          >
            📧 Email Us
          </a>
          <a
            href={COMPANY.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#128C7E]"
          >
            💬 WhatsApp Us
          </a>
        </div>
        <p className="text-xs text-[#8a9bb0] mt-3">
          Response within 24 hours | {COMPANY.phone} | {COMPANY.email}
        </p>
      </div>
    </div>
  );
}
