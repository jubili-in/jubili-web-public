//app/payment/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeading from "@/components/shared/PageHeading";
import CustomButton from "@/components/ui/CustomButton";

export default function PaymentIndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to cart payment by default
    router.push('/payment/cart');
  }, [router]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <PageHeading title="Redirecting to Checkout..." />
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500 mb-4">Redirecting you to the checkout page...</p>
        <CustomButton
          label="Go to Cart Checkout"
          loading={false}
          onClick={() => router.push('/payment/cart')}
        />
      </div>
    </div>
  );
}
