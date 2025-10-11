import { useMemo, useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { getProductById } from "@/services/product.service";
import { Product } from "@/lib/types/product";
import { Dimensions } from "@/lib/types/cart";
import { useToastActions } from "@/hooks/useToastActions";
import { useRouter } from "next/navigation";
import { mapCartItemsToPaymentItems, mapSingleProductToPaymentItem } from "@/lib/utils/payment.utils";

export interface PaymentItem {
  id: string;
  name: string;
  brand: string;
  category?: string;
  description?: string;
  price: number;
  currentPrice: number;
  quantity: number;
  imageUrl: string | null;
  totalCurrentPrice: number;
  sellerId?: string;
  dimentions: Partial<Dimensions>;
}

export function usePaymentItems(type: string, userId?: string, token?: string) {
  const router = useRouter();
  const { cart, loading: cartLoading, fetchCart } = useCart();
  const { showError } = useToastActions();
  const [singleProduct, setSingleProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [quantity] = useState(1);

  // Determine payment type
  const isCartPayment = type === 'cart';
  const isSingleProductPayment = type !== 'cart';

  // Fetch single product if it's a single product payment
  useEffect(() => {
    if (isSingleProductPayment && type && token) {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const product = await getProductById(type, token);
          console.log("Fetched product:", product);
          setSingleProduct(product);
        } catch (error) {
          console.error('Error fetching product:', error);
          showError('Error', 'Failed to fetch product details', 5000);
          router.push('/');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [type, isSingleProductPayment, token, showError, router]);

  // Fetch cart if it's a cart payment
  useEffect(() => {
    if (isCartPayment && userId) {
      fetchCart();
    }
  }, [isCartPayment, userId, fetchCart]);

  // Get items based on payment type
  const items = useMemo(() => {
    if (isCartPayment && cart) {
      return mapCartItemsToPaymentItems(cart.items);
    } else if (isSingleProductPayment && singleProduct) {
      console.log("Single product for payment:", singleProduct);
      return mapSingleProductToPaymentItem(singleProduct, quantity);
    }
    return [];
  }, [isCartPayment, cart, isSingleProductPayment, singleProduct, quantity]);

  return {
    items,
    singleProduct,
    cart,
    loading: loading || (isCartPayment && cartLoading),
    isCartPayment,
    isSingleProductPayment,
    quantity,
  };
}