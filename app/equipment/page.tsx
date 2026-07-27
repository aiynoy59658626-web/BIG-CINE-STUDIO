import Link from "next/link";
import EquipmentTable from "@/app/components/EquipmentTable";
import { supabase } from "@/lib/supabase";

export default async function EquipmentPage() {
  const { data, error } = await supabase
    .from("equipment")
    .select("*")
    .order("name");

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-xl">
        ไม่สามารถโหลดข้อมูลอุปกรณ์ได้
      </div>
    );
  }

  const equipment = data ?? [];

  const totalEquipment = equipment.length;

  const totalUnits = equipment.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const totalAvailable = equipment.reduce(
    (sum, item) => sum + item.available,
    0
  );

  const totalRented = equipment.reduce(
    (sum, item) => sum + (item.total - item.available),
    0
  );

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
           จัดการอุปกรณ์
          </h1>

          <p className="text-gray-500">
            จัดการอุปกรณ์สำหรับงานโปรดักชัน
          </p>
        </div>

        <Link
          href="/add-equipment"
          className="rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition"
        >
          + เพิ่มอุปกรณ์
        </Link>
      </div>

      {/* Summary */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

        <Card
          title="อุปกรณ์ทั้งหมด"
          value={totalEquipment}
          color="text-blue-600"
        />

        <Card
          title="จำนวนอุปกรณ์"
          value={totalUnits}
          color="text-indigo-600"
        />

        <Card
          title="พร้อมให้เช่า"
          value={totalAvailable}
          color="text-green-600"
        />

        <Card
          title="กำลังถูกเช่า"
          value={totalRented}
          color="text-red-600"
        />

      </div>

      {/* Table */}

      <EquipmentTable data={equipment} />
    </div>
  );
}

function Card({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">

      <p className="text-gray-500">
        {title}
      </p>

      <h2 className={`mt-2 text-4xl font-bold ${color}`}>
        {value}
      </h2>

    </div>
  );
}