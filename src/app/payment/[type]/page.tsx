//app/payment/[type]/page.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft } from 'react-icons/fa';
import PageHeading from "@/components/shared/PageHeading";
import CustomButton from "@/components/ui/CustomButton";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { useAddress } from "@/hooks/useAddress";
import { getProductById } from "@/services/product.service";
import { Product } from "@/lib/types/product";
import { CartItem } from "@/lib/types/cart";
import { useAuth } from "@/hooks/useAuth";
import { useToastActions } from "@/hooks/useToastActions";
import Script from "next/script";
import axios from "axios";
import { RazorpayOptions, RazorpayOrderResponse } from "@/lib/types/razorpay";
import { subscribeOrderSSE } from "@/hooks/useOrderSse";


function currency(amount: number) {
  return `₹${amount.toLocaleString()}`;
}

export default function PaymentPage() {
  const params = useParams<{ type: string }>();
  const router = useRouter();
  const { type } = params;
  const { userId, token, user } = useAuth();
  const { cart, loading: cartLoading, fetchCart } = useCart();
  const { addresses, loading: addressLoading, fetchAddresses } = useAddress();
  const { showError, showSuccess, showInfo } = useToastActions();

  const [singleProduct, setSingleProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [quantity] = useState(1);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // useEffect(( ) => { 
  //   console.log(cartLoading, "this is cartLoading baler");
  //   console.log(cart, "this is cart baler"); 
  //   console.log(singleProduct, "this is singleProduct baler");
  // }, [cartLoading]); 

  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  // Determine if this is cart or single product payment
  const isCartPayment = type === 'cart';
  const isSingleProductPayment = type !== 'cart';

  // Fetch single product if it's a single product payment
  useEffect(() => {
    if (isSingleProductPayment && type) {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const product = await getProductById(type, token!);
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

  // Get items based on payment type
  const items = useMemo(() => {
    if (isCartPayment && cart) {
      return cart.items.map((item: CartItem) => ({
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
      }));
    } else if (isSingleProductPayment && singleProduct) {
      return [{
        id: singleProduct.productId,
        name: singleProduct.productName,
        brand: singleProduct.brand,
        // category: singleProduct.category || '',
        // description: singleProduct.description || '',
        price: singleProduct.price,
        currentPrice: singleProduct.currentPrice,
        quantity: quantity,
        imageUrl: singleProduct.imageUrls[0] || '/images/logo.svg',
        totalCurrentPrice: singleProduct.currentPrice * quantity
      }];
    }
    return [];
  }, [isCartPayment, cart, isSingleProductPayment, singleProduct, quantity]);

  // Calculate totals
  const totals = useMemo(() => {
    if (isCartPayment && cart) {
      return {
        subTotal: cart.totalOriginalPrice,
        currentTotal: cart.totalCurrentPrice,
        discount: cart.totalOriginalPrice - cart.totalCurrentPrice,
        deliveryCharges: cart.totalDeliveryCharges,
        platformCharges: cart.totalPlatformCharges,
        grandTotal: cart.finalTotal,
      };
    } else if (isSingleProductPayment && singleProduct) {
      const subTotal = singleProduct.price * quantity;
      const currentTotal = singleProduct.currentPrice * quantity;
      const discount = subTotal - currentTotal;
      const deliveryCharges =  49;
      const platformCharges = 14.16; // Approximate platform charges
      const grandTotal = currentTotal + deliveryCharges + platformCharges;
      return { subTotal, currentTotal, discount, deliveryCharges, platformCharges, grandTotal };
    }
    return { subTotal: 0, currentTotal: 0, discount: 0, deliveryCharges: 0, platformCharges: 0, grandTotal: 0 };
  }, [isCartPayment, cart, isSingleProductPayment, singleProduct, quantity]);


  // const onRemove = (id: string) => {
  //   if (isCartPayment) {
  //     // For cart payments, removal is handled by cart context
  //     return;
  //   }
  //   // For single product payments, redirect back
  //   router.push('/');
  // };

  const selectedAddress = addresses.find(a => a.addressId === selectedAddressId) ?? addresses[0];


  const handlePayment = async (): Promise<void> => {
    if (!razorpayLoaded) {
      showError("Error", "Razorpay SDK not loaded yet. Please try again in a moment.", 3000);
      return;
    }
    
    if (!selectedAddress) {
      showError("Error", "Please select a delivery address to continue.", 3000);
      return;
    }
    
    // SSE
    if (user?.userId) {
      subscribeOrderSSE(
        user.userId,
        (event) => {
          console.log("SSE Event:", event);

          if (event.type === "ORDER_CREATING") {
            showInfo("Info", "Order is being created. Please wait...", 4000);
            console.log('Order is being created')
          }
          if (event.type === "ORDER_CREATED") {
            showSuccess("Success", `Order created successfully! Order ID: ${event.orderId}`, 5000)
            console.log('Order created successfully')
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
    try {
      const { data } = await axios.post<RazorpayOrderResponse>(`${baseUrl}/api/payment/razorpay/order`, {
        amount: totals.grandTotal,
        receipt: `rcpt_${Date.now()}`,
        orderId: `order_${Date.now()}`,
        userId: user?.userId,
        address: selectedAddress,
        totalAmount: 100,
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      if (!data.success) {
        alert("Order creation failed");
        return;
      }

      const options: RazorpayOptions = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Jubili",
        description: "Safe & Secure Payment using Razorpay",
        order_id: data.order.id,

        handler: async (response) => {
          try {
            const verify = await axios.post(
              `${baseUrl}/api/payment/razorpay/verify`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderId: data.order.id,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            console.log("data dot order dot id", data.order.id);
            console.log("Sudhu data", data);
            
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

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Payment error");
    }
  };

  // Show loading state
  if (loading || (isCartPayment && cartLoading) || addressLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <PageHeading title="Loading..." />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
            <div className="bg-white rounded-2xl border border-gray-300 overflow-hidden">
              <div className="hidden md:grid grid-cols-12 items-center px-6 py-3 border-b border-gray-300 text-gray-500 font-semibold text-sm">
                <div className="col-span-10">Product Info</div>
                <div className="col-span-2 text-center">Total</div>
              </div>
              {items.map(item => {
                return (
                  <div
                    key={item.id}
                    className="flex flex-col md:grid md:grid-cols-12 items-start md:items-center px-6 py-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
                  >
                    {/* info */}
                    <div className="col-span-8 w-full md:w-auto mb-4 md:mb-0">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={item.imageUrl ?? ""}
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
                            {/* {item.category && (
                              <>
                                <span className="mx-1">•</span>
                                <span>Category: {item.category}</span>
                              </>
                            )} */}
                          </div>
                          {item.price > item.currentPrice && (
                            <div className="text-xs text-gray-500 mt-1">
                              MRP: <span className="line-through">{currency(item.price * item.quantity)}</span>
                              <span className="ml-2 text-green-600">
                                ({Math.round(((item.price - item.currentPrice) / item.price) * 100)}% off)
                              </span>
                            </div>
                          )}
                          {/* {item.description && (
                            <div className="text-xs text-gray-400 mt-1 truncate">
                              {item.description}
                            </div>
                          )} */}
                        </div>
                      </div>
                    </div>

                    {/* qty */}
                    <div className="flex items-center gap-2 col-span-2 w-full md:justify-center mb-4 md:mb-0">
                      {/* {isSingleProductPayment ? (
                        <>    
                          <span className="mx-2 font-medium text-base min-w-[2ch] text-center">{item.quantity}</span>
                        </>
                      ) : ( */}
                        <span className="font-medium text-base">{item.quantity}</span>
                      
                    </div>

                    {/* total */}
                    <div className="col-span-2 w-full md:text-center mb-4 md:mb-0">
                      <div className="flex flex-col items-start md:items-center">
                        <span className="font-semibold text-lg text-gray-900">{currency(item.totalCurrentPrice)}</span>
                        {item.price > item.currentPrice && (
                          <div className="text-xs text-gray-500 mt-1">
                            <span className="line-through mr-1">{currency(item.price * item.quantity)}</span>
                            <span className="text-green-600">
                              ({Math.round(((item.price - item.currentPrice) / item.price) * 100)}% off)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl border border-gray-300 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Delivery Address</h2>
                <a href="/user#add-address" className="text-sm text-blue-600 hover:underline">+ Add new address</a>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-4">No addresses found</div>
                  <a 
                    href="/user#add-address" 
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Add Your First Address
                  </a>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {addresses.map(addr => (
                      <label key={addr.addressId} className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === addr.addressId}
                          onChange={() => setSelectedAddressId(addr.addressId)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <div className="font-medium flex items-center gap-2">
                              <span>{addr.addressType || 'Address'}</span>
                              {addr.isDefault && (
                                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full">Default</span>
                              )}
                              {addr.addressId === selectedAddressId && (
                                <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full">Selected</span>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-gray-700">
                            <div className="font-medium">{addr.name} • {addr.phoneNumber}</div>
                            <div className="text-gray-600">
                              {addr.addressLine1}
                              {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                              <br />
                              {addr.city}, {addr.state} - {addr.postalCode}
                              <br />
                              {addr.country}
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  {selectedAddress && (
                    <div className="mt-4 text-sm text-gray-600">
                      Delivering to: <span className="font-medium text-gray-800">{selectedAddress.name}</span>, {selectedAddress.addressLine1}, {selectedAddress.city}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right: Summary */}
          <div className="md:col-span-1">
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

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Sub Total ({items.reduce((s, it) => s + it.quantity, 0)} items)</span>
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
                  <span>{totals.deliveryCharges > 0 ? currency(totals.deliveryCharges) : "Free"}</span>
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

              <div className="flex items-start gap-2 text-xs text-gray-500 mb-6">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 h-3 w-3"
                  defaultChecked
                />
                <label htmlFor="terms" className="flex-1">
                  I agree to the <button className="underline hover:text-gray-700">terms and conditions</button>
                </label>
              </div>

              <CustomButton
                label={addresses.length === 0 ? "Add Address First" : `Pay ${currency(totals.grandTotal)}`}
                loading={false}
                onClick={() => {
                  if (addresses.length === 0) {
                    window.location.href = '/user#add-address';
                  } else {
                    handlePayment();
                  }
                }}
                disabled={addresses.length === 0}
              />
            </div>
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
