"use client";

import { HeroBar } from "@/components/ui/HeroBar";
import { PageSection } from "@/components/ui/PageSection";
import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import { COMPANY } from "@/lib/company";

const faqItems: AccordionItem[] = [
  {
    question: "What is Firs' Dibs BZ and how does it work?",
    answer: (
      <>
        <p className="mb-2">
          Firs' Dibs BZ is Belize's first{" "}
          <span className="font-semibold text-[#7FF46A]">
            "reserve now, pay half later"
          </span>{" "}
          marketplace. Here's how it works:
        </p>
        <ul className="list-disc ml-5 mb-2 space-y-1">
          <li>
            <strong>Step 1:</strong> Browse our collection and reserve an item
            by paying a{" "}
            <span className="font-semibold text-[#1F2661]">50% deposit</span>.
          </li>
          <li>
            <strong>Step 2:</strong> We secure your item and begin processing
            your order.
          </li>
          <li>
            <strong>Step 3:</strong> Pay the remaining{" "}
            <span className="font-semibold text-[#1F2661]">50% balance</span>{" "}
            when you're ready (or upon delivery).
          </li>
          <li>
            <strong>Step 4:</strong> Earn loyalty points on both deposit and
            balance payments!
          </li>
        </ul>
        <p>
          No hidden fees, no compound interest — just flexible shopping made
          simple.
        </p>
      </>
    ),
  },
  {
    question: "How do I earn loyalty points?",
    answer: (
      <>
        <p className="mb-2">
          Earning points is easy and automatic. You'll receive:
        </p>
        <ul className="list-disc ml-5 mb-2 space-y-1">
          <li>
            <span className="font-semibold text-[#7FF46A]">50 points</span> —
            Sign-up bonus when you create an account
          </li>
          <li>
            <span className="font-semibold text-[#7FF46A]">10 points</span> —
            Per BZ$10 spent on your 50% deposit
          </li>
          <li>
            <span className="font-semibold text-[#7FF46A]">5 points</span> — Per
            BZ$10 spent on your remaining balance payment
          </li>
          <li>
            <span className="font-semibold text-[#7FF46A]">50 points</span> —
            When a friend you referred completes their first deposit
          </li>
          <li>
            <span className="font-semibold text-[#7FF46A]">50 points</span> —
            For leaving a review after your order is delivered
          </li>
        </ul>
        <p>Points never expire as long as you remain active with us!</p>
      </>
    ),
  },
  {
    question: "What rewards can I get with my points?",
    answer: (
      <>
        <p className="mb-2">
          We offer rewards starting at just{" "}
          <span className="font-semibold text-[#ff4676]">300 points</span>:
        </p>
        <ul className="list-disc ml-5 mb-2 space-y-1">
          <li>
            <strong>300 pts</strong> — BZ$5 off your next balance payment
          </li>
          <li>
            <strong>500 pts</strong> — Free shipping country-wide
          </li>
          <li>
            <strong>600 pts</strong> — BZ$10 off your next deposit
          </li>
          <li>
            <strong>1,000 pts</strong> — BZ$20 off any order
          </li>
          <li>
            <strong>2,000 pts</strong> — BZ$10 deposit credit + free shipping
          </li>
          <li>
            <strong>2,500 pts</strong> — BZ$40 off large orders
          </li>
        </ul>
        <p>Redeem your points directly in your account dashboard!</p>
      </>
    ),
  },
  {
    question: "How do I redeem my points?",
    answer: (
      <>
        <p className="mb-2">Redeeming points is simple:</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>Log into your Firs' Dibs BZ account</li>
          <li>
            Go to the{" "}
            <span className="font-semibold text-[#7FF46A]">"Points"</span>{" "}
            section in your Account to see how many points you have.
          </li>
          <li>
            View our rewards on the{" "}
            <span className="font-semibold text-[#7FF46A]">"Points page"</span>{" "}
            and select what you would like to redeem.
          </li>
          <li>
            Reach out to our customer service team to help you redeem points
            over the phone or via WhatsApp.
          </li>
          <li>
            A discount code or credit will be applied to your next purchase
            automatically.
          </li>
        </ul>
      </>
    ),
  },
  {
    question: "Is there a deadline to pay the remaining balance?",
    answer: (
      <>
        <p className="mb-2">
          We're flexible! Once you pay your 50% deposit, your item is reserved
          for <span className="font-semibold text-[#1F2661]">30 days</span>. You
          can pay the remaining balance anytime within that period. Need more
          time? Just contact us — we're happy to work with you. We charge a
          small storage fee.
        </p>
        <p>
          For pre-orders and international items, the balance is typically due
          when the item arrives in Belize (we'll notify you).
        </p>
      </>
    ),
  },
  {
    question: "Do you offer shipping? How much does it cost?",
    answer: (
      <>
        <p className="mb-2">
          Yes! We offer delivery across Belize. Shipping costs vary by location
          and item size, but here's the good news:
        </p>
        <ul className="list-disc ml-5 mb-2 space-y-1">
          <li>
            <span className="font-semibold text-[#7FF46A]">Free shipping</span>{" "}
            — Available for rewards redemptions starting at 500 points
          </li>
          <li>
            <span className="font-semibold text-[#7FF46A]">
              Standard shipping
            </span>{" "}
            — BZ$10 – BZ$25 depending on your location and courier
          </li>
          <li>
            <span className="font-semibold text-[#7FF46A]">Free pickup</span> —
            Available from our Belize City location
          </li>
          <li>
            <span className="font-semibold text-[#7FF46A]">Runman service</span>{" "}
            — Available within Belize City limits (BZ$7 – BZ$10 fee)
          </li>
        </ul>
        <p>
          We deliver to Belize City, Belmopan, San Ignacio, Orange Walk,
          Corozal, Dangriga, and Punta Gorda.
        </p>
      </>
    ),
  },
  {
    question: "What payment methods do you accept?",
    answer: (
      <>
        <p className="mb-2">
          We accept multiple payment options for your convenience:
        </p>
        <ul className="list-disc ml-5 mb-2 space-y-1">
          <li>
            <strong>Online bank transfers</strong> (Belize Bank, Atlantic Bank,
            Digiwallet, Eykash, National Bank)
          </li>
          <li>
            <strong>Credit/Debit cards</strong> (Visa, Mastercard) — coming soon
          </li>
          <li>
            <strong>Cash on pickup</strong> (for physical pickups at our
            location)
          </li>
        </ul>
        <p>All payments are secure and receipts are provided instantly.</p>
      </>
    ),
  },
  {
    question: "Can I cancel my order and get a refund?",
    answer: (
      <>
        <p className="mb-2">Yes, we have a fair cancellation policy:</p>
        <ul className="list-disc ml-5 mb-2 space-y-1">
          <li>
            <strong>Cancel within 24 hours of deposit</strong> — Full refund of
            your 50% deposit
          </li>
          <li>
            <strong>Cancel after 24 hours but before item ships</strong> —
            Refund minus 10% processing fee
          </li>
          <li>
            <strong>Cancel after item has shipped</strong> — You can proceed
            with the order or forfeit with no refund on deposit
          </li>
        </ul>
        <p>
          Just contact our customer service team and we'll process your request
          promptly.
        </p>
      </>
    ),
  },
  {
    question: "How do I contact customer support?",
    answer: (
      <>
        <p className="mb-2">
          We're here to help! Reach us through any of these channels:
        </p>
        <ul className="list-disc ml-5 mb-2 space-y-1">
          <li>
            <strong>📧 Email:</strong>{" "}
            <a
              href={`mailto:${COMPANY.email}`}
              className="text-[#1F2661] underline"
            >
              {COMPANY.email}
            </a>
          </li>
          <li>
            <strong>📞 Phone / WhatsApp:</strong> {COMPANY.phone}
          </li>
          <li>
            <strong>💬 Instagram DM:</strong> {COMPANY.instagramHandle}
          </li>
          <li>
            <strong>📍 In person:</strong> Belize City (by appointment)
          </li>
        </ul>
        <p>
          Our support hours are Monday–Friday 10 a.m. – 5:30 p.m., Saturday 10
          a.m. – 3 p.m. We usually respond within a few hours!
        </p>
      </>
    ),
  },
  {
    question: "Is Firs' Dibs BZ a legitimate Belizean company?",
    answer: (
      <>
        <p className="mb-2">
          Absolutely! Firs' Dibs BZ was{" "}
          <span className="font-semibold text-[#7FF46A]">
            founded in Belize in January 2026
          </span>{" "}
          as a marketing project that grew into a real business. We are proudly
          Belizean-owned and operated, registered locally, and committed to
          serving our community.
        </p>
        <p>
          Our mission is to build trust through timely service, clear
          communication, and careful handling of every order. We're here to
          stay!
        </p>
      </>
    ),
  },
];

export function FaqClient() {
  return (
    <div className="mx-auto max-w-3xl mt-40 md:mt-44">
      <HeroBar
        title="❓ Frequently Asked Questions"
        description="Everything you need to know about Firs' Dibs BZ"
        accent="✨ Pay half now · Other half later ✨"
      />

      <PageSection
        title="Got questions? We've got answers."
        description="Find quick answers to common questions about our payment model, loyalty rewards, and more."
      />

      <Accordion items={faqItems} />
    </div>
  );
}
