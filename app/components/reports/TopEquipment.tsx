"use client";

type TopEquipmentItem = {
  name: string;
  rentals: number;
};

type TopEquipmentProps = {
  data: TopEquipmentItem[];
};

export default function TopEquipment({
  data,
}: TopEquipmentProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-5 text-2xl font-bold">
        🏆 อุปกรณ์ที่ถูกเช่ามากที่สุด
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-500">
          ไม่มีข้อมูลการเช่า
        </p>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-xl border p-4 hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                  {index + 1}
                </div>

                <div>
                  <p className="font-semibold">
                    {item.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    อุปกรณ์
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold text-blue-600">
                  {item.rentals}
                </p>

                <p className="text-sm text-gray-500">
                  ครั้ง
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}