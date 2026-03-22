import type { CatalogItem, ItemDetail } from './types'

function money(value: number): { formatted: string; value: number } {
  return { formatted: `BZD $${value.toFixed(2)}`, value }
}

// NOTE: This is seeded from the sample API payload you shared (search + one item detail).
// In production you can replace these with a DB or external integrations.
export const CATALOG: CatalogItem[] = [
  {
    id: 3066412,
    title:
      'Cate & Chloe Sophia 18K White Gold Plated Halo Necklace With Simulated Diamond Crystals For Women',
    price: money(69.75),
    image:
      'https://i5.walmartimages.com/asr/8ea5c55c-79bc-4957-8dff-bb75aebd208d.6ad31870a1f0c299cf967b29ab54af0f.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff',
  },
  {
    id: 3007354,
    title:
      'Jeenmata 3.25 Carat Cubic Zirconia April Birthstone - Round And Pear Cut Dangle Pendant Necklace In 18K White Gold Plated For Women',
    price: money(66.45),
    image:
      'https://i5.walmartimages.com/asr/74d4234b-a60e-4760-a147-53db6e3fb768.4b0821bfede95aa3d03cc1696559e07b.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff',
  },
  {
    id: 3433558,
    title: 'No Boundaries Multicolor Two Layer Mixed Icon Necklace For Female Adults And Teens',
    price: money(23.95),
    image:
      'https://i5.walmartimages.com/asr/018995c5-3e92-4727-9127-dc496e2795c0.f3b3cf26752e10d75bf51c2002575852.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff',
  },
  {
    id: 3031743,
    title:
      'Apsvo S925 Sterling Silver Plated Chains For Women Men Boys 3Mm/5Mm Figaro Curb Link Necklace Birthday Valentines Day Jewelry Gifts Teen Him Her Dad Girls Mom Adults Kids Age 14/16/18/20/22/24 Inch',
    price: money(41.25),
    image:
      'https://i5.walmartimages.com/asr/da9b3326-43e8-4677-9371-452da3edff0f.492123e08e52e7538126918461636962.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff',
  },
  {
    id: 3007375,
    title:
      'Apsvo 18K White Gold Plated Initial Necklaces For Women Girls Cz S925 Sterling Silver Letter A Necklace Set Birthday Valentines Day Jewelry Gifts Teen Her Wife Mom Girlfriend Female Adults Kids Ideas',
    price: money(51.75),
    image:
      'https://i5.walmartimages.com/asr/73dc57a3-b9ae-4d9a-813d-b8877ba94d69.238100f9dec7d097e38a62e9ac95ce6c.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff',
  },
  {
    id: 3066407,
    title: 'Cate & Chloe Amora 18K White Gold Plated Heart Pendant Necklace With Simulated Diamonds For Women',
    price: money(69.75),
    image:
      'https://i5.walmartimages.com/asr/9f5c09db-9f1d-4701-b258-021377d0ad35.30bfe4e67c85542d539a181800d42aea.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff',
  },
  {
    id: 3017832,
    title: "Time And Tru Women's Gold Tone Heart Pendant Necklace 18\" With Extender",
    price: money(23.95),
    image:
      'https://i5.walmartimages.com/asr/d069726d-e2aa-44a1-b65e-2eae5372360c.13ac8a5fc568e3a3c3e6d0113aca152d.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff',
  },
  {
    id: 3007350,
    title:
      'Heshpaws Love Pendant Necklaces For Women With Birthstone Zirconia, Christmas Birthday Anniversary Jewelry Gift For Women Wife',
    price: money(38.45),
    image:
      'https://i5.walmartimages.com/asr/e0863015-a2a6-46da-8173-2fc97707d18d.9ceae1140ca2ef64c8306a4e389b2cbc.png?odnHeight=180&odnWidth=180&odnBg=ffffff',
  },
  {
    id: 3273233,
    title:
      'Emibele Preserved Rose Flower With Heart Necklace, Eternal Purple Real Rose With Music Led Lights,Gifts For Her Women Mom Wife Grandma On Anniversary Birthday Valentines, Purple',
    price: money(101.45),
    image:
      'https://i5.walmartimages.com/asr/e557734a-7201-4f05-9b6b-86b2a7cbb446.4f98568bb6a8b2b3c0f79c952cb3599f.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff',
  },
  {
    id: 3066402,
    title: "Time And Tru Adult Women's Gold Tone Crystal Dangle Delicate Metal Necklace",
    price: money(13.45),
    image:
      'https://i5.walmartimages.com/asr/765158c8-17cf-4b2b-9c2c-788b22e77155.94278f1bab88c78115a6207cd5ad0c7d.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff',
  },
  {
    id: 3007392,
    title:
      "Heart Necklace For Women 14K Gold Plated Cz Romantic Rose And Butterfly Jewelry Gift For Women Birthday Valentine's Day",
    price: money(44.95),
    image:
      'https://i5.walmartimages.com/asr/22836556-617e-4c35-b31c-f05c365b7740.c2e0a595d66a982772b857f7ea46cd3b.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff',
  },
  {
    id: 3135904,
    title: 'Time And Tru Delicate Cross Necklace',
    price: money(23.95),
    image:
      'https://i5.walmartimages.com/asr/bbdee8d5-a441-40a9-86af-d1f93b1c0010.7d7a0ed70b5d460d60308e2b76f1180b.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff',
  },
  {
    id: 3137534,
    title: "Cate & Chloe Luna January Birthstone 18K White Gold Plated Women's Necklace With Swarovski Crystal",
    price: money(66.45),
    image:
      'https://i5.walmartimages.com/asr/d86a8d0a-1e3e-4043-b348-0e3efc3924fe.e72314b4654cfa692dcfed6843c846a2.png?odnHeight=180&odnWidth=180&odnBg=ffffff',
  },
  {
    id: 3007400,
    title: 'Jeenmata 1 Carat Moissanite - April Birthstone Solitaire Pendant Necklace In 18K White Gold Over Silver, Female, Adult',
    price: money(66.45),
    image:
      'https://i5.walmartimages.com/asr/2699c267-a23d-4fda-bc1c-08195fea25d2.c48e2fb7680cede57df000e5d52a2757.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff',
  },
  {
    id: 3260854,
    title: "Time And Tru Women's Goldtone Initial X Necklace With Giftable Pouch",
    price: money(8.95),
    image:
      'https://i5.walmartimages.com/asr/aaba2aeb-48e4-4c82-bc89-95b30588feb5.a068721c5cafd436fbfcd83e792a1548.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff',
  },
  {
    id: 3017826,
    title: "Time And Tru Women’s Layered Necklace With Cubic Zirconia Pendant",
    price: money(27.45),
    image:
      'https://i5.walmartimages.com/asr/e7e5199b-22f7-4975-ae73-c6b9013d6177.d7c571843b413acbac2df0a822e15296.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff',
  },
  {
    id: 3260853,
    title:
      'Jeenmata Gorgeous 2 Carat Heart Cut - Cubic Zirconia - April Birthstone Pendant Necklace In 18K White Gold Plating For Women',
    price: money(52.45),
    image:
      'https://i5.walmartimages.com/asr/2e90d28f-0b24-4dfd-92e2-226cf953faed.ca287d47b0ee8d87e52f8910faee9edd.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff',
  },
  {
    id: 3066401,
    title: 'Time And Tru Gold Plated Clover Pave Stones Pendant Necklace With Lobster Clasp',
    price: money(19.25),
    image:
      'https://i5.walmartimages.com/asr/2c052df4-254c-4954-bc8b-15c137e01107.e3fb99455005d7d485d81e92f7c4f84a.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff',
  },
  {
    id: 3066410,
    title: "Time And Tru Women's Gold Tone Delicate Duo Layered Peach Glass Bead And Leaf Necklaces.",
    price: money(44.95),
    image:
      'https://i5.walmartimages.com/asr/dce89458-4e71-4a68-a473-97465470bad1.ae8681953a387c287dc43b39a5dc62ca.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff',
  },
  {
    id: 3198354,
    title:
      'Apsvo 18K White Gold Plated Love Heart Initial Necklaces For Women Girls Cz S925 Sterling Silver Letter A Pendant Chain Birthday Valentines Day Jewelry Gifts Teen Her Mom Wife Adults Kids Age Ideas',
    price: money(48.25),
    image:
      'https://i5.walmartimages.com/asr/433345b9-969e-46c3-8130-32592606bece.699e537b4185f446874de07ff4846bbd.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff',
  },
  {
    id: 3079998,
    title: "Time And Tru Women's Gold Tone Moon And Star Pendant Necklace Set, 2-Piece",
    price: money(27.45),
    image:
      'https://i5.walmartimages.com/asr/55a6ad2c-377f-45f4-88f1-7022c2a16114.6f2dc0bd797eeb154558bfd80559ed77.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff',
  },
  {
    id: 3007419,
    title:
      'Turandoss 14K Gold Plated Dainty Tiny Cross Pendant Necklace For Women Faith Jewelry Trendy Personalizedt First Communion Christian Religious Baptism Birthday Valentines Day Gifts For Her Kid Girls',
    price: money(48.75),
    image:
      'https://i5.walmartimages.com/asr/62d9c20d-c411-4f8d-adda-b68c5451598a.ff26f93a25e5deee800c1d09dec17af1.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff',
  },
  {
    id: 3007457,
    title: 'Sfting 14K Gold Plated Zirconia Silver Cross Faith Pendant Necklace For Women With 925 Silver',
    price: money(103.45),
    image:
      'https://i5.walmartimages.com/asr/7bb18bd2-5b95-4f8f-a248-3a6490e65c7c.97d71d7ff40a2d1a69bd0b848eeb4f35.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff',
  },
  {
    id: 3024565,
    title: 'Bestyle Tree Of Life Heart Crystal Necklaces For Women, Moonstone Necklace June Birthstone Pendant Jewelry Gift For Mother Wife',
    price: money(54.95),
    image:
      'https://i5.walmartimages.com/asr/239f9baf-2d63-4f5e-b995-34e315458a0c.d67259d9c0d4e0e0b9ff04f28b3a66b3.jpeg?odnHeight=180&odnWidth=180&odnBg=ffffff',
  },
  {
    id: 3007399,
    title:
      'Beautlace Valentines Day Gifts For Her, 925 Sterling Silver Heart Necklace For Women Mom, Romantic Jewelry Gift For Wife Girlfriend',
    price: money(66.95),
    image:
      'https://i5.walmartimages.com/seo/Beautlace-925-Sterling-Silver-Birthstone-Necklace-Rose-Flower-Heart-Pendant-Jewelry-Valentines-Gifts-for-Women-Wife-Lover_6f4860dc-4c62-418c-8922-968bd5bf6206.8ee5af667cdbc4665b2a97475dff0c62.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF',
  },
]

export const ITEM_DETAILS: Record<number, ItemDetail> = {
  3007399: {
    id: 3007399,
    title:
      'Beautlace Valentines Day Gifts For Her, 925 Sterling Silver Heart Necklace For Women Mom, Romantic Jewelry Gift For Wife Girlfriend',
    price: money(66.95),
    image:
      'https://i5.walmartimages.com/seo/Beautlace-925-Sterling-Silver-Birthstone-Necklace-Rose-Flower-Heart-Pendant-Jewelry-Valentines-Gifts-for-Women-Wife-Lover_6f4860dc-4c62-418c-8922-968bd5bf6206.8ee5af667cdbc4665b2a97475dff0c62.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
    current_image: 6013797,
    images: [
      {
        key: 1,
        id: 6013797,
        image:
          'https://i5.walmartimages.com/seo/Beautlace-925-Sterling-Silver-Birthstone-Necklace-Rose-Flower-Heart-Pendant-Jewelry-Valentines-Gifts-for-Women-Wife-Lover_6f4860dc-4c62-418c-8922-968bd5bf6206.8ee5af667cdbc4665b2a97475dff0c62.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
        small_image:
          'https://i5.walmartimages.com/seo/Beautlace-925-Sterling-Silver-Birthstone-Necklace-Rose-Flower-Heart-Pendant-Jewelry-Valentines-Gifts-for-Women-Wife-Lover_6f4860dc-4c62-418c-8922-968bd5bf6206.8ee5af667cdbc4665b2a97475dff0c62.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF',
      },
      {
        key: 2,
        id: 6013798,
        image:
          'https://i5.walmartimages.com/asr/14f5688e-2967-442c-b7c4-7bc0473f18c5.861740f181ac008ca54d0084e2258bdd.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
        small_image:
          'https://i5.walmartimages.com/asr/14f5688e-2967-442c-b7c4-7bc0473f18c5.861740f181ac008ca54d0084e2258bdd.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF',
      },
      {
        key: 3,
        id: 6013799,
        image:
          'https://i5.walmartimages.com/asr/c2229311-144e-4ad5-96f1-c54656b7f2f8.42b7526eadae9c264dddd8cd4082b029.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
        small_image:
          'https://i5.walmartimages.com/asr/c2229311-144e-4ad5-96f1-c54656b7f2f8.42b7526eadae9c264dddd8cd4082b029.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF',
      },
      {
        key: 4,
        id: 6013800,
        image:
          'https://i5.walmartimages.com/asr/a40f3414-fa8d-4746-a9b2-5e38567ef75c.aa1e20fabc0ecc811e5fde6a4561b8fe.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
        small_image:
          'https://i5.walmartimages.com/asr/a40f3414-fa8d-4746-a9b2-5e38567ef75c.aa1e20fabc0ecc811e5fde6a4561b8fe.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF',
      },
      {
        key: 5,
        id: 6013801,
        image:
          'https://i5.walmartimages.com/asr/6bdb26b0-3a74-49d3-b808-aa2ae2af3201.bea23e60c19ecff217008b7a86afded8.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
        small_image:
          'https://i5.walmartimages.com/asr/6bdb26b0-3a74-49d3-b808-aa2ae2af3201.bea23e60c19ecff217008b7a86afded8.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF',
      },
      {
        key: 6,
        id: 6013802,
        image:
          'https://i5.walmartimages.com/asr/5fbe88a0-3c89-43c2-8d85-3df3b761087a.b4b27cc1e6f9c4635cef882ef9a1a149.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
        small_image:
          'https://i5.walmartimages.com/asr/5fbe88a0-3c89-43c2-8d85-3df3b761087a.b4b27cc1e6f9c4635cef882ef9a1a149.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF',
      },
      {
        key: 7,
        id: 6013803,
        image:
          'https://i5.walmartimages.com/asr/af6365d9-4f5d-4be8-a880-c0f967cae1b9.174b2588263fd32a55c7e9e4bb89daa8.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
        small_image:
          'https://i5.walmartimages.com/asr/af6365d9-4f5d-4be8-a880-c0f967cae1b9.174b2588263fd32a55c7e9e4bb89daa8.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF',
      },
      {
        key: 8,
        id: 6013804,
        image:
          'https://i5.walmartimages.com/asr/fab9b58a-3d9c-4d83-81a4-b2040eb881a9.ae23126e33368fc5fad7aa71beb27380.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
        small_image:
          'https://i5.walmartimages.com/asr/fab9b58a-3d9c-4d83-81a4-b2040eb881a9.ae23126e33368fc5fad7aa71beb27380.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF',
      },
      {
        key: 9,
        id: 6013805,
        image:
          'https://i5.walmartimages.com/asr/a33ff975-8193-4b29-8bd6-f7ccc64a9f08.cafc7dbe4a6abf20e6358c8a8f454c2e.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
        small_image:
          'https://i5.walmartimages.com/asr/a33ff975-8193-4b29-8bd6-f7ccc64a9f08.cafc7dbe4a6abf20e6358c8a8f454c2e.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF',
      },
      {
        key: 10,
        id: 6013806,
        image:
          'https://i5.walmartimages.com/asr/28d9c2f3-d64f-42c5-8b22-39447f18abf8.773329304611a4bfca307281e7e0ec0e.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
        small_image:
          'https://i5.walmartimages.com/asr/28d9c2f3-d64f-42c5-8b22-39447f18abf8.773329304611a4bfca307281e7e0ec0e.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF',
      },
      {
        key: 11,
        id: 6013807,
        image:
          'https://i5.walmartimages.com/asr/bfe1340c-4065-4b5a-b9f6-9e9880a7c4cb.4b3beddd0244c94294f277753fe03374.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
        small_image:
          'https://i5.walmartimages.com/asr/bfe1340c-4065-4b5a-b9f6-9e9880a7c4cb.4b3beddd0244c94294f277753fe03374.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF',
      },
      {
        key: 12,
        id: 6013808,
        image:
          'https://i5.walmartimages.com/asr/dff9f550-9b04-434f-84bf-175986561e47.cea1df30fa328861fc7d06cbac75592b.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
        small_image:
          'https://i5.walmartimages.com/asr/dff9f550-9b04-434f-84bf-175986561e47.cea1df30fa328861fc7d06cbac75592b.jpeg?odnHeight=180&odnWidth=180&odnBg=FFFFFF',
      },
    ],
    points_earned: 167,
    points_earned_in_dollars_formatted: 'BZD $1.67',
    preorder_chart: [
      { name: 'Deadline to order', value: 'February 28' },
      { name: 'Initial payment due', value: 'BZD $33.95' },
      { name: 'Arrival date', value: 'April 1' },
      { name: 'Remaining payment due', value: 'BZD $33.00' },
    ],
    share_text:
      'Check out this Beautlace Valentines Day Gifts For Her, 925 Sterli... at https://vshop.bz/item/3007399',
    share_link: 'https://vshop.bz/item/3007399',
    out_of_stock: null,
  },
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function searchCatalog(params: {
  q?: string
  min?: number
  max?: number
  sort?: 'relevance' | 'price_asc' | 'price_desc'
}): CatalogItem[] {
  const q = normalize(params.q ?? '')
  const tokens = q.length ? q.split(' ') : []

  const filtered = CATALOG.filter((it) => {
    const p = it.price.value
    if (typeof params.min === 'number' && p < params.min) return false
    if (typeof params.max === 'number' && p > params.max) return false

    if (!tokens.length) return true
    const hay = normalize(it.title)

    // More forgiving matching: include if at least one token matches.
    // This makes search feel "alive" even with partial inputs.
    return tokens.some((t) => {
      if (!t) return false
      if (hay.includes(t)) return true
      // tiny prefix help (e.g. "neckl" matches "necklace")
      if (t.length >= 4 && hay.includes(t.slice(0, 4))) return true
      return false
    })
  })

  if ((params.sort ?? 'relevance') === 'price_asc') {
    return [...filtered].sort((a, b) => a.price.value - b.price.value)
  }
  if ((params.sort ?? 'relevance') === 'price_desc') {
    return [...filtered].sort((a, b) => b.price.value - a.price.value)
  }

  // crude relevance score: match count + token position bonus
  const scored = filtered
    .map((it) => {
      const hay = normalize(it.title)
      let score = 0
      for (const t of tokens) {
        const idx = hay.indexOf(t)
        if (idx >= 0) score += 10
        if (idx === 0) score += 5
        if (idx < 0 && t.length >= 4) {
          const pIdx = hay.indexOf(t.slice(0, 4))
          if (pIdx >= 0) score += 4
        }
      }
      return { it, score }
    })
    .sort((a, b) => b.score - a.score || a.it.price.value - b.it.price.value)

  return scored.map((s) => s.it)
}

export function getItemDetail(id: number): ItemDetail | null {
  const fromDetails = ITEM_DETAILS[id]
  if (fromDetails) return fromDetails

  const base = CATALOG.find((x) => x.id === id)
  if (!base) return null

  return {
    ...base,
    images: [{ key: 1, id: id * 10 + 1, image: base.image.replace('odnHeight=180', 'odnHeight=450').replace('odnWidth=180', 'odnWidth=450'), small_image: base.image }],
    current_image: id * 10 + 1,
    points_earned: Math.max(10, Math.round(base.price.value * 2.5)),
    points_earned_in_dollars_formatted: money(base.price.value * 0.025).formatted,
    preorder_chart: [
      { name: 'Deadline to order', value: 'Next Friday' },
      { name: 'Initial payment due', value: money(base.price.value / 2).formatted },
      { name: 'Arrival date', value: 'In ~4–6 weeks' },
      { name: 'Remaining payment due', value: money(base.price.value / 2).formatted },
    ],
    share_text: `Check out this ${base.title.slice(0, 42)}...`,
    share_link: `/item/${id}`,
    out_of_stock: null,
  }
}
