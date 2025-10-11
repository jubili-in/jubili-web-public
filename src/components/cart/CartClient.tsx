'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import AuthPopup from '@/components/shared/AuthPopup';
import CustomButton from '@/components/ui/CustomButton';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';

// Loading component - FIXED: No longer covers navbar
import PageHeading from "@/components/shared/PageHeading";

function LoadingSpinner() {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <PageHeading title="What's in your Bag?" />
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center">
          <img src="/icons/loading.svg" alt="Loading..." className="w-8 h-8 animate-spin mb-4" />
          <div className="text-lg font-medium text-gray-700">Loading cart...</div>
        </div>
      </div>
    </div>
  );
}

// Error component
function ErrorMessage({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <PageHeading title="What's in your Bag?" />
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-red-800 font-medium mb-2">Error loading cart</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={onRetry}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

// Empty cart component
function EmptyCart({ onContinueShopping }: { onContinueShopping: () => void }) {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <PageHeading title="What's in your Bag?" />
      <div className="text-center py-12">
        <div className="mb-6">
          <svg 
            className="mx-auto h-16 w-16 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 9H6L5 9z" 
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven&apos;t added any products to your cart yet.</p>
        <CustomButton
          label="Continue Shopping"
          loading={false}
          onClick={onContinueShopping}
        />
      </div>
    </div>
  );
}

export const CartClient = () => {
  const router = useRouter();
  const { cart, loading, error, fetchCart, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [voucher, setVoucher] = useState('');
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only fetch cart when we have a logged in user
    if (!user) return;
    fetchCart();
  }, [fetchCart, user]);

  const handleContinueShopping = useCallback(() => {
    router.push('/search');
  }, [router]);

  const handleCheckout = useCallback(() => {
    router.push('/payment/cart');
  }, [router]);

  const handleRetry = useCallback(() => {
    fetchCart();
  }, [fetchCart]);

  const handleVoucherApply = useCallback(() => {
    // TODO: Implement voucher application logic
    console.log('Applying voucher:', voucher);
  }, [voucher]);

  const handleQuantityChange = useCallback(async (
    productId: string, 
    currentQuantity: number, 
    delta: number,
    // size: string,
    // color: string
  ) => {
    const newQuantity = currentQuantity + delta;
    const itemKey = `${productId}`;
    
    if (newQuantity < 1) return;

    setLoadingItems(prev => ({ ...prev, [itemKey]: true }));

    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setLoadingItems(prev => ({ ...prev, [itemKey]: false }));
    }
  }, [updateQuantity]);

  const handleRemoveItem = useCallback(async (
    productId: string,
    
  ) => {
    const itemKey = `${productId}`;
    
    setLoadingItems(prev => ({ ...prev, [itemKey]: true }));

    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setLoadingItems(prev => ({ ...prev, [itemKey]: false }));
    }
  }, [removeFromCart]);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Avoid rendering until mounted to prevent hydration mismatch
  if (!mounted) return null;

  // If user is not authenticated show the auth popup used elsewhere in the app
  if (!user) {
    return <AuthPopup />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={handleRetry} />;
  }

  if (!cart || cart.totalItems === 0) {
    return <EmptyCart onContinueShopping={handleContinueShopping} />;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <PageHeading title="What's in your Bag?" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Cart Items */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-300 overflow-hidden">
            {/* Table Header - hidden on mobile */}
            <div className="hidden md:grid grid-cols-12 items-center px-6 py-3 border-b border-gray-300 text-gray-500 font-semibold text-sm">
              <div className="col-span-5">Product Info</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-2 text-center">Total</div>
              <div className="col-span-2 text-center">Action</div>
            </div>

            {/* Cart Items */}
            {cart.items.map((item) => {
              const itemKey = `${item.productId}`;
              // -${item.size}-${item.color}
              const isItemLoading = loadingItems[itemKey] || false;
              
              return (
                <div
                  key={itemKey}
                  className="flex flex-col md:grid md:grid-cols-12 items-start md:items-center px-6 py-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
                >
                  {/* Product Info */}
                  <Link href={`/product/${item.productId}`} className="flex items-center gap-4 col-span-5 w-full md:w-auto mb-4 md:mb-0">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image 
                        src={item.imageUrl ?? "/placeholder.png"} 
                        alt={item.productName ?? "Product image"} 
                        fill
                        className="object-cover rounded-lg" 
                        sizes="64px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-base text-gray-900 break-words hover:underline">
                        {item.productName}
                      </h3>
                      <div className="text-xs text-gray-500 mt-1">
                        <span>Brand: {item.brand}</span>
                        <span className="mx-1">•</span>
                        <span>Category: {item.category}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1 truncate">
                        {item.description}
                      </div>
                    </div>
                  </Link>

                  {/* Quantity */}
                  <div className="flex items-center gap-2 col-span-3 w-full md:justify-center mb-4 md:mb-0">
                    <button 
                      className="w-8 h-8 rounded-full border border-gray-300 text-sm font-bold flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed" 
                      disabled={isItemLoading || item.quantity <= 1}
                      onClick={() => handleQuantityChange(item.productId, item.quantity, -1)}
                      // item.size, item.color
                      aria-label="Decrease quantity"
                    >
                      <FaMinus size={10} />
                    </button>
                    <span className="mx-2 font-medium text-base min-w-[2ch] text-center">
                      {isItemLoading ? '...' : item.quantity}
                    </span>
                    <button 
                      className="w-8 h-8 rounded-full border border-gray-300 text-sm font-bold flex items-center justify-center hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed" 
                      disabled={isItemLoading}
                      onClick={() => handleQuantityChange(item.productId, item.quantity, 1,)}
                      aria-label="Increase quantity"
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>

                  {/* Total */}
                  <div className="col-span-2 w-full md:text-center mb-4 md:mb-0">
                    <div className="flex flex-col items-start md:items-center">
                      <span className="font-semibold text-lg text-gray-900">
                        ₹{item.totalCurrentPrice}
                      </span>
                      {item.price > item.currentPrice && (
                        <div className="text-xs text-gray-500 mt-1">
                          <span className="line-through mr-1">
                            ₹{(item.price * item.quantity)}
                          </span>
                          <span className="text-green-600">
                            ({Math.round(((item.price - item.currentPrice) / item.price) * 100)}% off)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="col-span-2 w-full md:text-center">
                    <button 
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 transition text-gray-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed" 
                      disabled={isItemLoading}
                      onClick={() => handleRemoveItem(item.productId, )}
                      aria-label="Remove item from cart"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-300 p-6 sticky top-4">
            <h2 className="font-semibold text-lg mb-6">Order Summary</h2>

            {/* Voucher input */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Discount voucher"
                className="w-full rounded-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 pr-20"
                value={voucher}
                onChange={(e) => setVoucher(e.target.value)}
              />
              <button
                onClick={handleVoucherApply}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gray-900 text-white px-4 py-2 text-xs font-semibold hover:bg-black transition shadow"
                disabled={!voucher.trim()}
              >
                Apply
              </button>
            </div>

            {/* Summary items */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span>Sub Total ({cart.totalItems} items)</span>
                <span>₹{cart.totalOriginalPrice}</span>
              </div>
              
              {(cart.totalOriginalPrice - cart.totalCurrentPrice) > 0 && (
                <div className="flex justify-between text-sm text-green-700">
                  <span>Discount</span>
                  <span>-₹{(cart.totalOriginalPrice - cart.totalCurrentPrice)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span>Approx Delivery Charges</span>
                <span>
                  {cart.totalDeliveryCharges > 0 
                    ? `₹${cart.totalDeliveryCharges}`
                    : 'Free'
                  }  
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Platform Charges</span>
                <span>₹{cart.totalPlatformCharges}</span>
              </div>
              
              <hr className="my-4" />
              
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>₹{cart.finalTotal}</span>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2 text-xs text-gray-500 mb-6">
              <input 
                type="checkbox" 
                id="terms"
                className="mt-1 h-3 w-3"
                defaultChecked
              />
              <label htmlFor="terms" className="flex-1">
                I agree to the{' '}
                <button className="underline hover:text-gray-700">
                  terms and conditions
                </button>
              </label>
            </div>

            <CustomButton
              label={`Checkout Now (₹${cart.finalTotal})`}
              loading={loading}
              onClick={handleCheckout}
            />
            
            <div className="mt-4 text-center">
              <button 
                onClick={handleContinueShopping}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};