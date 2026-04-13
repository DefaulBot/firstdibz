-- Firs' Dibs BZ Database - Drop All Previous Schema
-- Use this to completely reset the database before applying the new schema

-- Drop all triggers first
DROP TRIGGER IF EXISTS orders_populate_fields ON public.orders;
DROP TRIGGER IF EXISTS cart_update_timestamp ON public.cart;

-- Drop all trigger functions
DROP FUNCTION IF EXISTS public.populate_order_fields();
DROP FUNCTION IF EXISTS public.update_cart_timestamp();

-- Drop all tables (in order to respect foreign key constraints)
DROP TABLE IF EXISTS public.product_preorder_chart CASCADE;
DROP TABLE IF EXISTS public.product_images CASCADE;
DROP TABLE IF EXISTS public.saved_items CASCADE;
DROP TABLE IF EXISTS public.cart CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop extensions (optional - usually safe to leave)
-- DROP EXTENSION IF EXISTS "uuid-ossp";
-- DROP EXTENSION IF EXISTS "pgcrypto";
