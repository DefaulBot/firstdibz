-- Firs' Dibs BZ Database Schema
-- Supabase PostgreSQL Database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email varchar(255) UNIQUE,
  display_name varchar(255),
  is_admin boolean DEFAULT false,
  points integer DEFAULT 0,
  
  -- User information fields for preorders
  first_name varchar(255),
  last_name varchar(255),
  phone_number varchar(20),
  street_address varchar(500),
  city varchar(255),
  state_province varchar(255),
  postal_code varchar(20),
  country varchar(255),
  
  created_at timestamp with time zone DEFAULT NOW(),
  updated_at timestamp with time zone DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_is_admin ON public.profiles(is_admin);

-- ============================================
-- PRODUCTS TABLE (for local storage)
-- ============================================
CREATE TABLE IF NOT EXISTS public.products (
  id integer PRIMARY KEY,
  title varchar(500) NOT NULL,
  price numeric(10,2) NOT NULL,
  original_price numeric(10,2),
  discount varchar(50),
  image text,
  only_left_in_stock integer,
  new_arrival boolean DEFAULT false,
  out_of_stock boolean DEFAULT false,
  points_earned integer,
  points_earned_dollars numeric(10,2),
  share_text text,
  share_link text,
  current_image integer,
  
  created_at timestamp with time zone DEFAULT NOW(),
  updated_at timestamp with time zone DEFAULT NOW()
);

-- Create indexes for products
CREATE INDEX idx_products_title ON public.products USING gin(to_tsvector('english', title));
CREATE INDEX idx_products_price ON public.products(price);
CREATE INDEX idx_products_out_of_stock ON public.products(out_of_stock);

-- ============================================
-- PRODUCT_IMAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.product_images (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  product_id integer NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  "key" integer,
  image text NOT NULL,
  small_image text NOT NULL,
  
  created_at timestamp with time zone DEFAULT NOW()
);

CREATE INDEX idx_product_images_product_id ON public.product_images(product_id);

-- ============================================
-- PRODUCT_PREORDER_CHART TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.product_preorder_chart (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  product_id integer NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name varchar(255) NOT NULL,
  value text NOT NULL,
  sort_order integer DEFAULT 0,
  
  created_at timestamp with time zone DEFAULT NOW()
);

CREATE INDEX idx_preorder_chart_product_id ON public.product_preorder_chart(product_id);

-- ============================================
-- ORDERS TABLE (Preorders)
-- ============================================
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id integer NOT NULL,  -- No foreign key constraint to allow external APIs
  quantity integer NOT NULL DEFAULT 1,
  
  -- Pricing fields (calculated server-side)
  total_amount numeric(10,2),
  deposit_amount numeric(10,2),
  balance_amount numeric(10,2),
  amount_paid numeric(10,2) DEFAULT 0,
  
  -- Status and metadata
  status varchar(50) DEFAULT 'preorder',
  points_earned integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT NOW(),
  updated_at timestamp with time zone DEFAULT NOW()
);

-- Create indexes for orders
CREATE UNIQUE INDEX idx_orders_user_product ON public.orders(user_id, product_id);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_product_id ON public.orders(product_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);

-- ============================================
-- ORDER_PAYMENTS TABLE (Payment History)
-- ============================================
CREATE TABLE IF NOT EXISTS public.order_payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL,
  method varchar(50),
  note text,
  
  created_at timestamp with time zone DEFAULT NOW()
);

CREATE INDEX idx_order_payments_user_id ON public.order_payments(user_id);
CREATE INDEX idx_order_payments_order_id ON public.order_payments(order_id);
CREATE INDEX idx_order_payments_created_at ON public.order_payments(created_at);

-- ============================================
-- CART TABLE (Shopping Cart)
-- ============================================
CREATE TABLE IF NOT EXISTS public.cart (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id integer NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  
  -- Store product snapshot for consistency
  product_title varchar(500),
  product_price numeric(10,2),
  product_image text,
  
  created_at timestamp with time zone DEFAULT NOW(),
  updated_at timestamp with time zone DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_cart_user_product ON public.cart(user_id, product_id);
CREATE INDEX idx_cart_user_id ON public.cart(user_id);

-- ============================================
-- SAVED_ITEMS TABLE (Wishlist/Favorites)
-- ============================================
CREATE TABLE IF NOT EXISTS public.saved_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id integer NOT NULL,
  
  created_at timestamp with time zone DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_saved_items_user_product ON public.saved_items(user_id, product_id);
CREATE INDEX idx_saved_items_user_id ON public.saved_items(user_id);

-- ============================================
-- TRIGGER FUNCTIONS
-- ============================================

-- Function to populate order fields
CREATE OR REPLACE FUNCTION public.populate_order_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  per_unit_deposit numeric(10,2);
  p_price numeric(10,2);
  p_points integer;
BEGIN
  -- Ensure quantity is valid
  IF new.quantity IS NULL OR new.quantity < 1 THEN
    new.quantity := 1;
  END IF;

  -- If amounts are not provided, try to look up from products table
  IF new.total_amount IS NULL OR new.total_amount = 0 THEN
    -- Try to get product price if it exists in our products table
    SELECT price, COALESCE(points_earned, GREATEST(10, ROUND(price * 2.5)::int))
    INTO p_price, p_points
    FROM public.products
    WHERE id = new.product_id;

    IF p_price IS NOT NULL THEN
      per_unit_deposit := ROUND(p_price / 2, 2);
      new.total_amount := ROUND(p_price * new.quantity, 2);
      new.deposit_amount := ROUND(per_unit_deposit * new.quantity, 2);
      new.balance_amount := ROUND((p_price - per_unit_deposit) * new.quantity, 2);
      new.points_earned := p_points * new.quantity;
    END IF;
  END IF;

  RETURN new;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS orders_populate_fields ON public.orders;
CREATE TRIGGER orders_populate_fields
BEFORE INSERT ON public.orders
FOR EACH ROW EXECUTE PROCEDURE public.populate_order_fields();

-- Function to update cart timestamp
CREATE OR REPLACE FUNCTION public.update_cart_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  new.updated_at := NOW();
  RETURN new;
END;
$$;

-- Create cart update trigger
DROP TRIGGER IF EXISTS cart_update_timestamp ON public.cart;
CREATE TRIGGER cart_update_timestamp
BEFORE UPDATE ON public.cart
FOR EACH ROW EXECUTE PROCEDURE public.update_cart_timestamp();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_preorder_chart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated users to insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow public read access to products" ON public.products;
DROP POLICY IF EXISTS "Allow public read access to product_images" ON public.product_images;
DROP POLICY IF EXISTS "Allow public read access to product_preorder_chart" ON public.product_preorder_chart;
DROP POLICY IF EXISTS "Allow users to read their own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow users to insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow users to update their own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow admins to read all orders" ON public.orders;
DROP POLICY IF EXISTS "Allow admins to update all orders" ON public.orders;
DROP POLICY IF EXISTS "Allow users to read their own cart" ON public.cart;
DROP POLICY IF EXISTS "Allow users to insert items in their cart" ON public.cart;
DROP POLICY IF EXISTS "Allow users to update their cart" ON public.cart;
DROP POLICY IF EXISTS "Allow users to delete from their cart" ON public.cart;
DROP POLICY IF EXISTS "Allow users to read their own saved items" ON public.saved_items;
DROP POLICY IF EXISTS "Allow users to insert saved items" ON public.saved_items;
DROP POLICY IF EXISTS "Allow users to delete saved items" ON public.saved_items;

-- Profiles: Users can read all profiles, insert/update their own
CREATE POLICY "profiles_select_policy"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "profiles_insert_policy"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Products: Public read access
CREATE POLICY "products_select_policy"
  ON public.products FOR SELECT
  USING (true);

-- Product Images: Public read access
CREATE POLICY "product_images_select_policy"
  ON public.product_images FOR SELECT
  USING (true);

-- Product Preorder Chart: Public read access
CREATE POLICY "product_preorder_chart_select_policy"
  ON public.product_preorder_chart FOR SELECT
  USING (true);

-- Orders: Users can access their own orders, admins can access all
CREATE POLICY "orders_select_own_policy"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "orders_select_admin_policy"
  ON public.orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "orders_insert_policy"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders_update_own_policy"
  ON public.orders FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders_update_admin_policy"
  ON public.orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Order Payments: Users can view their own payments, admins can view all
CREATE POLICY "order_payments_select_own_policy"
  ON public.order_payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "order_payments_select_admin_policy"
  ON public.order_payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "order_payments_insert_policy"
  ON public.order_payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "order_payments_update_admin_policy"
  ON public.order_payments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Cart: Users can manage their own cart
CREATE POLICY "cart_select_policy"
  ON public.cart FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "cart_insert_policy"
  ON public.cart FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cart_update_policy"
  ON public.cart FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cart_delete_policy"
  ON public.cart FOR DELETE
  USING (auth.uid() = user_id);

-- Saved Items: Users can manage their own saved items
CREATE POLICY "saved_items_select_policy"
  ON public.saved_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "saved_items_insert_policy"
  ON public.saved_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_items_delete_policy"
  ON public.saved_items FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- GRANTS
-- ============================================

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.products TO authenticated;
GRANT SELECT ON public.product_images TO authenticated;
GRANT SELECT ON public.product_preorder_chart TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.order_payments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.saved_items TO authenticated;

-- Grant permissions to anonymous users (read-only)
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.product_images TO anon;
GRANT SELECT ON public.product_preorder_chart TO anon;
