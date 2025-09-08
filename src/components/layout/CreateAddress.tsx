"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

const AddressMap = dynamic(() => import("../ui/AddressMap"), { ssr: false });

interface AddressFormData {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  addressType: "home" | "work" | "other";
}

const CreateAddress: React.FC = () => {
  const [formData, setFormData] = useState<AddressFormData>({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    addressType: "home",
  });

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Called when map click returns address
  const handleAddressFromMap = (address: Partial<AddressFormData>, lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      ...address,
    }));
    setCoords({ lat, lng });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Address data:", { ...formData, coords });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Address saved successfully!");
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Failed to save address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form Section */}
      <div className="bg-white rounded-2xl border border-gray-300 p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Address</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Address Line 1 */}
          <div>
            <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">
              Address Line 1 *
            </label>
            <input
              type="text"
              id="addressLine1"
              name="addressLine1"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="House/Flat No., Building Name"
              value={formData.addressLine1}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Address Line 2 */}
          <div>
            <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">
              Address Line 2
            </label>
            <input
              type="text"
              id="addressLine2"
              name="addressLine2"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Street, Area, Landmark"
              value={formData.addressLine2}
              onChange={handleInputChange}
            />
          </div>

          {/* City and State Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State *
              </label>
              <input
                type="text"
                id="state"
                name="state"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter state"
                value={formData.state}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Pincode and Country Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                Pincode *
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123456"
                value={formData.pincode}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country *
              </label>
              <select
                id="country"
                name="country"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.country}
                onChange={handleInputChange}
                required
              >
                <option value="India">India</option>
                <option value="USA">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </select>
            </div>
          </div>

          {/* Address Type */}
          <div>
            <label htmlFor="addressType" className="block text-sm font-medium text-gray-700">
              Address Type *
            </label>
            <select
              id="addressType"
              name="addressType"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.addressType}
              onChange={handleInputChange}
              required
            >
              <option value="home">Home</option>
              <option value="work">Work</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              ) : null}
              {loading ? "Loading..." : "Save Address"}
            </button>
          </div>
        </form>
      </div>

      {/* Map Section */}
      <div className="rounded-2xl overflow-hidden border border-gray-300 aspect-[3/2] lg:aspect-auto">
        <AddressMap onSelectAddress={handleAddressFromMap} />
      </div>
    </div>
  );
};

export default CreateAddress;
