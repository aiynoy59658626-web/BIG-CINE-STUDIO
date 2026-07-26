import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      equipment_id,
      customer_name,
      quantity,
      rent_date,
      return_date,
      notes,
    } = body;

    if (
      !equipment_id ||
      !customer_name ||
      !quantity ||
      !rent_date ||
      !return_date
    ) {
      return NextResponse.json(
        { error: "Please fill all required fields." },
        { status: 400 }
      );
    }

    const { data: equipment, error: equipmentError } = await supabase
      .from("equipment")
      .select("*")
      .eq("id", equipment_id)
      .single();

    if (equipmentError || !equipment) {
      return NextResponse.json(
        { error: "Equipment not found." },
        { status: 404 }
      );
    }

    if (equipment.available < Number(quantity)) {
      return NextResponse.json(
        { error: "Not enough equipment available." },
        { status: 400 }
      );
    }

    const start = new Date(rent_date);
    const end = new Date(return_date);

    const rental_days =
      Math.ceil(
        (end.getTime() - start.getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    if (rental_days <= 0) {
      return NextResponse.json(
        { error: "Return date is invalid." },
        { status: 400 }
      );
    }

    const price_per_day = Number(equipment.price);

    const total_price =
      price_per_day *
      Number(quantity) *
      rental_days;

    const { error: rentError } = await supabase
      .from("rentals")
      .insert([
        {
          equipment_id,
          customer_name,
          quantity: Number(quantity),
          rent_date,
          return_date,
          rental_days,
          price_per_day,
          total_price,
          notes,
          status: "Rented",
        },
      ]);

    if (rentError) {
      return NextResponse.json(
        { error: rentError.message },
        { status: 500 }
      );
    }

    const { error: updateError } = await supabase
      .from("equipment")
      .update({
        available:
          equipment.available - Number(quantity),
      })
      .eq("id", equipment_id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}