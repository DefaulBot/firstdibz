"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { CatalogItem } from "@/lib/types";

export function ProductCard({
  item,
  priority,
}: {
  item: CatalogItem;
  priority?: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      whileHover={{ y: -8 }}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 border border-[#8C9FAE]/30"
    >
      <Link href={`/item/${item.id}`} className="block">
        <div className="relative aspect-[4/3] bg-[#D9EBDD]/20 overflow-hidden flex items-center justify-center">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              priority={priority}
              className="object-contain p-6 transition duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-[#8C9FAE]">
              <span className="text-sm">No image</span>
            </div>
          )}
          <div className="absolute left-4 top-4 flex items-center gap-2 z-10">
            <div className="bg-[#7FF46A] text-[#1F2661] px-3 py-1 rounded-full text-xs font-bold shadow-md">
              PREORDER
            </div>
          </div>
        </div>

        <div className="space-y-2 p-4">
          <div className="line-clamp-2 text-sm font-semibold text-[#1F2661] group-hover:text-[#549866] transition-colors">
            {item.title}
          </div>
          <div className="flex items-center justify-between">
            <div className="text-base font-extrabold text-[#1F2661]">
              {item.price.formatted}
            </div>
            <div className="text-xs font-semibold text-[#8C9FAE]">
              ID {item.id}
            </div>
          </div>
          <button className="w-full mt-2 bg-[#1F2661] hover:bg-[#1F2661]/90 text-white font-semibold py-2 rounded-lg transition-all shadow-sm hover:shadow-md text-sm">
            Shop Now
          </button>
        </div>
      </Link>

      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/5 to-transparent" />
      </div>
    </motion.div>
  );
}
