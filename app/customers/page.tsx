"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Customer = {
  id: number;
  company_name: string;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    setLoading(true);

    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("company_name");

    if (!error && data) {
      setCustomers(data as Customer[]);
    }

    setLoading(false);
  }

  async function handleDelete(id: number) {
    const ok = confirm("ยืนยันการลบลูกค้ารายนี้?");

    if (!ok) return;

    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadCustomers();
  }

  const filteredCustomers = customers.filter((customer) => {
    const keyword = search.toLowerCase();

    return (
      customer.company_name.toLowerCase().includes(keyword) ||
      (customer.contact_name ?? "").toLowerCase().includes(keyword) ||
      (customer.phone ?? "").toLowerCase().includes(keyword)
    );
  });

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        กำลังโหลด...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">ลูกค้า</h1>

            <p className="text-gray-500 mt-2">
              จำนวนลูกค้าทั้งหมด : {customers.length}
            </p>
          </div>

          <Link
            href="/customers/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
          >
            + เพิ่มลูกค้า
          </Link>
        </div>

        <input
          type="text"
          placeholder="🔍 ค้นหาบริษัท ผู้ติดต่อ หรือเบอร์โทร..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg p-3 mb-6"
        />

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">บริษัท</th>
                <th className="border p-3 text-left">ผู้ติดต่อ</th>
                <th className="border p-3 text-left">เบอร์โทร</th>
                <th className="border p-3 text-left">อีเมล</th>
                <th className="border p-3 text-left">ที่อยู่</th>
                <th className="border p-3 text-center">จัดการ</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="border p-6 text-center"
                  >
                    ไม่พบข้อมูลลูกค้า
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="border p-3 font-medium">
                      {customer.company_name}
                    </td>

                    <td className="border p-3">
                      {customer.contact_name || "-"}
                    </td>

                    <td className="border p-3">
                      {customer.phone || "-"}
                    </td>

                    <td className="border p-3">
                      {customer.email || "-"}
                    </td>

                    <td className="border p-3">
                      {customer.address || "-"}
                    </td>

                    <td className="border p-3">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/customers/edit/${customer.id}`}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                        >
                          แก้ไข
                        </Link>

                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                        >
                          ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}