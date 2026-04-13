import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Create orders from cart items
    const orders = items.map((item: any) => {
      const total_amount = roundMoney(
        (item.product_price || 0) * item.quantity,
      );
      const deposit_amount = roundMoney(total_amount / 2);
      const balance_amount = roundMoney(total_amount - deposit_amount);
      const points_earned = Math.max(10, Math.round(total_amount * 2.5));

      return {
        user_id: user.id,
        product_id: item.product_id,
        quantity: item.quantity,
        total_amount,
        deposit_amount,
        balance_amount,
        amount_paid: 0,
        status: "preorder",
        points_earned,
      };
    });

    // Insert orders
    const { data: createdOrders, error: insertError } = await supabase
      .from("orders")
      .insert(orders)
      .select();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Clear user's cart
    const { error: deleteError } = await supabase
      .from("cart")
      .delete()
      .eq("user_id", user.id);

    if (deleteError) {
      // Log but don't fail if cart deletion fails
      console.error("Failed to clear cart:", deleteError);
    }

    return NextResponse.json(
      {
        success: true,
        orders: createdOrders,
        message: "Preorders created successfully",
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
