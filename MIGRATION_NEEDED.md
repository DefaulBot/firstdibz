# Migration Instructions

You need to run this SQL in your Supabase dashboard to remove the product foreign key constraint:

## Steps:

1. Go to https://app.supabase.com
2. Select your project
3. Go to SQL Editor
4. Create a new query
5. Copy and paste the following SQL:

```sql
-- Drop the old trigger
DROP TRIGGER IF EXISTS orders_populate_fields ON public.orders;

-- Drop the foreign key constraint on product_id
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_product_id_fkey;

-- Update the trigger to handle missing products gracefully
CREATE OR REPLACE FUNCTION public.populate_order_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  per_unit_deposit numeric(10,2);
BEGIN
  -- Ensure quantity is valid
  IF new.quantity IS NULL OR new.quantity < 1 THEN
    new.quantity := 1;
  END IF;

  -- If amounts are not provided, try to look up from products table
  -- Otherwise use the provided values
  IF new.total_amount IS NULL OR new.total_amount = 0 THEN
    DECLARE
      p_price numeric(10,2);
      p_points int;
    BEGIN
      -- Try to get product price if it exists
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
    END;
  END IF;

  RETURN new;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER orders_populate_fields
BEFORE INSERT ON public.orders
FOR EACH ROW EXECUTE PROCEDURE public.populate_order_fields();
```

6. Click "Run" to execute the migration
7. You should see "Success" message

## What this does:

- Removes the foreign key constraint that required products to exist in Supabase
- Updates the trigger to accept pre-calculated order amounts from the client
- The trigger will use product data if it exists, but won't fail if it doesn't

This allows you to use external product APIs (like VShop) while only storing orders in Supabase.
