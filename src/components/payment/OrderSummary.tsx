import CustomButton from "@/components/ui/CustomButton";
import { PaymentItem } from "@/hooks/usePaymentItems";
import { PaymentTotals } from "@/hooks/usePaymentTotals";
import { Address } from "@/lib/types/address";
import { currency } from "@/lib/utils/payment.utils";

interface OrderSummaryProps {
  items: PaymentItem[];
  totals: PaymentTotals;
  delhiveryCharges: number[];
  addresses: Address[];
  onPayment: () => void;
}

export default function OrderSummary({
  items,
  totals,
  delhiveryCharges,
  addresses,
  onPayment
}: OrderSummaryProps) {
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white rounded-2xl border border-gray-300 p-6 sticky top-4">
      <h2 className="font-semibold text-lg mb-6">Order Summary</h2>

      {/* Voucher input */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Discount voucher"
          className="w-full rounded-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 pr-20"
        />
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gray-900 text-white px-4 py-2 text-xs font-semibold hover:bg-black transition shadow"
        >
          Apply
        </button>
      </div>

      {/* Summary details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span>Sub Total ({totalItemsCount} items)</span>
          <span>{currency(totals.subTotal)}</span>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between text-sm text-green-700">
            <span>Discount</span>
            <span>-{currency(totals.discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span>Delivery Charges</span>
          <span>
            {delhiveryCharges.length > 0 
              ? currency(delhiveryCharges.reduce((sum, charge) => sum + charge, 0)) 
              : "Calculating..."
            }
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Platform Charges</span>
          <span>{currency(totals.platformCharges)}</span>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total</span>
          <span>{currency(totals.grandTotal)}</span>
        </div>
      </div>

      {/* Terms and conditions */}
      <div className="flex items-start gap-2 text-xs text-gray-500 mb-6">
        <input
          type="checkbox"
          id="terms"
          className="mt-1 h-3 w-3"
          defaultChecked
        />
        <label htmlFor="terms" className="flex-1">
          I agree to the{" "}
          <button className="underline hover:text-gray-700">terms and conditions</button>
        </label>
      </div>

      {/* Payment button */}
      <CustomButton
        label={
          addresses.length === 0
            ? "Add Address First"
            : `Pay ${currency(totals.grandTotal)}`
        }
        loading={false}
        onClick={() => {
          if (addresses.length === 0) {
            window.location.href = '/user#add-address';
          } else {
            onPayment();
          }
        }}
        disabled={addresses.length === 0}
      />
    </div>
  );
}