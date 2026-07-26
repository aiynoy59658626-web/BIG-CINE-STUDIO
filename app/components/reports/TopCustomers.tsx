"use client";

type TopCustomerItem = {
  customer_name: string;
  rentals: number;
  total: number;
};

type TopCustomersProps = {
  data: TopCustomerItem[];
};

export default function TopCustomers({
  data,
}: TopCustomersProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-5 text-2xl font-bold">
        👥 ลูกค้าที่ใช้บริการมากที่สุด
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-500">
          ไม่มีข้อมูลลูกค้า
        </p>
      ) : (
        <div className="space-y-4">
          {data.map((customer, index) => (
            <div
              key={customer.customer_name}
              className="flex items-center justify-between rounded-xl border p-4 hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 font-bold text-white">
                  {index + 1}
                </div>

                <div>
                  <p className="font-semibold">
                    {customer.customer_name}
                  </p>

                  <p className="text-sm text-gray-500">
                    เช่า {customer.rentals} ครั้ง
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold text-green-600">
                  ${customer.total.toLocaleString()}
                </p>

                <p className="text-sm text-gray-500">
                  รายได้รวม
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}