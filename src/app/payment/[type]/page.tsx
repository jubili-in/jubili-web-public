//app/payment/[type]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft } from 'react-icons/fa';
import PageHeading from "@/components/shared/PageHeading";
import CustomButton from "@/components/ui/CustomButton";
import { useAddress } from "@/hooks/useAddress";
import { useAuth } from "@/hooks/useAuth";
import { useToastActions } from "@/hooks/useToastActions";
import Script from "next/script";

// Custom hooks
import { usePaymentItems } from "@/hooks/usePaymentItems";
import { usePaymentTotals } from "@/hooks/usePaymentTotals";
import { useDeliveryCharges } from "@/hooks/useDeliveryCharges";

// Components
import PaymentItemsList from "@/components/payment/PaymentItemsList";
import AddressSelection from "@/components/payment/AddressSelection";
import OrderSummary from "@/components/payment/OrderSummary";

// Services
import { PaymentService } from "@/services/payment.service";

export default function PaymentPage() {
  const params = useParams<{ type: string }>();
  const router = useRouter();
  const { type } = params;
  const { userId, token, user } = useAuth();
  const { addresses, loading: addressLoading, fetchAddresses } = useAddress();
  const { showError, showSuccess, showInfo } = useToastActions();
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  // Use custom hooks
  const {
    items,
    singleProduct,
    cart,
    loading: itemsLoading,
    isCartPayment,
    isSingleProductPayment,
    quantity,
  } = usePaymentItems(type!, userId || undefined, token || undefined);

  const totals = usePaymentTotals(isCartPayment, cart, isSingleProductPayment, singleProduct, quantity);


  // Get selected address
  const selectedAddress = addresses.find(a => a.addressId === selectedAddressId) ?? addresses[0];
  
  // Use delivery charges hook
  const delhiveryCharges = useDeliveryCharges(cart, singleProduct, selectedAddress);

  // Fetch addresses
  useEffect(() => {
    if (token) {
      fetchAddresses();
    }
  }, [token, fetchAddresses]);

  // Set default selected address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find(addr => addr.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddr.addressId);
    }
  }, [addresses, selectedAddressId]);


  // Handle payment using PaymentService
  const handlePayment = async (): Promise<void> => {
    if (!selectedAddress || !token) {
      showError("Error", "Missing required information for payment.", 3000);
      return;
    }
    
    await PaymentService.handlePayment({
      totals,
      items,
      selectedAddress,
      user,
      token,
      delhiveryCharges,
      cart,
      singleProduct,
      showError,
      showSuccess,
      showInfo,
      razorpayLoaded,
    });
  };

  // Show loading state
  if (itemsLoading || addressLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <PageHeading title="Loading..." />
        <div className="flex items-center justify-center h-64">
          <img src="/icons/loading.svg" alt="Loading..." className="w-8 h-8 animate-spin mb-4" />
          <div className="text-lg font-medium text-gray-700">Loading...</div>
        </div>
      </div>
    );
  }

  // Validate type parameter
  if (!type) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <PageHeading title="Invalid Payment Route" />
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Invalid payment route. Please try again.</p>
          <CustomButton
            label="Go to Cart"
            loading={false}
            onClick={() => router.push('/cart')}
          />
        </div>
      </div>
    );
  }

  // Show error if no items
  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <PageHeading title="No Items to Checkout" />
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No items found for checkout.</p>
          <CustomButton
            label="Continue Shopping"
            loading={false}
            onClick={() => router.push('/')}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
          >
            <FaArrowLeft size={16} />
            Back
          </button>
          <PageHeading title={isCartPayment ? "Cart Checkout" : "Secure & Checkout"} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Items + Address */}
          <div className="md:col-span-2 space-y-8">
            {/* Items */}
            <PaymentItemsList items={items} />

            {/* Address */}
            <AddressSelection
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onAddressChange={setSelectedAddressId}
            />
          </div>

          {/* Right: Summary */}
          <div className="md:col-span-1">
            <OrderSummary
              items={items}
              totals={totals}
              delhiveryCharges={delhiveryCharges}
              addresses={addresses}
              onPayment={handlePayment}
            />
          </div>
        </div>
      </div>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
      />
    </>
  );
}
