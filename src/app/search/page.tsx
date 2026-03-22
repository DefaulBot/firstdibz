import { SearchClient } from '@/components/SearchClient'
import { searchItems } from '@/lib/dataSource'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; min?: string; max?: string; sort?: string }
}) {
  const q = searchParams.q ?? ''
  const min = searchParams.min ? Number(searchParams.min) : undefined
  const max = searchParams.max ? Number(searchParams.max) : undefined
  const sort = (searchParams.sort as any) ?? 'relevance'

  const { items, source } = await searchItems({ q, min, max, sort })

  return (
    <SearchClient
      initialQ={q}
      initialMin={min}
      initialMax={max}
      initialSort={sort}
      initialItems={items}
      initialSource={source}
    />
  )
}
