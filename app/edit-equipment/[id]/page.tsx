"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

export default function EditEquipmentPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id;

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    total: 0,
    available: 0,
    price: 0,
    image_url: "",
  });

  useEffect(() => {
    async function loadEquipment() {
      const res = await fetch(`/api/equipment/${id}`);
      const data = await res.json();

      setForm({
        name: data.name ?? "",
        brand: data.brand ?? "",
        category: data.category ?? "",
        total: data.total ?? 0,
        available: data.available ?? 0,
        price: data.price ?? 0,
        image_url: data.image_url ?? "",
      });

      setLoading(false);
    }

    loadEquipment();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(`/api/equipment/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("Update failed");
      return;
    }

    alert("Equipment updated successfully");
    router.push("/equipment");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-8">

      <h1 className="mb-8 text-3xl font-bold">
        Edit Equipment
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >        <div>
          <label className="mb-2 block font-medium">
            Name
          </label>

          <input
            type="text"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="w-full rounded-lg border p-3"
            required
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Brand
          </label>

          <input
            type="text"
            value={form.brand}
            onChange={(e) =>
              setForm({
                ...form,
                brand: e.target.value,
              })
            }
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Category
          </label>

          <input
            type="text"
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
              })
            }
            className="w-full rounded-lg border p-3"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">

          <div>
            <label className="mb-2 block font-medium">
              Total
            </label>

            <input
              type="number"
              value={form.total}
              onChange={(e) =>
                setForm({
                  ...form,
                  total: Number(e.target.value),
                })
              }
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Available
            </label>

            <input
              type="number"
              value={form.available}
              onChange={(e) =>
                setForm({
                  ...form,
                  available: Number(e.target.value),
                })
              }
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Price / Day
            </label>

            <input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({
                  ...form,
                  price: Number(e.target.value),
                })
              }
              className="w-full rounded-lg border p-3"
            />
          </div>

        </div>

        <div>
          <label className="mb-2 block font-medium">
            Image URL
          </label>

          <input
            type="text"
            value={form.image_url}
            onChange={(e) =>
              setForm({
                ...form,
                image_url: e.target.value,
              })
            }
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div className="flex gap-4 pt-4">

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={() => router.push("/equipment")}
            className="rounded-lg border px-6 py-3"
          >
            Cancel
          </button>

        </div>

      </form>

    </div>
  );
}