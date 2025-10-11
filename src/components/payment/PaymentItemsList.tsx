import Image from "next/image";
import { PaymentItem } from "@/hooks/usePaymentItems";
import { currency, calculateDiscountPercentage } from "@/lib/utils/payment.utils";

interface PaymentItemsListProps {
  items: PaymentItem[];
}

export default function PaymentItemsList({ items }: PaymentItemsListProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-300 overflow-hidden">
      <div className="hidden md:grid grid-cols-12 items-center px-6 py-3 border-b border-gray-300 text-gray-500 font-semibold text-sm">
        <div className="col-span-10">Product Info</div>
        <div className="col-span-2 text-center">Total</div>
      </div>
      
      {items.map(item => {
        const discountPercentage = calculateDiscountPercentage(item.price, item.currentPrice);
        
        return (
          <div
            key={item.id}
            className="flex flex-col md:grid md:grid-cols-12 items-start md:items-center px-6 py-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
          >
            {/* Product info */}
            <div className="col-span-8 w-full md:w-auto mb-4 md:mb-0">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={item.imageUrl ?? "/images/logo.svg"}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base text-gray-900 break-words">
                    {item.name}
                  </h3>
                  <div className="text-xs text-gray-500 mt-1">
                    <span>Brand: {item.brand}</span>
                  </div>
                  {item.price > item.currentPrice && (
                    <div className="text-xs text-gray-500 mt-1">
                      MRP: <span className="line-through">{currency(item.price * item.quantity)}</span>
                      <span className="ml-2 text-green-600">
                        ({discountPercentage}% off)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-2 col-span-2 w-full md:justify-center mb-4 md:mb-0">
              <span className="font-medium text-base">{item.quantity}</span>
            </div>

            {/* Total */}
            <div className="col-span-2 w-full md:text-center mb-4 md:mb-0">
              <div className="flex flex-col items-start md:items-center">
                <span className="font-semibold text-lg text-gray-900">
                  {currency(item.totalCurrentPrice)}
                </span>
                {item.price > item.currentPrice && (
                  <div className="text-xs text-gray-500 mt-1">
                    <span className="line-through mr-1">{currency(item.price * item.quantity)}</span>
                    <span className="text-green-600">
                      ({discountPercentage}% off)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}