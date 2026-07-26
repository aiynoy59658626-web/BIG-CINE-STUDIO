"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Customer = {
  company_name: string;
  contact_name: string;
  phone: string;
  email: string;
  address: string;
};

export default function EditCustomerPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id;

  const [loading, setLoading] = useState(true);

  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    async function loadCustomer() {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setCompanyName(data.company_name ?? "");
        setContactName(data.contact_name ?? "");
        setPhone(data.phone ?? "");
        setEmail(data.email ?? "");
        setAddress(data.address ?? "");
      }

      setLoading(false);
    }

    loadCustomer();
  }, [id]);

  async function handleSave() {
    const res = await fetch(`/api/customers/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company_name: companyName,
        contact_name: contactName,
        phone,
        email,
        address,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.error);
      return;
    }

    alert("Customer updated successfully!");

    router.push("/customers");
  }

  if (loading) {
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
          Edit Customer
        </h1>

        <div className="space-y-4">          <div>
            <label className="block mb-2 font-medium">
              Company Name
            </label>

            <input
              className="w-full border rounded-lg p-3"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Contact Name
            </label>

            <input
              className="w-full border rounded-lg p-3"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Phone
            </label>

            <input
              className="w-full border rounded-lg p-3"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              className="w-full border rounded-lg p-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Address
            </label>

            <textarea
              rows={4}
              className="w-full border rounded-lg p-3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => router.push("/customers")}
              className="flex-1 rounded-lg border p-3 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="flex-1 rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>

        </div>

      </div>
    </main>
  );
}