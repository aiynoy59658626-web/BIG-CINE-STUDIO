"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

import SummaryCards from "@/app/components/reports/SummaryCards";
import RevenueCards from "@/app/components/reports/RevenueCards";
import TopEquipment from "@/app/components/reports/TopEquipment";
import TopCustomers from "@/app/components/reports/TopCustomers";
import Alerts from "@/app/components/reports/Alerts";
import RecentRentals from "@/app/components/reports/RecentRentals";

type Equipment = {
  id: number;
  name: string;
  available: number;
};

type Customer = {
  id: number;
  company_name: string;
};

type Rental = {
  id: number;
  equipment_id: number;
  customer_name: string;
  quantity: number;
  total_price: number;
  status: string;
  rent_date: string;
  return_date: string;
  created_at: string;
};

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    const [
      equipmentResult,
      customerResult,
      rentalResult,
    ] = await Promise.all([
      supabase
        .from("equipment")
        .select("id,name,available"),

      supabase
        .from("customers")
        .select("id,company_name"),

      supabase
        .from("rentals")
        .select("*")
        .order("created_at", {
          ascending: false,
        }),
    ]);

    if (equipmentResult.data) {
      setEquipment(equipmentResult.data);
    }

    if (customerResult.data) {
      setCustomers(customerResult.data);
    }

    if (rentalResult.data) {
      setRentals(rentalResult.data);
    }

    setLoading(false);
  }

  const totalEquipment = equipment.length;

  const totalCustomers = customers.length;

  const currentRentals = rentals.filter(
    (r) => r.status !== "Returned"
  ).length;

  const totalRevenue = rentals
    .filter((r) => r.status === "Returned")
    .reduce(
      (sum, r) => sum + Number(r.total_price),
      0
    );

  const today = new Date().toISOString().slice(0, 10);

  const todayRevenue = rentals
    .filter(
      (r) =>
        r.status === "Returned" &&
        r.return_date === today
    )
    .reduce(
      (sum, r) => sum + Number(r.total_price),
      0
    );
      const month = new Date().getMonth();
  const year = new Date().getFullYear();

  const monthRevenue = rentals
    .filter((r) => {
      if (r.status !== "Returned") return false;

      const d = new Date(r.return_date);

      return (
        d.getMonth() === month &&
        d.getFullYear() === year
      );
    })
    .reduce(
      (sum, r) => sum + Number(r.total_price),
      0
    );

  const yearRevenue = rentals
    .filter((r) => {
      if (r.status !== "Returned") return false;

      return (
        new Date(r.return_date).getFullYear() ===
        year
      );
    })
    .reduce(
      (sum, r) => sum + Number(r.total_price),
      0
    );

  const outOfStock = equipment.filter(
    (e) => e.available === 0
  ).length;

  const lowStock = equipment.filter(
    (e) => e.available > 0 && e.available <= 2
  ).length;

  const overdue = rentals.filter((r) => {
    return (
      r.status !== "Returned" &&
      new Date(r.return_date) < new Date()
    );
  }).length;

  const topCustomers = useMemo(() => {
    const map = new Map<
      string,
      {
        customer_name: string;
        rentals: number;
        total: number;
      }
    >();

    rentals.forEach((r) => {
      if (!map.has(r.customer_name)) {
        map.set(r.customer_name, {
          customer_name: r.customer_name,
          rentals: 0,
          total: 0,
        });
      }

      const item = map.get(r.customer_name)!;

      item.rentals += 1;
      item.total += Number(r.total_price);
    });

    return Array.from(map.values())
      .sort((a, b) => b.rentals - a.rentals)
      .slice(0, 5);
  }, [rentals]);

  const topEquipment = useMemo(() => {
    const map = new Map<
      number,
      {
        id: number;
        rentals: number;
      }
    >();

    rentals.forEach((r) => {
      if (!map.has(r.equipment_id)) {
        map.set(r.equipment_id, {
          id: r.equipment_id,
          rentals: 0,
        });
      }

      map.get(r.equipment_id)!.rentals++;
    });

    return Array.from(map.values())
      .map((item) => ({
        name:
          equipment.find(
            (e) => e.id === item.id
          )?.name ?? "Unknown",
        rentals: item.rentals,
      }))
      .sort((a, b) => b.rentals - a.rentals)
      .slice(0, 5);
  }, [rentals, equipment]);

  const recentRentals = useMemo(() => {
    return rentals
      .slice(0, 10)
      .map((r) => ({
        id: r.id,
        customer_name: r.customer_name,
        equipment_name:
          equipment.find(
            (e) => e.id === r.equipment_id
          )?.name ?? "Unknown",
        quantity: r.quantity,
        total_price: r.total_price,
        status: r.status,
      }));
  }, [rentals, equipment]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">
          Loading Reports...
        </h1>
      </main>
    );
  }
    return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            📊 Reports Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Production Equipment Rental Report
          </p>
        </div>

        <SummaryCards
          totalEquipment={totalEquipment}
          totalCustomers={totalCustomers}
          currentRentals={currentRentals}
          totalRevenue={totalRevenue}
        />
        <RevenueCards
  todayRevenue={todayRevenue}
  monthRevenue={monthRevenue}
  yearRevenue={yearRevenue}
/>

        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">

          <TopEquipment
            data={topEquipment}
          />

          <TopCustomers
            data={topCustomers}
          />

        </div>

        <div className="mt-8">

          <Alerts
            outOfStock={outOfStock}
            lowStock={lowStock}
            overdue={overdue}
          />

        </div>

        <RecentRentals
          data={recentRentals}
        />

        <div className="mt-10 rounded-2xl bg-white p-6 shadow">

          

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-xl border p-5">
              <p className="text-sm text-gray-500">
                อัตราการใช้งานอุปกรณ์
              </p>

              <h3 className="mt-2 text-3xl font-bold text-blue-600">
                {totalEquipment === 0
                  ? "0%"
                  : `${Math.round(
                      (currentRentals / totalEquipment) * 100
                    )}%`}
              </h3>
            </div>

            <div className="rounded-xl border p-5">
              <p className="text-sm text-gray-500">
                มูลค่าการเช่าเฉลี่ย
              </p>

              <h3 className="mt-2 text-3xl font-bold text-green-600">
                $
                {rentals.length === 0
                  ? 0
                  : Math.round(
                      rentals.reduce(
                        (sum, r) =>
                          sum + Number(r.total_price),
                        0
                      ) / rentals.length
                    ).toLocaleString()}
              </h3>
            </div>

            <div className="rounded-xl border p-5">
              <p className="text-sm text-gray-500">
                รายการที่คืนแล้ว
              </p>

              <h3 className="mt-2 text-3xl font-bold text-purple-600">
                {
                  rentals.filter(
                    (r) => r.status === "Returned"
                  ).length
                }
              </h3>
            </div>

            <div className="rounded-xl border p-5">
              <p className="text-sm text-gray-500">
                รายการที่กำลังเช่า
              </p>

              <h3 className="mt-2 text-3xl font-bold text-orange-600">
                {currentRentals}
              </h3>
            </div>

          </div>

        </div>
              </div>
    </main>
  );
}