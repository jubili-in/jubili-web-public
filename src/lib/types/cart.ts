// src/lib/types/cart.ts (Updated with simplified structure)

export interface CartAction {
  userId: string;
  actionType: 'CART';
  productId: string;
  quantity: string;
}

export interface CartActionResponse {
  userId: string;
  actionType: 'CART';
  productId: string;
  quantity: string;
  createdAt: string;
}

export interface Dimensions {
  length: number;
  breadth: number;
  height: number;
  weight: number;
}

export interface CartItem {
  productId: string;
  productName: string;
  imageUrl: string | null;
  brand: string;
  sellerId: string;
  sellerName: string;
  price: number;           // Original price per unit
  currentPrice: number;    // Current price per unit
  quantity: number;
  totalCurrentPrice: number;  // currentPrice * quantity
  deliveryCharges: number;    // Flat ₹49 per item
  platformCharges: number;    // Platform charges for this item (₹14.16 per product)
  category: string;
  description: string;

   addressId: string;
  dimensions: Dimensions;
}

export interface CartResponse {
  totalItems: number;
  items: CartItem[];
  totalOriginalPrice: number;   // Sum of all original prices
  totalCurrentPrice: number;    // Sum of all current prices
  totalDeliveryCharges: number; // Total delivery charges (₹49 per item)
  totalPlatformCharges: number; // Total platform charges 
  subtotal: number;             // Same as totalCurrentPrice
  finalTotal: number;           // subtotal + totalDeliveryCharges + totalPlatformCharges
  message: string;
}

export interface CartDelete {
  userId: string;
  actionType: 'CART';
  productId: string;
}

// Helper function for calculating discount percentage in frontend
// export const calculateDiscountPercentage = (originalPrice: number, currentPrice: number): number => {
//   if (originalPrice <= 0) return 0;
//   return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
// };