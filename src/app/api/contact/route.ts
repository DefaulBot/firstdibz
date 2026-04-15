import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const body = await req.json();

    const { firstName, lastName, email, phone, message } = body as {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      message?: string;
    };

    // Validate required fields
    if (
      !firstName?.trim() ||
      !lastName?.trim() ||
      !email?.trim() ||
      !message?.trim()
    ) {
      return NextResponse.json(
        { error: "First name, last name, email, and message are required." },
        { status: 400 },
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    // Insert into contact_messages table
    const { error } = await supabase.from("contact_messages").insert({
      first_name: firstName.trim().slice(0, 255),
      last_name: lastName.trim().slice(0, 255),
      email: email.trim().toLowerCase().slice(0, 255),
      phone: phone?.trim().slice(0, 20) || null,
      message: message.trim().slice(0, 5000),
    });

    if (error) {
      console.error("contact_messages insert error:", error);
      return NextResponse.json(
        { error: "Failed to save your message. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}
