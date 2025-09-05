//src/app/product/[id]/page.tsx
"use client";

import { Suspense, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProduct } from '@/hooks/useProduct';
import { useCart } from '@/hooks/useCart';
import CustomButton from '@/components/ui/CustomButton';
import { toggleProductLike } from '@/services/product.service';
import ImageCarousel from '@/components/product/ImageCarousel';

function LoadingSpinner() {
  return (
    <div className="flex h-full items-center justify-center py-12">
      <img src="/icons/loading.svg" alt="Loading..." className="w-8 h-8 animate-spin" />
    </div>
  );
}

function ErrorMessage({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="text-center py-12">
      <p className="text-red-600 mb-4">{error}</p>
      <button onClick={onRetry} className="text-blue-500 underline hover:text-blue-700">Try again</button>
    </div>
  );
}

function ProductContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id ?? null;
  const { token } = useAuth();
  const { isLoading, product, error, retry, handleLikeToggle } = useProduct(id, token || undefined);
  const { addToCart, loading: cartLoading } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  // Initialize and update like state from product data
  useEffect(() => {
    if (product) {
      setIsLiked(product.isLiked ?? false);
      setLikeCount(product.likeCount);
    }
  }, [product]);

  const handleLikeToggleClick = async () => {
    if (!token) {
      console.warn('User must be logged in to like products');
      return;
    }

    if (likeLoading || !product) return;

    setLikeLoading(true);
    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;
    const newIsLiked = !isLiked;

    // Optimistic update
    setIsLiked(newIsLiked);
    setLikeCount(prev => newIsLiked ? prev + 1 : prev - 1);

    try {
      await toggleProductLike(product.productId, token);
      handleLikeToggle(product.productId, newIsLiked);
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(previousIsLiked);
      setLikeCount(previousLikeCount);
      console.error("Failed to toggle like:", error);
    } finally {
      setLikeLoading(false);
    }
  };

  if (!id) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No product selected.</p>
      </div>
    );
  }

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={retry} />;
  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Product not found.</p>
      </div>
    );
  }

  const price = product?.price ?? 0;
  // const discount = product?.discount ?? 0;
  // const hasDiscount = discount > 0;
  const discountedPrice = product?.currentPrice ? product.currentPrice : price; 

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gallery */}
        <div>
          <ImageCarousel 
            images={product.imageUrls || []} 
            productName={product.productName} 
          />
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start gap-3">
            <div>
              <div className="text-sm text-gray-500">{product.brand || 'Brand'}</div>
              <h1 className="text-2xl font-semibold mt-1">{product.productName}</h1>
            </div>
            <div className="ml-auto">
              <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 text-xs px-2 py-1">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
            </div>
          </div>

          {/* Rating placeholder */}
          <div className="mt-2 flex items-center gap-2">
            <button 
              onClick={handleLikeToggleClick}
              disabled={likeLoading}
              className="flex items-center gap-1 disabled:opacity-50"
              aria-label={isLiked ? 'Unlike product' : 'Like product'}
            >
              <img
                src={isLiked ? '/icons/like_filled.svg' : '/icons/like_outlined.svg'}
                alt={isLiked ? 'Liked' : 'Not liked'}
                width={16}
                height={16}
                className={`transition-all ${likeLoading ? 'opacity-50' : ''}`}
              />
            </button>
            <span className="text-sm text-gray-500">{likeCount} likes</span>
          </div>

          {/* Price */}
          <div className="mt-4 flex items-center gap-3">
            <div className="text-2xl font-semibold">₹{discountedPrice?.toFixed(2)}</div>
            {/* {hasDiscount && (
              <>
                <span className="text-gray-400 line-through">₹{product.price}</span>
                <span className="text-green-600 font-medium">{product.discount}% off</span>
              </>
            )} */}
          </div>

          {/* Description */}
          <p className="mt-4 text-gray-700 leading-relaxed whitespace-pre-line">{product.productDescription}</p>

          

          {/* Quantity + Actions */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border rounded-full">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-4 py-2"
                aria-label="Decrease quantity"
              >
                –
              </button>
              <div className="px-4 min-w-8 text-center">{quantity}</div>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="px-4 py-2"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <CustomButton
              label="Add To Cart"
              onClick={() => addToCart(product.productId)}
              loading={cartLoading}
            />
            <CustomButton 
              label='Buy Now'
              onClick={() => router.push(`/payment/${id}`)}
              loading={false}
              backgroundColor='#fcba03'
              textColor='black'
            />
          </div>

          {/* Meta */}
          <div className="mt-8 space-y-2 text-sm text-gray-600">
            {/* <div>
              <span className="text-gray-500">SKU:</span> {product.productId}
            </div> */}
            {/* {product.createdAt && (
              <div>
                <span className="text-gray-500">Added:</span> {new Date(product.createdAt).toLocaleDateString()}
              </div>
            )} */}
            <div className="flex gap-2 items-center">
              <div className="flex gap-2 flex-wrap">
                {product.gender && <span className="px-2 py-1 rounded-full bg-gray-100">{product.gender}</span>}
                {product.brand && <span className="px-2 py-1 rounded-full bg-gray-100">{product.brand}</span>}
                {/* {product.color && <span className="px-2 py-1 rounded-full bg-gray-100">{product.color}</span>} */}
              </div>
            </div>

            {/* Attributes */}
          <div className="mt-6 space-y-4">
            <div>
              <div className="text-sm text-gray-500 mb-2">Size</div>
              <div className="flex gap-2">
                {/* <span className="px-3 py-1 rounded-full border bg-yellow-400/20 text-yellow-800 text-sm">{product.size || '—'}</span> */}
              </div>
            </div>
            {/* <div>
              <div className="text-sm text-gray-500 mb-2">Material</div>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full border text-sm">{product.material || '—'}</span>
              </div>
            </div> */}
            <div>
              <div className="text-sm text-gray-500 mb-2">Color</div>
              <div className="flex gap-2 items-center">
                {/* <span className="h-5 w-5 rounded-full border" style={{ backgroundColor: product.color?.toLowerCase() }} />
                <span className="text-sm text-gray-700">{product.color || '—'}</span> */}
              </div>
            </div>
            <div className="text-sm text-gray-600">Gender: {product.gender || '—'}</div>
          </div> 
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailsPage() {
  return (
    <>
      {/* <Navbar /> */}
      <Suspense fallback={<LoadingSpinner />}>
        <ProductContent />
      </Suspense>
    </>
  );
}


