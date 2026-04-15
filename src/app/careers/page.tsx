import type { Metadata } from "next";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Careers | Firs' Dibs BZ",
  description:
    "Join the Firs' Dibs BZ team — build the future of flexible shopping in Belize.",
};

const perks = [
  {
    icon: "💚",
    title: "Flexible Work",
    desc: "Remote-first culture with optional co-working spaces in Belize City. Balance your life and career.",
  },
  {
    icon: "📈",
    title: "Growth Mindset",
    desc: "We invest in your learning — workshops, courses, and mentorship from day one.",
  },
  {
    icon: "🎉",
    title: "Team Events",
    desc: "Monthly meetups, beach hangouts, and volunteer days. We work hard and celebrate together.",
  },
  {
    icon: "🏖️",
    title: "Paid Time Off",
    desc: "Generous vacation policy + Belize public holidays off. Recharge and explore.",
  },
  {
    icon: "🛍️",
    title: "Employee Discount",
    desc: "Enjoy exclusive discounts on all Firs' Dibs products + early access to collections.",
  },
  {
    icon: "💡",
    title: "Make an Impact",
    desc: "Your ideas shape our platform — from loyalty features to logistics improvements.",
  },
];

export default function CareersPage() {
  return (
    <div className="mx-auto max-w-5xl mt-40 md:mt-44">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1F2661] mb-3">
          🚀 Join the Firs' Dibs BZ Team
        </h1>
        <p className="text-lg text-[#5e6f82] max-w-2xl mx-auto">
          Build the future of flexible shopping in Belize — with purpose,
          passion, and perks.
        </p>
        <span className="mt-3 inline-block rounded-full bg-[#7FF46A] px-4 py-1 text-sm font-semibold text-[#1F2661]">
          Belize-based · Remote-friendly
        </span>
      </div>

      {/* No positions */}
      <div className="rounded-3xl bg-[#fafcff] border border-[#eef2f5] p-10 text-center mb-10">
        <div className="text-6xl mb-3">🔮</div>
        <h2 className="text-2xl font-bold text-[#1F2661] mb-3">
          No open positions at this time
        </h2>
        <p className="text-[#5e6f82] max-w-xl mx-auto mb-5">
          We're a young, growing team and don't have any immediate vacancies.
          However, we're always excited to meet talented individuals who share
          our passion for flexible commerce and exceptional service.
        </p>
        <a
          href={`mailto:${COMPANY.careersEmail}`}
          className="inline-block rounded-full bg-[#1F2661] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#ff4676]"
        >
          Send your CV →
        </a>
        <p className="text-xs text-[#8a9bb0] mt-3">
          Email {COMPANY.careersEmail} with your CV and a short note about why
          you'd love to join us.
        </p>
      </div>

      {/* Perks */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-[#1F2661] mb-6 text-center">
          ✨ Why join us? ✨
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {perks.map((p) => (
            <div
              key={p.title}
              className="rounded-3xl border border-[#eef2f5] bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-[#7FF46A] hover:shadow-md"
            >
              <span className="inline-block text-3xl mb-3 bg-[#f0f6ff] p-2 rounded-full w-14 text-center">
                {p.icon}
              </span>
              <h3 className="text-lg font-bold text-[#1F2661] mb-1">
                {p.title}
              </h3>
              <p className="text-sm text-[#5a6879]">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
