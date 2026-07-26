import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { rental_id } = await req.json();

    if (!rental_id) {
      return NextResponse.json(
        { error: "Missing rental_id" },
        { status: 400 }
      );
    }

    // ดึงข้อมูลรายการเช่า
    const { data: rental, error: rentalError } = await supabase
      .from("rentals")
      .select("*")
      .eq("id", rental_id)
      .single();

    if (rentalError || !rental) {
      return NextResponse.json(
        { error: "Rental not found" },
        { status: 404 }
      );
    }

    if (rental.status === "Returned") {
      return NextResponse.json(
        { error: "Already returned" },
        { status: 400 }
      );
    }

    // ดึงข้อมูลอุปกรณ์
    const { data: equipment, error: equipmentError } = await supabase
      .from("equipment")
      .select("*")
      .eq("id", rental.equipment_id)
      .single();

    if (equipmentError || !equipment) {
      return NextResponse.json(
        { error: "Equipment not found" },
        { status: 404 }
      );
    }

    // เพิ่มจำนวนของกลับเข้า Stock
    const { error: stockError } = await supabase
      .from("equipment")
      .update({
        available: equipment.available + rental.quantity,
      })
      .eq("id", equipment.id);

    if (stockError) {
      return NextResponse.json(
        { error: stockError.message },
        { status: 500 }
      );
    }

    // เปลี่ยนสถานะเป็น Returned
    const { error: updateError } = await supabase
  .from("rentals")
  .update({
    status: "Returned",
  })
  .eq("id", rental_id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Equipment returned successfully",
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error", details: err },
      { status: 500 }
    );
  }
}