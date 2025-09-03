"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAddresses } from "@/hooks/useAddresses";
import CustomButton from "@/components/ui/CustomButton";
import AuthPopup from "@/components/shared/AuthPopup";
import Navbar from "@/components/layout/Navbar";
import PageHeading from "@/components/shared/PageHeading";
import AddressModal from "@/components/payment/AddressModal";
import { Address } from "@/lib/types/address";

// Placeholder orders data
const sampleOrders = [
    {
        orderId: "ORD123456",
        date: "2024-06-01",
        status: "Delivered",
        total: 2499,
        items: [
            {
                productId: "1",
                productName: "Classic Shoe",
                imageUrl: "https://picsum.photos/seed/shoe1/80/80",
                quantity: 1,
                price: 1299,
            },
            {
                productId: "2",
                productName: "Streetwear Shoe",
                imageUrl: "https://picsum.photos/seed/shoe2/80/80",
                quantity: 1,
                price: 1200,
            },
        ],
    },
    {
        orderId: "ORD654321",
        date: "2024-05-20",
        status: "Shipped",
        total: 1499,
        items: [
            {
                productId: "3",
                productName: "Skate Shoe",
                imageUrl: "https://picsum.photos/seed/shoe3/80/80",
                quantity: 1,
                price: 1499,
            },
        ],
    },
];

function AddressCard({ 
  address, 
  onEdit, 
  onDelete, 
  onSetDefault 
}: { 
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (addressId: string) => void;
  onSetDefault: (addressId: string) => void;
}) {
  const getAddressTypeIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'HOME':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'WORK':
        return (
          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
    }
  };

  const getAddressTypeBg = (type: string) => {
    switch (type.toUpperCase()) {
      case 'HOME':
        return 'bg-blue-100';
      case 'WORK':
        return 'bg-orange-100';
      default:
        return 'bg-green-100';
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-6 relative">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getAddressTypeBg(address.addressType)}`}>
            {getAddressTypeIcon(address.addressType)}
          </div>
          <div>
            <div className="font-semibold capitalize">{address.addressType.toLowerCase()}</div>
            {address.isDefault && (
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Default</span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(address)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button 
            onClick={() => onDelete(address.addressId)}
            className="text-gray-400 hover:text-red-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <div className="text-gray-700 leading-relaxed">
        <div className="font-medium">{address.name}</div>
        <div className="mt-1">
          {address.addressLine1}
          {address.addressLine2 && `, ${address.addressLine2}`}
        </div>
        <div>{address.city}, {address.state} {address.postalCode}</div>
        <div className="mt-2 text-sm text-gray-600">Phone: {address.phoneNumber}</div>
        {address.altPhoneNumber && (
          <div className="text-sm text-gray-600">Alt: {address.altPhoneNumber}</div>
        )}
      </div>
      {!address.isDefault && (
        <button 
          onClick={() => onSetDefault(address.addressId)}
          className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Set as Default
        </button>
      )}
    </div>
  );
}

export default function UserProfile() {
    const { user, logout } = useAuth();
    const { 
        addresses, 
        loading: addressLoading, 
        fetchAddresses, 
        deleteAddress, 
        setDefaultAddress 
    } = useAddresses();
    const [mounted, setMounted] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Don't render anything until mounted to prevent hydration mismatch
    if (!mounted) {
        return null;
    }

    if (!user) {
        return <AuthPopup />;
    }

    const handleAddAddress = () => {
        setEditingAddress(null);
        setShowAddModal(true);
    };

    const handleEditAddress = (address: Address) => {
        setEditingAddress(address);
        setShowAddModal(true);
    };

    const handleDeleteAddress = async (addressId: string) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            await deleteAddress(addressId);
        }
    };

    const handleSetDefaultAddress = async (addressId: string) => {
        await setDefaultAddress(addressId);
    };

    const handleAddressModalClose = () => {
        setShowAddModal(false);
        setEditingAddress(null);
    };

    const handleAddressCreated = () => {
        setShowAddModal(false);
        setEditingAddress(null);
        fetchAddresses(); // Refresh addresses
    };

    return (
        <>
            <Navbar />
            <main className="max-w-6xl mx-auto p-4">
                <PageHeading title="My Account" />
                <div className="bg-white rounded-2xl border border-gray-300 p-8 shadow-sm mb-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                                <img src="/icons/user.svg" alt="User" className="w-10 h-10" />
                            </div>
                            <div>
                                <div className="text-xl font-bold">{user.name}</div>
                                <div className="text-gray-500 text-sm">{user.email}</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {user.phone && (
                                <div>
                                    <div className="text-gray-400 text-xs uppercase mb-1">Phone</div>
                                    <div className="font-medium">{user.phone}</div>
                                </div>
                            )}
                            <div>
                                <div className="text-gray-400 text-xs uppercase mb-1">Member Since</div>
                                <div className="font-medium">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            {user.userId && (
                                <div>
                                    <div className="text-gray-400 text-xs uppercase mb-1">User ID</div>
                                    <div className="font-mono text-sm">{user.userId}</div>
                                </div>
                            )}
                        </div>
                        <div className="pt-6">
                            <CustomButton
                                onClick={() => {
                                    const ordersSection = document.getElementById('my-orders');
                                    ordersSection?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                loading={false}
                                label="My Orders"
                                backgroundColor="#3a5bd4ff"
                                iconPosition="right"
                                icon={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                }
                            /> 
                            <span className="px-1"></span>
                            <CustomButton
                                onClick={logout}
                                loading={false}
                                label="Logout"
                            />
                        </div>
                    </div>
                </div>

                {/* My Addresses Section */}
                <section className="mb-8">
                    <div className="flex items-center justify-between py-4">
                        <h2 className="text-2xl font-bold">My Addresses</h2>
                        <CustomButton
                            onClick={handleAddAddress}
                            loading={addressLoading}
                            label="Add Address"
                            backgroundColor="#3a5bd4ff"
                        />
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-300 p-6">
                        {addressLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <span className="ml-3 text-gray-500">Loading addresses...</span>
                            </div>
                        ) : addresses.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 mb-4">No addresses found</p>
                                <CustomButton
                                    onClick={handleAddAddress}
                                    loading={false}
                                    label="Add Your First Address"
                                    backgroundColor="#3a5bd4ff"
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {addresses.map(address => (
                                    <AddressCard
                                        key={address.addressId}
                                        address={address}
                                        onEdit={handleEditAddress}
                                        onDelete={handleDeleteAddress}
                                        onSetDefault={handleSetDefaultAddress}
                                    />
                                ))}
                                
                                {/* Add New Address Button */}
                                <div 
                                    onClick={handleAddAddress}
                                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                >
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <div className="font-medium">Add New Address</div>
                                    <div className="text-sm text-gray-400 mt-1">+ Add delivery address</div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* My Orders Section */}
                <section id="my-orders" className="mb-8">
                    <div className="py-4 text-2xl font-bold">My Orders</div>
                    <div className="bg-white rounded-2xl border border-gray-300 p-0 overflow-hidden">
                        {/* Table Header - hidden on mobile */}
                        <div className="hidden md:grid grid-cols-12 items-center px-6 py-3 border-b border-gray-300 text-gray-500 font-semibold text-sm">
                            <div className="col-span-3">Order ID</div>
                            <div className="col-span-2">Date</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-3">Items</div>
                            <div className="col-span-2 text-right">Total</div>
                        </div>
                        {/* Table Body */}
                        {sampleOrders.length === 0 ? (
                            <div className="p-6 text-gray-500">You have no orders yet.</div>
                        ) : (
                            sampleOrders.map((order) => (
                                <div
                                    key={order.orderId}
                                    className="flex flex-col md:grid md:grid-cols-12 items-start md:items-center ml-2 md:ml-6 mr-2 md:mr-6 py-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
                                >
                                    {/* Order ID */}
                                    <div className="col-span-3 font-mono text-sm mb-2 md:mb-0">{order.orderId}</div>
                                    {/* Date */}
                                    <div className="col-span-2 text-sm text-gray-500 mb-2 md:mb-0">{order.date}</div>
                                    {/* Status */}
                                    <div className="col-span-2 text-sm mb-2 md:mb-0">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === "Delivered" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    {/* Items */}
                                    <div className="col-span-3 flex flex-wrap gap-2 mb-2 md:mb-0">
                                        {order.items.map((item) => (
                                            <div key={item.productId} className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                                                <img src={item.imageUrl} alt={item.productName} className="w-8 h-8 object-cover rounded" />
                                                <span className="text-xs font-medium">{item.productName} x{item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Total */}
                                    <div className="col-span-2 text-right font-bold text-lg">₹{order.total.toLocaleString()}</div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>

            {/* Address Modal */}
            {showAddModal && (
                <AddressModal
                    onClose={handleAddressModalClose}
                    onAddressCreated={handleAddressCreated}
                    editingAddress={editingAddress}
                />
            )}
        </>
    );
}
