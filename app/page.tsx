import { supabase } from "../lib/supabase";

type Equipment = {
  id: number;
  name: string;
  brand: string;
  category: string;
  total: number;
  available: number;
};

type Rental = {
  customer_name: string;
  quantity: number;
  equipment:
    | {
        name: string;
      }
    | {
        name: string;
      }[]
    | null;
};

export default async function Home() {
  const { data: equipment, error } = await supabase
    .from("equipment")
    .select("*");

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }

  const items = (equipment ?? []) as Equipment[];

  const totalEquipment = items.length;

  const totalUnits = items.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const available = items.reduce(
    (sum, item) => sum + item.available,
    0
  );

  const rented = items.reduce(
    (sum, item) => sum + (item.total - item.available),
    0
  );

  const lowStock = items.filter(
    (item) => item.available > 0 && item.available <= 2
  ).length;

  const outOfStock = items.filter(
    (item) => item.available === 0
  ).length;

  const lowStockItems = items.filter(
    (item) => item.available > 0 && item.available <= 2
  );

  const { data: recentRentals } = await supabase
    .from("rentals")
    .select(`
      customer_name,
      quantity,
      equipment:equipment_id (
        name
      )
    `)
    .eq("status", "Rented")
    .order("created_at", { ascending: false })
    .limit(5);

  const rentals = (recentRentals ?? []) as Rental[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          หน้าหลัก
        </h1>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card
          title="📦 อุปกรณ์ทั้งหมด"
          value={totalEquipment}
          color="text-blue-600"
        />

        <Card
          title="📦 จำนวนอุปกรณ์"
          value={totalUnits}
          color="text-indigo-600"
        />

        <Card
          title="✅ พร้อมให้เช่า"
          value={available}
          color="text-green-600"
        />
                <Card
          title="🎥 กำลังถูกเช่า"
          value={rented}
          color="text-red-600"
        />

        <Card
          title="⚠️ อุปกรณ์ใกล้หมด"
          value={lowStock}
          color="text-yellow-600"
        />

        <Card
          title="❌ อุปกรณ์หมด"
          value={outOfStock}
          color="text-red-700"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-4">
            ⚠️ อุปกรณ์ใกล้หมด
          </h2>

          {lowStockItems.length === 0 ? (
            <p className="text-gray-500">
              อุปกรณ์ทุกชิ้นพร้อมให้เช่า
            </p>
          ) : (
            <div className="space-y-3">

              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between border-b pb-2"
                >
                  <div>
                    <p className="font-semibold">
                      {item.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {item.brand}
                    </p>
                  </div>

                  <span className="font-bold text-yellow-600">
                    {item.available} left
                  </span>
                </div>
              ))}

            </div>
          )}

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-4">
            🎥 รายการเช่าปัจจุบัน
          </h2>

          {rentals.length === 0 ? (
            <p className="text-gray-500">
              ไม่มีรายการเช่าในขณะนี้
            </p>
          ) : (
            <div className="space-y-3">

              {rentals.map((rental, index) => {

                const equipment = Array.isArray(rental.equipment)
                  ? rental.equipment[0]
                  : rental.equipment;

                return (
                  <div
                    key={index}
                    className="flex justify-between border-b pb-2"
                  >
                    <div>
                      <p className="font-semibold">
                        {equipment?.name ?? "-"}
                      </p>

                      <p className="text-sm text-gray-500">
                        {rental.customer_name}
                      </p>
                    </div>

                    <span>
                      x{rental.quantity}
                    </span>
                  </div>
                );
              })}

            </div>
          )}

        </div>

      </div>
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
    <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">

      <h3 className="text-gray-500 text-sm font-medium">
        {title}
      </h3>

      <p className={`text-4xl font-bold mt-3 ${color}`}>
        {value}
      </p>

    </div>
  );
}