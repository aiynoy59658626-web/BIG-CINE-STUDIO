"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Rental = {
  id: number;
  customer_name: string;
  quantity: number;
  rent_date: string;
  return_date: string;
  total_price: number;
  status: string;
  equipment: {
    name: string;
    brand: string | null;
  };
};

export default function CurrentRentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadRentals();
  }, []);

  async function loadRentals() {
    setLoading(true);

    const { data, error } = await supabase
      .from("rentals")
      .select(`
        id,
        customer_name,
        quantity,
        rent_date,
        return_date,
        total_price,
        status,
        equipment:equipment_id (
          name,
          brand
        )
      `)
      .eq("status", "Rented")
      .order("rent_date", { ascending: false });

    if (!error && data) {
      setRentals(data as unknown as Rental[]);
    }

    setLoading(false);
  }

  async function handleReturn(rentalId: number) {
    const ok = confirm("ยืนยันการคืนอุปกรณ์?");

    if (!ok) return;

    setReturningId(rentalId);

    try {
      const res = await fetch("/api/return", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rental_id: rentalId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "คืนอุปกรณ์ไม่สำเร็จ");
        return;
      }

      alert("คืนอุปกรณ์เรียบร้อยแล้ว");

      await loadRentals();
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setReturningId(null);
    }
  }

  function isOverdue(returnDate: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(returnDate);
    due.setHours(0, 0, 0, 0);

    return due < today;
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        กำลังโหลด...
      </main>
    );
  }

  const filteredRentals = rentals.filter((rental) => {
    const keyword = search.toLowerCase();

    return (
      rental.customer_name.toLowerCase().includes(keyword) ||
      rental.equipment.name.toLowerCase().includes(keyword)
    );
  });

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">
          รายการเช่าปัจจุบัน
        </h1>

        <input
          type="text"
          placeholder="🔍 ค้นหาลูกค้าหรืออุปกรณ์..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-6 w-full rounded-lg border p-3"
        />

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">อุปกรณ์</th>
                <th className="border p-3 text-left">ลูกค้า</th>
                <th className="border p-3 text-center">จำนวน</th>
                <th className="border p-3 text-center">วันที่เช่า</th>
                <th className="border p-3 text-center">กำหนดคืน</th>
                <th className="border p-3 text-center">ยอดเงิน</th>
                <th className="border p-3 text-center">สถานะ</th>
                <th className="border p-3 text-center">จัดการ</th>
              </tr>
            </thead>

            <tbody>
              {filteredRentals.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="border p-6 text-center"
                  >
                    ไม่พบรายการเช่า
                  </td>
                </tr>
              ) : (
                filteredRentals.map((rental) => (
                  <tr key={rental.id}>
                    <td className="border p-3">
                      {rental.equipment?.name}
                    </td>

                    <td className="border p-3">
                      {rental.customer_name}
                    </td>

                    <td className="border p-3 text-center">
                      {rental.quantity}
                    </td>

                    <td className="border p-3 text-center">
                      {rental.rent_date}
                    </td>

                    <td className="border p-3 text-center">
                      {rental.return_date}
                    </td>

                    <td className="border p-3 text-center">
                      ${rental.total_price}
                    </td>

                    <td className="border p-3 text-center">
                      {isOverdue(rental.return_date) ? (
                        <span className="rounded-full bg-red-100 px-3 py-1 font-medium text-red-700">
                          🔴 เกินกำหนด
                        </span>
                      ) : (
                        <span className="rounded-full bg-green-100 px-3 py-1 font-medium text-green-700">
                          🟢 กำลังเช่า
                        </span>
                      )}
                    </td>

                    <td className="border p-3 text-center">
                      <button
                        onClick={() => handleReturn(rental.id)}
                        disabled={returningId === rental.id}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
                      >
                        {returningId === rental.id
                          ? "กำลังคืน..."
                          : "คืนอุปกรณ์"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>
    </main>
  );
}