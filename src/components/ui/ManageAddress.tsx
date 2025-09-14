"use client";

import { useEffect, useState } from "react";
import { Address } from "@/lib/types/address";
import { useAddress } from "@/hooks/useAddress";
import Image from "next/image";

export default function ManageAddress() {
  const { addresses, loading, error, fetchAddresses, deleteAddress } = useAddress();
  const [busyId, setBusyId] = useState<string | null>(null);

  // Array of gradient backgrounds that shuffle across cards
  const gradients = [
    "bg-gradient-to-br from-black to-indigo-900",
    "bg-gradient-to-br from-black to-pink-900", 
    "bg-gradient-to-br from-black to-emerald-800",
    "bg-gradient-to-br from-black to-red-900",
    "bg-gradient-to-br from-black to-blue-800",
    "bg-gradient-to-br from-black to-rose-900",
    "bg-gradient-to-br from-black to-orange-900",
    "bg-gradient-to-br from-black to-purple-900"
  ];

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  if (loading) {
    return <div className="text-sm text-center py-8">Loading addresses...</div>;
  }

  if (error) {
    return <div className="text-sm text-center text-red-500 py-8">{error}</div>;
  }

  if (!addresses.length) {
    return (
      <div className="flex flex-col items-center gap-2 text-sm italic text-gray-100 py-10">
        <Image
          width={48}
          height={48}
          src="/images/FNF.svg"
          alt="No addresses"
          style={{ filter: "grayscale(100%)" }}
        />
        No addresses found. Try adding a new address.
      </div>
    );
  }

  const handleDelete = async (addr: Address) => {
    const ok = window.confirm("Delete this address?");
    if (!ok) return;

    try {
      setBusyId(addr.addressId);
      await deleteAddress(addr.addressId);
    } catch (err) {
      console.error(err);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      {addresses.map((addr, index) => (
        <div
          key={addr.addressId}
          className={`flex-shrink-0 w-72 sm:w-80 rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300 ${
            gradients[index % gradients.length]
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-100 truncate max-w-[70%]">
              {addr.name}
            </h3>
            {addr.isDefault && (
              <span className="text-xs font-medium px-2 py-0.5 bg-white/70 backdrop-blur-sm text-green-700 rounded-full border border-green-200/50">
                Default
              </span>
            )}
          </div>
          <div className="mt-2 text-sm text-gray-200  space-y-1">
            <div className="truncate">{addr.phoneNumber}</div>
            <div className="truncate">
              {addr.addressLine1}
              {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
            </div>
            <div className="truncate">
              {addr.city}, {addr.state} {addr.postalCode}
            </div>
            <div className="truncate">{addr.country}</div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="px-6 py-2 text-xs rounded-full font-bold bg-white backdrop-blur-sm text-red-700 hover:bg-white/80 hover:border-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              onClick={() => handleDelete(addr)}
              disabled={busyId === addr.addressId}
            >
              {busyId === addr.addressId ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
