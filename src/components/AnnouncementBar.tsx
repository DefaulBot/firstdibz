"use client";

import { motion } from "framer-motion";
import { Badge } from "./ui/Badge";

const messages = [
  "🎉 PAY HALF NOW. PAY OTHER HALF LATER. - Exclusive offer for Firs' Dibs BZ members!",
  "🚀 Free shipping on all orders over $75! Use code: FREESHIP75",
  "✨ New arrivals added daily! Be the first to get the latest trends",
  "🔥 Flash Sale: Up to 70% OFF on selected items! Limited time only!",
];

export function AnnouncementBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[1001] overflow-hidden bg-[#7FF46A] text-[#1F2661]">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 text-sm font-semibold"
      >
        <Badge className="border-[#1F2661]/15 bg-white/60 text-[#1F2661]">
          Pay half now · Pay the rest later
        </Badge>

        <div className="relative flex-1 overflow-hidden">
          <div className="marquee flex w-max gap-10 whitespace-nowrap">
            {[...messages, ...messages].map((m, idx) => (
              <span key={idx} className={idx % 2 ? "opacity-80" : ""}>
                {m}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        .marquee {
          animation: marquee 22s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
