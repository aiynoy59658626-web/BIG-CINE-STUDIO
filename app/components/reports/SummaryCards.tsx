"use client";

type SummaryCardsProps = {
  totalEquipment: number;
  totalCustomers: number;
  currentRentals: number;
  totalRevenue: number;
};

export default function SummaryCards({
  totalEquipment,
  totalCustomers,
  currentRentals,
  totalRevenue,
}: SummaryCardsProps) {
  const cards = [
    {
      title: "อุปกรณ์ทั้งหมด",
      value: totalEquipment,
      icon: "📦",
      color: "bg-blue-500",
    },
    {
      title: "ลูกค้าทั้งหมด",
      value: totalCustomers,
      icon: "👥",
      color: "bg-green-500",
    },
    {
      title: "กำลังเช่า",
      value: currentRentals,
      icon: "📋",
      color: "bg-yellow-500",
    },
    {
      title: "รายได้รวม",
      value: `$${Number(totalRevenue).toLocaleString()}`,
      icon: "💰",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl bg-white p-6 shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {card.title}
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {card.value}
              </h2>
            </div>

            <div
              className={`${card.color} flex h-14 w-14 items-center justify-center rounded-xl text-3xl text-white`}
            >
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}