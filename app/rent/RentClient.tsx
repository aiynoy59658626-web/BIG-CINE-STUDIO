"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Equipment = {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  available: number;
};

type Customer = {
  id: number;
  company_name: string;
};

export default function RentClient() {
  const searchParams = useSearchParams();
  const equipmentId = searchParams.get("equipment");

  const [equipment, setEquipment] = useState<Equipment | null>(null);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerName, setCustomerName] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [rentDate, setRentDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!equipmentId) return;

    async function loadData() {
      const { data: equipmentData } = await supabase
        .from("equipment")
        .select("*")
        .eq("id", equipmentId)
        .single();

      if (equipmentData) {
        setEquipment(equipmentData);
      }

      const { data: customerData } = await supabase
        .from("customers")
        .select("id, company_name")
        .order("company_name");

      if (customerData) {
        setCustomers(customerData);

        if (customerData.length > 0) {
          setCustomerName(customerData[0].company_name);
        }
      }
    }

    loadData();
  }, [equipmentId]);

  async function handleRent() {
    if (!equipment) return;

    const res = await fetch("/api/rent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        equipment_id: equipment.id,
        customer_name: customerName,
        quantity,
        rent_date: rentDate,
        return_date: returnDate,
        notes,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.error);
      return;
    }

    alert("Rental created successfully!");

    window.location.href = "/equipment";
  }

  const rentalDays =
    rentDate && returnDate
      ? Math.ceil(
          (new Date(returnDate).getTime() -
            new Date(rentDate).getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1
      : 0;

  const total =
    equipment && rentalDays > 0
      ? equipment.price * quantity * rentalDays
      : 0;

  if (!equipment) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-6">
          Create Rental
        </h1>

        <div className="bg-gray-100 rounded-lg p-4 mb-6 space-y-2">
          <p><strong>Equipment:</strong> {equipment.name}</p>
          <p><strong>Brand:</strong> {equipment.brand}</p>
          <p><strong>Price / Day:</strong> ${equipment.price}</p>
          <p><strong>Available:</strong> {equipment.available}</p>
        </div>

        <div className="space-y-4">
                    <div>
            <label className="block mb-2 font-medium">
              Customer
            </label>

            <select
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border rounded-lg p-3"
            >
              {customers.length === 0 ? (
                <option value="">
                  No customers found
                </option>
              ) : (
                customers.map((customer) => (
                  <option
                    key={customer.id}
                    value={customer.company_name}
                  >
                    {customer.company_name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Quantity
            </label>

            <input
              type="number"
              min={1}
              max={equipment.available}
              className="w-full border rounded-lg p-3"
              value={quantity}
              onChange={(e) =>
                setQuantity(Number(e.target.value))
              }
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Rent Date
            </label>

            <input
              type="date"
              className="w-full border rounded-lg p-3"
              value={rentDate}
              onChange={(e) => setRentDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Return Date
            </label>

            <input
              type="date"
              className="w-full border rounded-lg p-3"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Notes
            </label>

            <textarea
              className="w-full border rounded-lg p-3"
              rows={4}
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="bg-blue-50 rounded-lg p-4 space-y-2">
            <p>
              <strong>Rental Days:</strong> {rentalDays}
            </p>

            <p>
              <strong>Total:</strong> ${total}
            </p>
          </div>

          <button
            onClick={handleRent}
            disabled={customers.length === 0}
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            Confirm Rental
          </button>
        </div>
      </div>
    </main>
  );
}
        
        