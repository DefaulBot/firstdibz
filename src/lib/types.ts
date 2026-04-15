export type Money = {
  formatted: string;
  value: number;
};

export type CatalogItem = {
  id: number;
  title: string;
  price: Money;
  originalPrice?: Money | null;
  discount?: string | null;
  image: string;
  onlyLeftInStock?: number | null;
  newArrival?: boolean | null;
};

export type PreorderChartRow = {
  name: string;
  value: string;
};

export type ItemDetail = CatalogItem & {
  images?: Array<{
    id: number;
    key: number;
    image: string;
    small_image: string;
  }>;
  current_image?: number;
  points_earned?: number;
  points_earned_in_dollars_formatted?: string;
  preorder_chart?: PreorderChartRow[];
  share_text?: string;
  share_link?: string;
  out_of_stock?: boolean | null;
  // Variation options from VShop
  variation_id?: number;
  variation?: string;
  variation_array?: Array<{
    key: number;
    id: number;
    title: string;
    color_url?: string;
    not_available?: boolean | null;
  }>;
  has_variation_color_url?: boolean;
  variation2_id?: number;
  variation2?: string;
  variation2_array?: Array<{
    key: number;
    id: number;
    title: string;
    not_available?: boolean | null;
  }>;
};

export type OrderStatus = "preorder" | "paid" | "cancelled";

export type ProfileSummary = {
  email: string | null;
  display_name: string | null;
  phone_number: string | null;
};

export type ProductSummary = {
  id: number;
  title: string;
  image: string | null;
  price: number | null;
};

export type OrdersQueryRow = {
  id: string;
  status: OrderStatus;
  product_id: number | string;
  quantity: number | string;
  total_amount: number | string | null;
  deposit_amount: number | string | null;
  balance_amount: number | string | null;
  amount_paid: number | string | null;
  points_earned: number | string | null;
  created_at: string;
  user_id: string;
  profiles: ProfileSummary | null;
};

export type OrderRow = {
  id: string;
  status: OrderStatus;
  product_id: number;
  quantity: number;
  total_amount: number;
  deposit_amount: number;
  balance_amount: number;
  amount_paid: number;
  points_earned: number;
  created_at: string;
  user_id: string;
  profiles: ProfileSummary | null;
  products: ProductSummary | null;
};
