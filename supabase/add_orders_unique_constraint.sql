-- Migration: Add unique constraint on orders(user_id, product_id)
-- This allows upsert operations in CartPageClient.tsx to work properly

-- Drop existing index if it exists (for idempotency)
DROP INDEX IF EXISTS idx_orders_user_product;

-- Create the unique index
CREATE UNIQUE INDEX idx_orders_user_product ON public.orders(user_id, product_id);
