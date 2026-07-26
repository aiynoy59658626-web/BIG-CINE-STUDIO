import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      company_name,
      contact_name,
      phone,
      email,
      address,
    } = body;

    const { data, error } = await supabase
      .from("customers")
      .insert([
        {
          company_name,
          contact_name,
          phone,
          email,
          address,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
} 