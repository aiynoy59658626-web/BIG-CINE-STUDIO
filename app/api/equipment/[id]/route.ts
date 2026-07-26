import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// =========================
// GET Equipment by ID
// =========================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("equipment")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

// =========================
// UPDATE Equipment by ID
// =========================
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const {
    name,
    brand,
    category,
    total,
    available,
    price,
    image_url,
  } = body;

  const { data, error } = await supabase
    .from("equipment")
    .update({
      name,
      brand,
      category,
      total,
      available,
      price,
      image_url,
    })
    .eq("id", Number(id))
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}