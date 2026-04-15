import type { Metadata } from "next";
import { HeroBar } from "@/components/ui/HeroBar";
import { PageSection } from "@/components/ui/PageSection";
import { InfoCard } from "@/components/ui/InfoCard";

export const metadata: Metadata = {
  title: "Shipping & Delivery | Firs' Dibs BZ",
  description:
    "Fast, reliable delivery across Belize — right to your doorstep.",
};

const shippingOptions = [
  {
    title: "Free Shipping",
    price: "🎁 BZ$0",
    desc: "Available for rewards redemptions starting at 500 points.",
    features: ["Nationwide delivery", "Priority handling", "Tracking included"],
  },
  {
    title: "Standard Shipping",
    price: "BZ$10 – BZ$25",
    desc: "Depending on your location and courier partner:",
    features: [
      "Belize Post Office",
      "BPMS",
      "Interdistrict Shipping",
      "EZ Delivery",
    ],
  },
  {
    title: "Free Pickup",
    price: "BZ$0",
    desc: "Available from our Belize City location.",
    features: [
      "No delivery fee",
      "Inspect your item before taking it",
      "Contact us to schedule pickup",
    ],
  },
  {
    title: "Runman Service",
    price: "BZ$7 – BZ$10",
    desc: "Available within Belize City limits only.",
    features: [
      "Fast same-day delivery",
      "Fee depends on your specific location",
      "Perfect for small to medium packages",
    ],
  },
];

const locations = [
  "Belize City",
  "Belmopan",
  "San Ignacio",
  "Santa Elena",
  "Orange Walk",
  "Corozal",
  "Dangriga",
  "Punta Gorda",
  "Benque Viejo",
  "San Pedro (Ambergris Caye)*",
  "Caye Caulker*",
];

const couriers = [
  "Belize Post Office",
  "BPMS",
  "Interdistrict Shipping",
  "EZ Delivery",
  "Runman (Belize City)",
];

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-5xl mt-40 md:mt-44">
      <HeroBar
        title="🚚 Shipping & Delivery"
        description="Fast, reliable delivery across Belize — right to your doorstep"
        accent="✨ Free shipping from 500 points ✨"
      />

      <PageSection
        title="📦 Choose your shipping method"
        description="We offer flexible delivery options to fit your needs and budget."
      />

      {/* Options grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {shippingOptions.map((opt) => (
          <InfoCard key={opt.title} title={opt.title}>
            <p className="font-bold text-[#ff4676] text-base mb-2">
              {opt.price}
            </p>
            <p className="mb-2">{opt.desc}</p>
            <ul className="list-disc ml-5 space-y-1">
              {opt.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </InfoCard>
        ))}
      </div>

      {/* Delivery locations */}
      <div className="rounded-3xl bg-[#fafcff] border border-[#eef2f5] p-6 mb-8">
        <h3 className="text-lg font-bold text-[#1F2661] mb-4">
          📍 We deliver to these locations
        </h3>
        <div className="flex flex-wrap gap-2">
          {locations.map((loc) => (
            <span
              key={loc}
              className="rounded-full border border-[#e2e8f0] bg-white px-4 py-1.5 text-sm font-medium text-[#1F2661] transition hover:bg-[#7FF46A] hover:border-[#7FF46A]"
            >
              {loc}
            </span>
          ))}
        </div>
        <div className="mt-4 rounded-2xl bg-[#f0f6ff] border-l-4 border-[#7FF46A] p-4">
          <p className="text-sm text-[#4a5c6e]">
            *Island deliveries may have additional courier fees. Contact us for
            a quote.
          </p>
        </div>
      </div>

      {/* Courier partners */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-[#1F2661] mb-4">
          🤝 Our Couriers
        </h3>
        <div className="flex flex-wrap gap-3">
          {couriers.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-2 rounded-full border border-[#eef2f5] bg-white px-4 py-2 text-sm font-medium text-[#1F2661]"
            >
              <span className="h-2 w-2 rounded-full bg-[#7FF46A]" />
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-4 mb-8">
        <div className="rounded-2xl bg-[#f0f6ff] border-l-4 border-[#7FF46A] p-4">
          <p className="text-sm text-[#4a5c6e]">
            <span className="font-semibold text-[#7FF46A]">📌 Important:</span>{" "}
            Shipping fees are calculated at checkout based on your delivery
            address and selected courier. Free pickup is always available — just
            select "Pickup" at checkout and we'll send you the address and
            pickup instructions.
          </p>
        </div>
        <div className="rounded-2xl bg-[#fef5e8] border-l-4 border-[#ff4676] p-4">
          <p className="text-sm text-[#4a5c6e]">
            <span className="font-semibold text-[#ff4676]">
              ⏱️ Delivery Time Estimates:
            </span>{" "}
            Belize City (1–2 business days) | Belmopan, San Ignacio (2–3 days) |
            Orange Walk, Corozal (2–4 days) | Dangriga, Punta Gorda (3–5 days) |
            Islands (5–7 days via courier).
          </p>
        </div>
      </div>
    </div>
  );
}
