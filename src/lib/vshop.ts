import type { CatalogItem, ItemDetail, Money } from './types'

const BASE_URL = process.env.VSHOP_BASE_URL?.replace(/\/$/, '') || 'https://vshop.bz'
// This buildId changes whenever the upstream VShop deploys. We try to discover it automatically,
// but keep a fallback so the app still works if discovery is blocked.
const FALLBACK_BUILD_ID = process.env.VSHOP_BUILD_ID || 'QABX9odYPlPf1Tpvh_1OJ'

type VShopSearchItem = {
  id: number
  title: string
  price: string
  price_unformatted: number
  original_price?: string | null
  discount?: string | null
  image: string
  only_left_in_stock?: number | null
  new_arrival?: boolean | null
}

type VShopSearchResponse = {
  pageProps?: {
    data?: { items?: VShopSearchItem[] }
  }
}

type VShopItemImage = {
  key: number
  id: number
  image: string
  small_image: string
}

type VShopItemResponse = {
  pageProps?: {
    data?: {
      id: number
      title: string
      price: string
      original_price?: string | null
      discount?: string | null
      image: string
      out_of_stock?: boolean | null
      new_arrival?: boolean | null
      current_image?: number
      images?: VShopItemImage[]
      points_earned?: number
      points_earned_in_dollars_formatted?: string
      preorder_chart?: Array<{ name: string; value: string }>
      share_text?: string
      share_link?: string
      only_left_in_stock?: number | null
    }
  }
}

let cachedBuildId: { value: string; ts: number } | null = null

function toMoney(formatted: string | null | undefined, value: number | null | undefined): Money {
  return {
    formatted: formatted ?? `BZD $${(value ?? 0).toFixed(2)}`,
    value: typeof value === 'number' && Number.isFinite(value) ? value : 0,
  }
}

function parseMoneyValue(formatted: string | null | undefined): number {
  if (!formatted) return 0
  const n = Number(formatted.replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

function headersForVshop() {
  // Some sites block default Node fetch headers; this helps mimic a real browser.
  return {
    'User-Agent':
      process.env.VSHOP_USER_AGENT ||
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36',
    Accept: 'text/html,application/json;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    Referer: `${BASE_URL}/`,
  }
}

async function fetchWithTimeout(url: string, ms = 8000): Promise<Response> {
  const ac = new AbortController()
  const t = setTimeout(() => ac.abort(), ms)
  try {
    return await fetch(url, {
      headers: headersForVshop(),
      cache: 'no-store',
      redirect: 'follow',
      signal: ac.signal,
    })
  } finally {
    clearTimeout(t)
  }
}

export async function getVshopBuildId(): Promise<string> {
  // Cache for 10 minutes.
  if (cachedBuildId && Date.now() - cachedBuildId.ts < 10 * 60 * 1000) return cachedBuildId.value

  try {
    const res = await fetchWithTimeout(`${BASE_URL}/search?q=necklace`, 9000)
    const html = await res.text()
    const m = html.match(/\"buildId\"\s*:\s*\"([^\"]+)\"/)
    if (m?.[1]) {
      cachedBuildId = { value: m[1], ts: Date.now() }
      return m[1]
    }
  } catch {
    // ignore
  }

  cachedBuildId = { value: FALLBACK_BUILD_ID, ts: Date.now() }
  return FALLBACK_BUILD_ID
}

export function mapSearchItemToCatalog(it: VShopSearchItem): CatalogItem {
  return {
    id: it.id,
    title: it.title,
    price: toMoney(it.price, it.price_unformatted),
    originalPrice: it.original_price ? toMoney(it.original_price, parseMoneyValue(it.original_price)) : null,
    discount: it.discount ?? null,
    image: it.image,
    onlyLeftInStock: it.only_left_in_stock ?? null,
    newArrival: it.new_arrival ?? null,
  }
}

export async function vshopSearch(q: string): Promise<CatalogItem[]> {
  const buildId = await getVshopBuildId()
  const url = `${BASE_URL}/_next/data/${buildId}/search.json?q=${encodeURIComponent(q)}`
  const res = await fetchWithTimeout(url)
  if (!res.ok) throw new Error(`VShop search failed: HTTP ${res.status}`)
  const json = (await res.json()) as VShopSearchResponse
  const items = json?.pageProps?.data?.items ?? []
  return items.map(mapSearchItemToCatalog)
}

export function mapItemToDetail(
  data: NonNullable<NonNullable<VShopItemResponse['pageProps']>['data']>,
): ItemDetail {
  return {
    id: data.id,
    title: data.title,
    price: toMoney(data.price, parseMoneyValue(data.price)),
    originalPrice: data.original_price ? toMoney(data.original_price, parseMoneyValue(data.original_price)) : null,
    discount: data.discount ?? null,
    image: data.image,
    onlyLeftInStock: data.only_left_in_stock ?? null,
    newArrival: data.new_arrival ?? null,
    out_of_stock: data.out_of_stock ?? null,
    current_image: data.current_image,
    images: data.images,
    points_earned: data.points_earned,
    points_earned_in_dollars_formatted: data.points_earned_in_dollars_formatted,
    preorder_chart: data.preorder_chart,
    share_text: data.share_text,
    share_link: data.share_link,
  }
}

export async function vshopItem(id: number): Promise<ItemDetail> {
  const buildId = await getVshopBuildId()
  const url = `${BASE_URL}/_next/data/${buildId}/item/${id}.json?id=${id}`
  const res = await fetchWithTimeout(url)
  if (!res.ok) throw new Error(`VShop item failed: HTTP ${res.status}`)
  const json = (await res.json()) as VShopItemResponse
  const data = json?.pageProps?.data
  if (!data) throw new Error('VShop item response missing data')
  return mapItemToDetail(data)
}
