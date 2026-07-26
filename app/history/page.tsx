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
  equipment:
    | {
        name: string;
        brand: string;
      }
    | {
        name: string;
        brand: string;
      }[]
    | null;
};

export default function RentalHistoryPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
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
      .eq("status", "Returned")
      .order("rent_date", { ascending: false });

    if (!error && data) {
      setRentals(data as unknown as Rental[]);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        กำลังโหลด...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">ประวัติการเช่า</h1>

        <span className="text-gray-500">
          ทั้งหมด {rentals.length} รายการ
        </span>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">อุปกรณ์</th>
              <th className="p-3 text-left">ลูกค้า</th>
              <th className="p-3 text-center">จำนวน</th>
              <th className="p-3 text-center">วันที่เช่า</th>
              <th className="p-3 text-center">วันที่คืน</th>
              <th className="p-3 text-center">ยอดเงิน</th>
              <th className="p-3 text-center">สถานะ</th>
            </tr>
          </thead>

          <tbody>
            {rentals.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center">
                  ไม่มีประวัติการเช่า
                </td>
              </tr>
            ) : (
              rentals.map((rental) => {
                const equipment = Array.isArray(rental.equipment)
                  ? rental.equipment[0]
                  : rental.equipment;

                return (
                  <tr key={rental.id} className="border-t">
                    <td className="p-3">
                      <div className="font-semibold">
                        {equipment?.name ?? "-"}
                      </div>

                      <div className="text-sm text-gray-500">
                        {equipment?.brand ?? "-"}
                      </div>
                    </td>

                    <td className="p-3">{rental.customer_name}</td>

                    <td className="p-3 text-center">
                      {rental.quantity}
                    </td>

                    <td className="p-3 text-center">
                      {rental.rent_date}
                    </td>

                    <td className="p-3 text-center">
                      {rental.return_date}
                    </td>

                    <td className="p-3 text-center">
                      ${rental.total_price}
                    </td>

                    <td className="p-3 text-center">
                      {rental.status === "Returned" ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                          คืนแล้ว
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
                          กำลังเช่า
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}