'use client'

import { AnimatePresence } from 'framer-motion'
import type { CatalogItem } from '@/lib/types'
import { ProductCard } from './ProductCard'

export function ProductGrid({ items }: { items: CatalogItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence>
        {items.map((it, idx) => (
          <ProductCard key={it.id} item={it} priority={idx < 3} />
        ))}
      </AnimatePresence>
    </div>
  )
}
