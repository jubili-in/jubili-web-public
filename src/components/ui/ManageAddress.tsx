"use client";

import { useEffect, useState } from "react";
import { addressService } from "@/services/address.service";
import { Address } from "@/lib/types/address";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

export default function ManageAddress() {
  const { token } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!token) return;
      try {
        setLoading(true);
        setError("");
        const data = await addressService.getMyAddresses(token);
        setAddresses(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load addresses";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [token]);

  if (!token) {
    return <div className="text-sm text-red-500">Login to view your addresses.</div>;
  }

  if (loading) {
    return <div className="text-sm">Loading addresses...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-500">{error}</div>;
  }

  if (!addresses.length) {
    return (
      <div className="flex items-center gap-2 text-sm italic">
        <Image
          width={32}
          height={32}
          src="/images/FNF.svg"
          alt="No addresses"
          style={{ filter: "grayscale(100%)", minWidth: 32, minHeight: 32 }}
        />
        No addresses found. Try adding new address.
      </div>
    );
  }

  const refresh = async () => {
    if (!token) return;
    const data = await addressService.getMyAddresses(token);
    setAddresses(data);
  };

  const handleDelete = async (addr: Address) => {
    if (!token) return;
    const ok = window.confirm("Delete this address?");
    if (!ok) return;
    try {
      setBusyId(addr.addressId);
      await addressService.deleteAddress(addr.addressId, token);
      await refresh();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to delete address");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {addresses.map((addr) => (
        <div
          key={addr.addressId}
          className="border rounded-md p-4 shadow-sm bg-white"
        >
          <div className="flex items-start justify-between">
            <div className="font-semibold text-gray-900">
              {addr.name}
            </div>
            {addr.isDefault ? (
              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Default</span>
            ) : null}
          </div>
          <div className="mt-1 text-sm text-gray-700">
            <div>{addr.phoneNumber}</div>
            <div>
              {addr.addressLine1}
              {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
            </div>
            <div>
              {addr.city}, {addr.state} {addr.postalCode}
            </div>
            <div>{addr.country}</div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              className="px-3 py-1 text-xs rounded border border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => handleDelete(addr)}
              disabled={busyId === addr.addressId}
            >
              {busyId === addr.addressId ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}


