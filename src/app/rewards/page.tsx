import type { Metadata } from "next";
import Link from "next/link";
import { HeroBar } from "@/components/ui/HeroBar";
import { PageSection } from "@/components/ui/PageSection";

export const metadata: Metadata = {
  title: "Rewards & Points | Firs' Dibs BZ",
  description:
    "Earn points with every purchase, referral, and deposit. Redeem for discounts and free shipping.",
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const earningRules = [
  { label: "Sign-up bonus", value: "50 pts", icon: "🎉" },
  { label: "Per BZ$10 deposit", value: "10 pts", icon: "💰" },
  { label: "Per remaining dollar", value: "5 pts", icon: "💵" },
  { label: "Referral bonus", value: "50 pts", icon: "👥" },
];

const rewards = [
  { points: 300, reward: "$5 Off", icon: "🏷️", color: "bg-[#e8f8e5]" },
  { points: 500, reward: "Free Shipping", icon: "📦", color: "bg-[#f0f6ff]" },
  { points: 600, reward: "$10 Off", icon: "🏷️", color: "bg-[#e8f8e5]" },
  { points: 750, reward: "Free Shipping", icon: "📦", color: "bg-[#f0f6ff]" },
  { points: 1000, reward: "$20 Off", icon: "🏷️", color: "bg-[#e8f8e5]" },
  {
    points: 2000,
    reward: "$10 + Free Shipping",
    icon: "🎁",
    color: "bg-[#fef5e8]",
  },
  { points: 2500, reward: "$40 Off", icon: "💎", color: "bg-[#ffe8ec]" },
];

const howItWorks = [
  {
    step: 1,
    title: "Create Your Account",
    description:
      "Sign up for free and automatically receive 50 bonus points just for joining.",
  },
  {
    step: 2,
    title: "Shop & Deposit",
    description:
      "Browse our catalog, add items to your cart, and make your 50% deposit to place your order.",
  },
  {
    step: 3,
    title: "Earn Points",
    description:
      "Get 10 points for every BZ$10 you deposit, plus 5 points per dollar on your remaining balance payment.",
  },
  {
    step: 4,
    title: "Refer Friends",
    description:
      "Share your referral link and earn 50 bonus points every time a friend makes their first purchase.",
  },
  {
    step: 5,
    title: "Redeem Rewards",
    description:
      "Use your accumulated points to unlock discounts, free shipping, and exclusive combo rewards.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function RewardsPage() {
  return (
    <div className="mx-auto max-w-4xl mt-40 md:mt-44">
      <HeroBar
        title="Rewards & Points"
        description="Earn points every time you shop, refer, or pay"
        accent="🎁 Start with 50 free points!"
      />

      {/* Earning overview */}
      <PageSection
        title="How You Earn Points"
        description="Every action brings you closer to amazing rewards."
      />

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 mb-10">
        {earningRules.map((r) => (
          <div
            key={r.label}
            className="rounded-2xl border border-[#eef2f5] bg-white p-5 text-center transition hover:border-[#7FF46A] hover:shadow-sm"
          >
            <span className="text-3xl block mb-2">{r.icon}</span>
            <p className="text-xl font-bold text-[#7FF46A]">{r.value}</p>
            <p className="text-xs text-[#5a6879] mt-1">{r.label}</p>
          </div>
        ))}
      </div>

      {/* Rewards grid */}
      <PageSection
        title="🎁 Rewards You Can Redeem"
        description="Accumulate points and choose your reward."
      />

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-10">
        {rewards.map((r) => (
          <div
            key={r.points}
            className={`rounded-2xl ${r.color} p-5 text-center transition hover:shadow-md hover:-translate-y-1`}
          >
            <span className="text-2xl block mb-2">{r.icon}</span>
            <p className="text-2xl font-bold text-[#1F2661]">{r.points}</p>
            <p className="text-xs text-[#5a6879] mb-1">points</p>
            <p className="text-sm font-semibold text-[#1F2661]">{r.reward}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <PageSection
        title="How It Works"
        description="From sign-up to savings in five easy steps."
      />

      <div className="space-y-4 mb-10">
        {howItWorks.map((s) => (
          <div
            key={s.step}
            className="flex items-start gap-4 rounded-2xl border border-[#eef2f5] bg-white px-5 py-4 transition hover:border-[#7FF46A]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1F2661] text-white font-bold text-sm">
              {s.step}
            </div>
            <div>
              <h4 className="font-bold text-[#1F2661]">{s.title}</h4>
              <p className="text-sm text-[#5a6879]">{s.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Important notes */}
      <div className="rounded-2xl bg-[#f0f6ff] border-l-4 border-[#7FF46A] p-5 mb-10">
        <p className="font-semibold text-[#7FF46A] text-sm mb-2">
          📌 Good to Know:
        </p>
        <ul className="list-disc ml-5 text-sm text-[#5a6879] space-y-1">
          <li>Points never expire as long as your account is active.</li>
          <li>Points are non-transferable between accounts.</li>
          <li>
            Rewards are applied at checkout and cannot be combined with other
            promo codes.
          </li>
          <li>
            Point balances and transaction history are visible in your Account
            page.
          </li>
          <li>
            Referral points are credited once your friend completes their first
            purchase.
          </li>
        </ul>
      </div>

      {/* CTA */}
      <div className="rounded-3xl bg-[#f0f6ff] border border-[#eef2f5] p-8 text-center mb-8">
        <h3 className="text-lg font-bold text-[#1F2661] mb-2">
          🚀 Start Earning Today
        </h3>
        <p className="text-sm text-[#5a6879] mb-4">
          Create your free account and get 50 bonus points instantly.
        </p>
        <Link
          href="/signin"
          className="inline-block rounded-full bg-[#1F2661] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#7FF46A] hover:text-[#1F2661]"
        >
          Sign Up / Sign In
        </Link>
      </div>
    </div>
  );
}
