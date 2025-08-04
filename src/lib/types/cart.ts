export interface CartItem {
  productId: string;
  productName: string;
  imageUrl: string;
  color: string;
  size: string;
  gender: string;
  material: string;
  brand: string;
  sellerId: string;
  price: number;
  discountOnProduct: number;
  discountAmount: number;
  quantity: number;
  totalDiscountedPrice: number;
}

export interface CartResponse {
  totalItems: number;
  items: CartItem[];
  totalOriginalPrice: number;
  totalDiscount: number;
  subtotal: number;
  shippingCharge: number;
  finalTotal: number;
  message: string;
}
