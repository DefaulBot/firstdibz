import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Firs' Dibs BZ",
  description:
    "Belize's first reserve-now, pay-half-later marketplace. Founded in January 2026.",
};

const values = [
  {
    icon: "🤝",
    title: "Community First",
    desc: "We listen to Belizean families and entrepreneurs. Our rewards are built on real feedback.",
  },
  {
    icon: "💚",
    title: "Fair & Simple",
    desc: "No compound interest, no hidden late fees — just honest 'pay half now, half later' terms.",
  },
  {
    icon: "🚀",
    title: "Innovative Loyalty",
    desc: "Points on deposits, balance payments, referrals, and reviews. Starting at just 300 points to redeem.",
  },
  {
    icon: "🇧🇿",
    title: "Proudly Belizean",
    desc: "Founded and headquartered in Belize, supporting local vendors and delivery networks.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl mt-40 md:mt-44">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1F2661] mb-3">
          ✨ About Firs' Dibs BZ ✨
        </h1>
        <p className="text-lg text-[#5e6f82] max-w-2xl mx-auto">
          Belize's first "reserve now, pay half — settle later" marketplace with
          loyalty rewards that actually give back.
        </p>
        <span className="mt-3 inline-block rounded-full bg-[#7FF46A] px-4 py-1 text-sm font-semibold text-[#1F2661]">
          🇧🇿 Founded in Belize · January 2026
        </span>
      </div>

      {/* Story */}
      <div className="flex flex-col lg:flex-row gap-8 mb-10">
        <div className="flex-[2] min-w-0">
          <h2 className="text-2xl font-bold text-[#1F2661] border-l-4 border-[#ff4676] pl-4 mb-4">
            Our story — born in the classroom, rooted in Belize
          </h2>
          <p className="text-[#3a4c62] mb-3">
            <strong>Firs' Dibs BZ</strong> started as a marketing project in
            early 2026, but it quickly evolved into a vision for transforming
            how Belizeans shop and pay. We are a team of passionate students,
            entrepreneurs, and creatives who wanted to solve a real problem:{" "}
            <span className="font-semibold text-[#ff4676]">
              flexible payments without hidden fees
            </span>
            , combined with a rewards system that feels fair and exciting.
          </p>
          <p className="text-[#3a4c62] mb-3">
            Founded in <strong className="text-[#7FF46A]">January 2026</strong>{" "}
            in beautiful Belize, our platform blends the "pay half now, half
            later" model with a loyalty program that starts at just 300 points.
            Every deposit, every balance payment, and every referral earns you
            points toward discounts, free shipping, and exclusive perks.
          </p>
          <div className="rounded-2xl bg-[#fafcff] border-l-[3px] border-[#7FF46A] p-4 my-4">
            <p className="font-medium text-[#1F2661]">
              🎓 <strong>Marketing class project turned real purpose</strong> —
              we designed every aspect of Firs' Dibs BZ to be transparent,
              inclusive, and sustainable for Belizean shoppers and local
              businesses alike.
            </p>
          </div>
          <p className="text-[#3a4c62]">
            From Belize City to the cayes, we believe everyone deserves access
            to quality products without financial strain. Our "Firs' Dibs"
            system lets you secure trending fashion, home goods, electronics,
            and more with just a 50% deposit. Pay the rest when you're ready —
            and earn points while you do it.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div className="rounded-3xl border border-[#eef2f5] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#7FF46A] hover:shadow-md">
          <span className="text-4xl mb-3 inline-block bg-[#f0f6ff] p-2 rounded-full">
            🎯
          </span>
          <h3 className="text-xl font-bold text-[#1F2661] mb-2">Our Mission</h3>
          <p className="text-[#4a5c6e] leading-relaxed">
            Firs' Dibs BZ is committed to delivering a smooth and dependable
            online ordering experience by managing the purchasing and delivery
            process from start to finish. Our mission is to build trust with
            customers through{" "}
            <strong className="text-[#7FF46A]">
              timely service, clear communication, and careful handling
            </strong>{" "}
            of every order.
          </p>
        </div>
        <div className="rounded-3xl border border-[#eef2f5] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#7FF46A] hover:shadow-md">
          <span className="text-4xl mb-3 inline-block bg-[#f0f6ff] p-2 rounded-full">
            🌟
          </span>
          <h3 className="text-xl font-bold text-[#1F2661] mb-2">Our Vision</h3>
          <p className="text-[#4a5c6e] leading-relaxed">
            Our vision is to grow into a trusted and recognized online company
            that connects customers to international products while delivering
            excellent service. Firs' Dibs BZ strives to be known for{" "}
            <strong className="text-[#ff4676]">
              reliability, customer satisfaction, and convenience
            </strong>
            , continuously improving our services to meet the changing needs of
            our customers.
          </p>
        </div>
      </div>

      {/* Service Promise */}
      <div className="rounded-3xl border border-[#eef2f5] bg-gradient-to-br from-white to-[#fafcff] p-6 text-center mb-10 shadow-sm">
        <h3 className="text-xl font-bold text-[#1F2661] mb-3">
          From purchase to delivery — we've got you covered
        </h3>
        <p className="text-[#4a5c6e] max-w-3xl mx-auto mb-3">
          We personally manage the journey of every order: from the moment you
          place a deposit until your package arrives safely at your doorstep.
          Our team ensures{" "}
          <strong className="text-[#7FF46A]">
            real-time tracking, proactive updates, and quality checks
          </strong>{" "}
          so you can shop with confidence. Whether it's international fashion or
          local must-haves, we handle logistics with care.
        </p>
        <span className="inline-block rounded-full bg-[#7FF46A]/20 px-4 py-1 text-xs font-semibold text-[#1F2661]">
          ✨ end-to-end excellence ✨
        </span>
      </div>

      {/* Values */}
      <div className="rounded-3xl bg-[#fafcff] border border-[#eef2f5] p-6 mb-8">
        <div className="flex flex-wrap gap-6 justify-center">
          {values.map((v) => (
            <div key={v.title} className="flex-1 min-w-[160px] text-center">
              <div className="text-3xl mb-2">{v.icon}</div>
              <h4 className="font-bold text-[#1F2661] mb-1">{v.title}</h4>
              <p className="text-sm text-[#5e6f82]">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
