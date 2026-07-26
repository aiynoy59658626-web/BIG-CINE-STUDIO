"use client";

type AlertsProps = {
  outOfStock: number;
  lowStock: number;
  overdue: number;
};

export default function Alerts({
  outOfStock,
  lowStock,
  overdue,
}: AlertsProps) {
  const alerts = [
    {
      title: "อุปกรณ์หมด",
      value: outOfStock,
      icon: "❌",
      color: "bg-red-500",
    },
    {
      title: "อุปกรณ์ใกล้หมด",
      value: lowStock,
      icon: "⚠️",
      color: "bg-yellow-500",
    },
    {
      title: "เช่าเกินกำหนด",
      value: overdue,
      icon: "⏰",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-5 text-2xl font-bold">
        ⚠️ การแจ้งเตือน
      </h2>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.title}
            className="flex items-center justify-between rounded-xl border p-4 hover:bg-gray-50"
          >
            <div className="flex items-center gap-4">
              <div
                className={`${alert.color} flex h-12 w-12 items-center justify-center rounded-xl text-2xl text-white`}
              >
                {alert.icon}
              </div>

              <div>
                <p className="font-semibold">
                  {alert.title}
                </p>

                <p className="text-sm text-gray-500">
                  ต้องตรวจสอบ
                </p>
              </div>
            </div>

            <p className="text-3xl font-bold">
              {alert.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}