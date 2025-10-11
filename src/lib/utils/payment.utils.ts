import { CartItem, CartResponse } from "@/lib/types/cart";
import { Product } from "@/lib/types/product";

/**
 * Format currency with Indian Rupee symbol
 */
export function currency(amount: number): string {
  return `₹${amount.toLocaleString()}`;
}

/**
 * Calculate totals for cart payment
 */
export function calculateCartTotals(cart: CartResponse) {
  return {
    subTotal: cart.totalOriginalPrice,
    currentTotal: cart.totalCurrentPrice,
    discount: cart.totalOriginalPrice - cart.totalCurrentPrice,
    deliveryCharges: cart.totalDeliveryCharges,
    platformCharges: cart.totalPlatformCharges,
    grandTotal: cart.finalTotal,
  };
}

/**
 * Calculate totals for single product payment
 */
export function calculateSingleProductTotals(singleProduct: Product, quantity: number) {
  const subTotal = singleProduct.price * quantity;
  const currentTotal = singleProduct.currentPrice * quantity;
  const discount = subTotal - currentTotal;
  const deliveryCharges = 49;
  const platformCharges = 14.16; // Approximate platform charges
  const grandTotal = currentTotal + platformCharges;
  
  return { subTotal, currentTotal, discount, deliveryCharges, platformCharges, grandTotal };
}

/**
 * Map cart items to payment items format
 */
export function mapCartItemsToPaymentItems(cartItems: CartItem[]) {
  return cartItems.map((item: CartItem) => ({
    id: item.productId,
    name: item.productName,
    brand: item.brand,
    category: item.category,
    description: item.description,
    price: item.price, // Original price per unit
    currentPrice: item.currentPrice, // Current price per unit
    quantity: item.quantity,
    imageUrl: item.imageUrl,
    totalCurrentPrice: item.totalCurrentPrice, // Current total for this item
    sellerId: item.sellerId,
    dimentions: item.dimensions,
  }));
}

/**
 * Map single product to payment item format
 */
export function mapSingleProductToPaymentItem(singleProduct: Product, quantity: number) {
  return [{
    id: singleProduct.productId,
    name: singleProduct.productName,
    brand: singleProduct.brand,
    price: singleProduct.price,
    currentPrice: singleProduct.currentPrice,
    quantity: quantity,
    imageUrl: singleProduct.imageUrls[0] || '/images/logo.svg',
    totalCurrentPrice: singleProduct.currentPrice * quantity,
    sellerId: singleProduct.sellerId,
    dimentions: singleProduct.dimensions,
  }];
}

/**
 * Build unique delivery requests for cost calculation
 */
export function buildUniqueDeliveryRequests(
  cartItems: CartItem[] | null,
  singleProduct: Product | null,
  destinationPincode: string
) {
  const uniqueRequests = new Map<
    string,
    { origin: string; length: number; breadth: number; height: number; weight: number }
  >();

  // Add cart items
  cartItems?.forEach((item) => {
    const origin = item.addressId.split("-")[0];
    const { length, breadth, height, weight } = item.dimensions || { length: 0, breadth: 0, height: 0, weight: 0 };

    const key = `${origin}-${destinationPincode}-${length}-${breadth}-${height}-${weight}`;
    if (!uniqueRequests.has(key)) {
      uniqueRequests.set(key, { origin, length, breadth, height, weight });
    }
  });

  // Add single product
  if (singleProduct) {
    const origin = singleProduct.addressId ? singleProduct.addressId.split("-")[0] : "";
    const dims = singleProduct.dimensions || {};
    const length = dims.length || 0;
    const breadth = dims.breadth || 0;
    const height = dims.height || 0;
    const weight = dims.weight || 0;
    
    const key = `${origin}-${destinationPincode}-${length}-${breadth}-${height}-${weight}`;
    if (!uniqueRequests.has(key)) {
      uniqueRequests.set(key, { origin, length, breadth, height, weight });
    }
  }

  return Array.from(uniqueRequests.values());
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercentage(originalPrice: number, currentPrice: number): number {
  if (originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

/**
 * Map delivery charges array to individual products
 * Returns the specific delivery charge for each product
 */
export function mapDeliveryChargesToProducts(
  cartItems: CartItem[] | null,
  singleProduct: Product | null,
  deliveryCharges: number[],
  destinationPincode: string
): Map<string, number> {
  const deliveryMap = new Map<string, number>();
  const uniqueRequests = new Map<string, number>();

  // Map unique requests to their delivery charges
  const requests = buildUniqueDeliveryRequests(cartItems, singleProduct, destinationPincode);
  requests.forEach((req, index) => {
    const key = `${req.origin}-${destinationPincode}-${req.length}-${req.breadth}-${req.height}-${req.weight}`;
    if (deliveryCharges[index] !== undefined) {
      uniqueRequests.set(key, deliveryCharges[index]);
    }
  });

  // Map cart items to their respective delivery charges
  cartItems?.forEach((item) => {
    const origin = item.addressId.split("-")[0];
    const { length, breadth, height, weight } = item.dimensions || { length: 0, breadth: 0, height: 0, weight: 0 };
    const key = `${origin}-${destinationPincode}-${length}-${breadth}-${height}-${weight}`;
    
    const charge = uniqueRequests.get(key) || 0;
    deliveryMap.set(item.productId, charge);
  });

  // Map single product to its delivery charge
  if (singleProduct) {
    const origin = singleProduct.addressId ? singleProduct.addressId.split("-")[0] : "";
    const dims = singleProduct.dimensions || {};
    const length = dims.length || 0;
    const breadth = dims.breadth || 0;
    const height = dims.height || 0;
    const weight = dims.weight || 0;
    
    const key = `${origin}-${destinationPincode}-${length}-${breadth}-${height}-${weight}`;
    const charge = uniqueRequests.get(key) || 0;
    deliveryMap.set(singleProduct.productId, charge);
  }

  return deliveryMap;
}
