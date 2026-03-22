import { NextResponse } from 'next/server'
import { searchItems } from '@/lib/dataSource'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = url.searchParams.get('q') ?? ''

  const min = url.searchParams.get('min')
  const max = url.searchParams.get('max')
  const sort = (url.searchParams.get('sort') ?? 'relevance') as
    | 'relevance'
    | 'price_asc'
    | 'price_desc'

  const { items, source } = await searchItems({
    q,
    min: min ? Number(min) : undefined,
    max: max ? Number(max) : undefined,
    sort,
  })

  return NextResponse.json({
    query: q,
    count: items.length,
    source,
    items,
  })
}
