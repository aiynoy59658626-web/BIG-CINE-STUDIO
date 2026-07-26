"use client";

import { useState } from "react";

export default function AddEquipmentPage() {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [total, setTotal] = useState("");
  const [available, setAvailable] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch("/api/equipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          brand,
          category,
          total: Number(total),
          available: Number(available),
          price: Number(price),
          image_url: imageUrl,
        }),
      });

      const result = await res.json();

      console.log("STATUS:", res.status);
      console.log(result);

      if (!res.ok) {
        throw new Error(result.error || "เกิดข้อผิดพลาด");
      }

      alert("เพิ่มอุปกรณ์สำเร็จ!");

      setName("");
      setBrand("");
      setCategory("");
      setTotal("");
      setAvailable("");
      setPrice("");
      setImageUrl("");
    } catch (err) {
      console.error(err);
      alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow w-[500px]">
        <h1 className="text-3xl font-bold mb-6">เพิ่มอุปกรณ์</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg p-3"
            placeholder="ชื่ออุปกรณ์"
            required
          />

          <input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full border rounded-lg p-3"
            placeholder="ยี่ห้อ"
          />

          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-lg p-3"
            placeholder="หมวดหมู่"
            required
          />

          <input
            type="number"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            className="w-full border rounded-lg p-3"
            placeholder="จำนวนทั้งหมด"
            required
          />

          <input
            type="number"
            value={available}
            onChange={(e) => setAvailable(e.target.value)}
            className="w-full border rounded-lg p-3"
            placeholder="จำนวนคงเหลือ"
            required
          />

          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded-lg p-3"
            placeholder="ราคา / วัน"
            required
          />

          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border rounded-lg p-3"
            placeholder="ลิงก์รูปภาพ"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            บันทึกอุปกรณ์
          </button>
        </form>
      </div>
    </main>
  );
}