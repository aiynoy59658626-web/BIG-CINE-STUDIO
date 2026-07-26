"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import DeleteButton from "./DeleteButton";
import EquipmentImage from "./EquipmentImage";

type Equipment = {
  id: number;
  name: string;
  brand: string | null;
  category: string;
  total: number;
  available: number;
  price: number | null;
  image_url: string | null;
};

export default function EquipmentTable({
  data,
}: {
  data: Equipment[];
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");

  const categories = [
    "All",
    ...Array.from(
      new Set(data.map((item) => item.category).filter(Boolean))
    ),
  ];

  const brands = [
    "All",
    ...Array.from(
      new Set(
        data
          .map((item) => item.brand)
          .filter((b): b is string => !!b)
      )
    ),
  ];

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const keyword = search.toLowerCase();

      const matchSearch =
        item.name.toLowerCase().includes(keyword) ||
        (item.brand ?? "").toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword);

      const matchCategory =
        category === "All" || item.category === category;

      const matchBrand =
        brand === "All" || item.brand === brand;

      return matchSearch && matchCategory && matchBrand;
    });
  }, [data, search, category, brand]);

  function statusBadge(available: number) {
    if (available === 0) {
      return (
        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
          หมด
        </span>
      );
    }

    if (available <= 2) {
      return (
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
          ใกล้หมด
        </span>
      );
    }

    return (
      <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
       พร้อมให้เช่า
      </span>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 ค้นหาอุปกรณ์..."
          className="w-full rounded-xl border bg-white px-4 py-3 lg:w-80"
        />

        <div className="flex gap-3">

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border bg-white px-4 py-3"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="rounded-xl border bg-white px-4 py-3"
          >
            {brands.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>

        </div>

      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">รูปภาพ</th>
              <th className="text-left">ชื่ออุปกรณ์</th>
              <th className="text-left">ยี่ห้อ</th>
              <th className="text-left">หมวดหมู่</th>
              <th className="text-center">จำนวนทั้งหมด</th>
              <th className="text-center">คงเหลือ</th>
              <th className="text-center">ราคา / วัน</th>
              <th className="text-center">สถานะ</th>
              <th className="text-center">จัดการ</th>

            </tr>

          </thead>

          <tbody>{filteredData.map((item) => (
              <tr
                key={item.id}
                className="border-t transition hover:bg-gray-50"
              >
                <td className="p-3">
                  <EquipmentImage
                    imageUrl={item.image_url}
                    name={item.name}
                  />
                </td>

                <td className="font-semibold">
                  {item.name}
                </td>

                <td>
                  {item.brand || "-"}
                </td>

                <td>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                    {item.category}
                  </span>
                </td>

                <td className="text-center font-medium">
                  {item.total}
                </td>

                <td className="text-center font-medium">
                  {item.available}
                </td>

                <td className="text-center font-semibold text-green-700">
                  {item.price != null
                    ? `$${item.price.toFixed(2)}`
                    : "-"}
                </td>

                <td className="text-center">
                  {statusBadge(item.available)}
                </td>

                <td>
                  <div className="flex justify-center gap-2">

                    <Link
                      href={`/edit-equipment/${item.id}`}
                      className="rounded-lg bg-yellow-500 px-3 py-2 text-white transition hover:bg-yellow-600"
                    >
                      ✏️
                    </Link>

                    <Link
                      href={`/rent?equipment=${item.id}`}
                      className="rounded-lg bg-green-600 px-3 py-2 text-white transition hover:bg-green-700"
                    >
                      📦
                    </Link>

                    <DeleteButton id={item.id} />

                  </div>
                </td>
              </tr>
            ))}

            {filteredData.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="p-10 text-center text-gray-500"
                >
                  ไม่พบข้อมูลอุปกรณ์
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </>
  );
}