"use client";

type RevenueCardsProps = {
  todayRevenue: number;
  monthRevenue: number;
  yearRevenue: number;
};

export default function RevenueCards({
  todayRevenue,
  monthRevenue,
  yearRevenue,
}: RevenueCardsProps) {
  return (
    <div className="mt-8 rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-4 text-2xl font-bold">
        รายได้
      </h2>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-xl border-l-8 border-green-500 bg-white p-5 shadow">
          <p className="text-gray-500">รายได้วันนี้</p>
          <h3 className="mt-2 text-3xl font-bold text-green-600">
            ${todayRevenue.toLocaleString()}
          </h3>
        </div>

        <div className="rounded-xl border-l-8 border-blue-500 bg-white p-5 shadow">
          <p className="text-gray-500">รายได้เดือนนี้</p>
          <h3 className="mt-2 text-3xl font-bold text-blue-600">
            ${monthRevenue.toLocaleString()}
          </h3>
        </div>

        <div className="rounded-xl border-l-8 border-purple-500 bg-white p-5 shadow">
          <p className="text-gray-500">รายได้ปีนี้</p>
          <h3 className="mt-2 text-3xl font-bold text-purple-600">
            ${yearRevenue.toLocaleString()}
          </h3>
        </div>
      </div>
    </div>
  );
}