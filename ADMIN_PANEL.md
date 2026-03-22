# Admin Panel Documentation

## Overview

The admin panel is a comprehensive dashboard for managing pre-orders, tracking revenue, and monitoring customer data. Only users with `is_admin = true` in their profile can access it.

## Features

### 📊 Dashboard Statistics

- **Total Orders**: Count of all pre-orders
- **Total Revenue**: Sum of all order amounts
- **Amount Paid**: Total amount already received from customers
- **Pending Orders**: Count of orders still waiting for payment
- **Average Order Value**: Mean order amount

### 🔍 Pre-Order Management

- **Search Functionality**: Search by customer email, name, product title, or order ID
- **Status Filtering**: Filter orders by status (All, Preorder, Paid, Cancelled)
- **Smart Sorting**: Sort by most recent or highest amount
- **Order Details**: View each order with:
  - Product image and title
  - Customer information
  - Order date
  - Payment status with due amount
  - Points earned
  - Action buttons (Edit, Details)

## Setup Instructions

### 1. Update Database Schema

First, ensure the `is_admin` field is added to the `profiles` table:

```sql
ALTER TABLE public.profiles
ADD COLUMN is_admin boolean NOT NULL DEFAULT false;
```

Or run the updated schema:

```bash
# In Supabase SQL Editor, run supabase/schema.sql
```

### 2. Assign Admin Status

To make a user an admin, run this SQL query in your Supabase SQL Editor:

```sql
UPDATE public.profiles
SET is_admin = true
WHERE email = 'admin@example.com';
```

### 3. Access the Admin Panel

1. Sign in with an admin account
2. Click the "Admin" link in the header (only visible to admins)
3. You'll be redirected to `/admin`

## File Structure

```
src/
├── app/
│   └── admin/
│       └── page.tsx          # Main admin panel page
├── components/
│   └── Header.tsx            # Updated with admin link
└── lib/
    └── admin-utils.ts        # Admin utility functions
supabase/
└── schema.sql               # Updated with is_admin field
```

## Security

- **Role-Based Access**: Only authenticated users with `is_admin = true` can view the admin panel
- **Server-Side Validation**: The panel checks admin status on load
- **Error Handling**: Non-admins receive a clear "Access Denied" message

## UI Components Used

The admin panel uses the existing design system:

- **Button**: Primary, secondary, and ghost variants
- **Badge**: Status indicators with color coding
- **Input**: Search and filter inputs
- **Colors**: Blue (#0f2f63) for primary actions, emerald/green for success states, amber for warnings

## Status Colors

- **Preorder** (Amber): Order pending initial payment
- **Paid** (Green): Order fully paid
- **Cancelled** (Red): Order cancelled

## API Integration

The admin panel queries:

- `profiles` table: Get admin status and user info
- `orders` table: Fetch all orders with related data
- `products` table: Product details (via junction)
- `order_payments` table: Payment history (for future enhancements)

## Future Enhancements

Potential features to add:

- [ ] Edit order details
- [ ] Mark orders as paid/cancelled
- [ ] Export data to CSV
- [ ] Detailed order view modal
- [ ] Customer management
- [ ] Payment processing dashboard
- [ ] Analytics and charts
- [ ] Bulk actions

## Troubleshooting

### Admin link not showing

- Verify the user has `is_admin = true` in the database
- Sign out and sign back in to refresh the admin status

### "Access Denied" error

- Check that your user ID matches the profile in the database
- Ensure `is_admin` column exists in the profiles table

### Orders not loading

- Check that Supabase credentials are properly set in `.env.local`
- Verify the orders table has data and proper relationships
