"use client";

type Rental = {
  id: number;
  customer_name: string;
  equipment_name: string;
  quantity: number;
  total_price: number;
  status: string;
};

type RecentRentalsProps = {
  data: Rental[];
};

export default function RecentRentals({
  data,
}: RecentRentalsProps) {
  return (
    <div className="mt-8 rounded-2xl bg-white shadow">
      <div className="border-b p-6">
        <h2 className="text-2xl font-bold">
          📋 รายการเช่าล่าสุด
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">ลูกค้า</th>
              <th className="text-left">อุปกรณ์</th>
              <th className="text-center">จำนวน</th>
              <th className="text-center">ยอดเงิน</th>
              <th className="text-center">สถานะ</th>
            </tr>
          </thead>

          <tbody>

            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-gray-500"
                >
                  ไม่มีประวัติการเช่า
                </td>
              </tr>
            ) : (
              data.map((rental) => (
                <tr
                  key={rental.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4 font-medium">
                    {rental.customer_name}
                  </td>

                  <td>
                    {rental.equipment_name}
                  </td>

                  <td className="text-center">
                    {rental.quantity}
                  </td>

                  <td className="text-center font-semibold text-green-600">
                    ${Number(rental.total_price).toLocaleString()}
                  </td>

                  <td className="text-center">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        rental.status === "Returned"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {rental.status === "Returned"
                        ? "คืนแล้ว"
                        : "กำลังเช่า"}
                    </span>
                  </td>
                </tr>
              ))
            )}

          </tbody>

        </table>
      </div>
    </div>
  );
}