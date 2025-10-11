import { useMemo } from "react";
import { Product } from "@/lib/types/product";
import { CartResponse } from "@/lib/types/cart";
import { calculateCartTotals, calculateSingleProductTotals } from "@/lib/utils/payment.utils";

export interface PaymentTotals {
  subTotal: number;
  currentTotal: number;
  discount: number;
  deliveryCharges: number;
  platformCharges: number;
  grandTotal: number;
}

export function usePaymentTotals(
  isCartPayment: boolean,
  cart: CartResponse | null,
  isSingleProductPayment: boolean,
  singleProduct: Product | null,
  quantity: number
) {
  const totals = useMemo((): PaymentTotals => {
    if (isCartPayment && cart) {
      return calculateCartTotals(cart);
    } else if (isSingleProductPayment && singleProduct) {
      return calculateSingleProductTotals(singleProduct, quantity);
    }
    return { 
      subTotal: 0, 
      currentTotal: 0, 
      discount: 0, 
      deliveryCharges: 0, 
      platformCharges: 0, 
      grandTotal: 0 
    };
  }, [isCartPayment, cart, isSingleProductPayment, singleProduct, quantity]);

  return totals;
}