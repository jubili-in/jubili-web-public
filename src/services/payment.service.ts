import axios from "axios";
import { RazorpayOptions, RazorpayOrderResponse } from "@/lib/types/razorpay";
import { PaymentItem } from "@/hooks/usePaymentItems";
import { PaymentTotals } from "@/hooks/usePaymentTotals";
import { Address } from "@/lib/types/address";
import { User } from "@/lib/types/auth";
import { CartResponse } from "@/lib/types/cart";
import { Product } from "@/lib/types/product";
import { subscribeOrderSSE } from "@/hooks/useOrderSse";
import { mapDeliveryChargesToProducts } from "@/lib/utils/payment.utils";

interface PaymentHandlerParams {
  totals: PaymentTotals;
  items: PaymentItem[];
  selectedAddress: Address;
  user: User | null;
  token: string;
  delhiveryCharges: number[];
  cart: CartResponse | null;
  singleProduct: Product | null;
  showError: (title: string, message: string, duration?: number) => void;
  showSuccess: (title: string, message: string, duration?: number) => void;
  showInfo: (title: string, message: string, duration?: number) => void;
  razorpayLoaded: boolean;
}

export class PaymentService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  static async handlePayment({
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
  }: PaymentHandlerParams): Promise<void> {
    if (!razorpayLoaded) {
      showError("Error", "Razorpay SDK not loaded yet. Please try again in a moment.", 3000);
      return;
    }

    if (!selectedAddress) {
      showError("Error", "Please select a delivery address to continue.", 3000);
      return;
    }

    // Subscribe to SSE for order updates
    this.subscribeToOrderUpdates(user?.userId, showInfo, showSuccess, showError);

    try {
    // Create delivery charges map for individual products
    const destination = selectedAddress.addressId.split("-")[0];
    const deliveryMap = mapDeliveryChargesToProducts(
      cart?.items || null,
      singleProduct,
      delhiveryCharges,
      destination
    );

    // Create Razorpay order
    const orderResponse = await this.createRazorpayOrder({
      totals,
      items,
      selectedAddress,
      user,
      token,
      deliveryMap,
    });

      if (!orderResponse.data.success) {
        alert("Order creation failed");
        return;
      }

      // Initialize Razorpay checkout
      const options: RazorpayOptions = this.createRazorpayOptions(
        orderResponse.data,
        user,
        items,
        token
      );

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Payment error");
    }
  }

  private static subscribeToOrderUpdates(
    userId: string | undefined,
    showInfo: (title: string, message: string, duration?: number) => void,
    showSuccess: (title: string, message: string, duration?: number) => void,
    showError: (title: string, message: string, duration?: number) => void
  ) {
    if (userId) {
      subscribeOrderSSE(
        userId,
        (event) => {
          console.log("SSE Event:", event);

          if (event.type === "ORDER_CREATING") {
            showInfo("Info", "Order is being created. Please wait...", 4000);
            console.log('Order is being created');
          }
          if (event.type === "ORDER_CREATED") {
            showSuccess("Success", `Order created successfully! Order ID: ${event.orderId}`, 5000);
            console.log('Order created successfully');
          }
          if (event.type === "ORDER_FAILED") {
            showError("Order Failed", event.message || "Order failed", 5000);
          }
        },
        () => {
          console.log("SSE closed after final event.");
        }
      );
    }
  }

  private static async createRazorpayOrder({
    totals,
    items,
    selectedAddress,
    user,
    token,
    deliveryMap,
  }: {
    totals: PaymentTotals;
    items: PaymentItem[];
    selectedAddress: Address;
    user: User | null;
    token: string;
    deliveryMap: Map<string, number>;
  }) {
    return await axios.post<RazorpayOrderResponse>(
      `${this.baseUrl}/api/payment/razorpay/order`,
      {
        amount: totals.grandTotal,
        receipt: `rcpt_${Date.now()}`,
        orderId: `order_${Date.now()}`,
        totalAmount: totals.grandTotal,

        // User info
        userId: user?.userId,
        customerName: selectedAddress.name,
        customerEmail: user?.email,
        customerPhone: selectedAddress.phoneNumber,

        // Address info
        address: selectedAddress,
        transportMode: 'Surface',
        paymentMode: 'Prepaid',
        codAmount: 0,

        items: items.map(item => ({
          // Seller address info
          pickupLocation: "SOUMIK",
          prodcutDimention: item.dimentions,
          sellerId: item.sellerId,

          productName: item.name,
          productId: item.id,
          packagingType: 'Box',
          fragile: false,

          // Price
          quantity: item.quantity,
          price: item.price,
          unitItemPrice: item.currentPrice,
          deliveryByUser: deliveryMap.get(item.id) || 0,
          deliveryBySeller: deliveryMap.get(item.id) || 0,
          serviceCharge: 10,
        })),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  private static createRazorpayOptions(
    orderData: RazorpayOrderResponse,
    user: User | null,
    items: PaymentItem[],
    token: string
  ): RazorpayOptions {
    return {
      key: orderData.key,
      amount: orderData.order.amount,
      currency: orderData.order.currency,
      name: "Jubili",
      description: "Safe & Secure Payment using Razorpay",
      order_id: orderData.order.id,

      handler: async (response) => {
        try {
          const productIds = items.map(item => item.id);
          console.log("productIds:", productIds, "Baler");
          console.log("Is array?", Array.isArray(productIds), "sudam");

          const verify = await axios.post(
            `${this.baseUrl}/api/payment/razorpay/verify`,
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderData.order.id,
              productIds
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("data dot order dot id", orderData.order.id);
          console.log("Sudhu data", orderData);

          if (verify.data.success) {
            alert("Payment Successful!");
          } else {
            alert("Payment verification failed");
          }
        } catch (err) {
          console.error(err);
          alert("Verification error");
        }
      },

      prefill: {
        name: user?.name || "unnamed",
        email: user?.email || "unknown@example.com",
        contact: user?.phone || "unknown",
      },
      theme: { color: "#3399cc" },
    };
  }
}