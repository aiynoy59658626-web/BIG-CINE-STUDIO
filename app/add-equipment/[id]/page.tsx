"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditEquipmentPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(0);
  const [total, setTotal] = useState(0);
  const [available, setAvailable] = useState(0);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    loadEquipment();
  }, []);

  async function loadEquipment() {
    const { data, error } = await supabase
      .from("equipment")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert("Equipment not found");
      router.push("/equipment");
      return;
    }

    setName(data.name ?? "");
    setBrand(data.brand ?? "");
    setCategory(data.category ?? "");
    setPrice(data.price ?? 0);
    setTotal(data.total ?? 0);
    setAvailable(data.available ?? 0);
    setImageUrl(data.image_url ?? "");

    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);

    const res = await fetch("/api/equipment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        name,
        brand,
        category,
        total,
        available,
        price,
        image_url: imageUrl,
      }),
    });

    const result = await res.json();

    setSaving(false);

    if (!res.ok) {
      alert(result.error);
      return;
    }

    alert("Equipment updated successfully");
    router.push("/equipment");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-8">
        Edit Equipment
      </h1>

      <form onSubmit={handleSave} className="space-y-5">

        <div>
          <label className="font-medium">Name</label>
          <input
            className="w-full border rounded-lg p-3 mt-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="font-medium">Brand</label>
          <input
            className="w-full border rounded-lg p-3 mt-2"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>

        <div>
          <label className="font-medium">Category</label>
          <input
            className="w-full border rounded-lg p-3 mt-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div>
          <label className="font-medium">Price / Day</label>
          <input
            type="number"
            className="w-full border rounded-lg p-3 mt-2"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="font-medium">Total</label>
          <input
            type="number"
            className="w-full border rounded-lg p-3 mt-2"
            value={total}
            onChange={(e) => setTotal(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="font-medium">Available</label>
          <input
            type="number"
            className="w-full border rounded-lg p-3 mt-2"
            value={available}
            onChange={(e) => setAvailable(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="font-medium">Image URL</label>
          <input
            className="w-full border rounded-lg p-3 mt-2"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/equipment")}
            className="bg-gray-300 hover:bg-gray-400 px-6 py-3 rounded-lg"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
}