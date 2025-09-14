import { Product } from '@/lib/types/product';
import Link from 'next/link';
import { useState, useCallback } from 'react';
import { toggleProductLike } from '@/services/product.service';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useFavourite } from '@/hooks/useFavourite';

interface ProductCardProps {
  product: Product;
  onLikeToggle?: (productId: string, isLiked: boolean) => void;
}

export default function ProductCard({ product, onLikeToggle }: ProductCardProps) {
  const [bgImage, setBgImage] = useState(product.imageUrls?.[0] || '');
  const [descExpanded, setDescExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(product.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(product.likeCount);
  const [likeLoading, setLikeLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const { token } = useAuth();
  const { addToCart, loading: cartLoading } = useCart();
  const { addToFavorites, loading: favoriteLoading } = useFavourite();

  // const discountedPrice = product.price - (product.price * product.discount) / 100;
  // const hasDiscount = product.discount > 0;
  const hasImages = product.imageUrls && product.imageUrls.length > 0;

  const handleImageError = useCallback(() => {
    setBgImage('');
  }, []);

  const handleLikeToggle = useCallback(async () => {
    if (!token) {
      // You might want to show a login prompt here
      console.warn('User must be logged in to like products');
      return;
    }

    if (likeLoading) return;

    setLikeLoading(true);
    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;
    const newIsLiked = !isLiked;

    // Optimistic update - use the new state for calculations
    setIsLiked(newIsLiked);
    setLikeCount(prev => newIsLiked ? prev + 1 : prev - 1);

    try {
      await toggleProductLike(product.productId, token);
      onLikeToggle?.(product.productId, newIsLiked);
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(previousIsLiked);
      setLikeCount(previousLikeCount);
      console.error("Failed to toggle like:", error);
    } finally {
      setLikeLoading(false);
    }
  }, [token, likeLoading, isLiked, likeCount, product.productId, onLikeToggle]);

  const handleFavourite = useCallback(async () => {
    if (!token) {
      console.warn('User must be logged in to add to favorites');
      return;
    }

    if (favoriteLoading) return;

    try {
      // Optimistic update
      setIsFavorited(prev => !prev);
      await addToFavorites(product.productId);
    } catch (error) {
      // Revert optimistic update on error
      setIsFavorited(prev => !prev);
      console.error("Failed to toggle favorite:", error);
    }
  }, [token, product.productId, favoriteLoading, addToFavorites]);

  const toggleDescription = useCallback(() => {
    setDescExpanded(prev => !prev);
  }, []);

  return (
    <div className="relative bg-white overflow-hidden flex flex-col">
      {/* Background image only on laptop and up */}
      {bgImage && (
        <div className="hidden lg:block absolute right-0 top-0 h-full w-1/2 z-0 overflow-hidden">
          <img
            src={bgImage}
            alt="background"
            className="object-cover"
            onError={handleImageError}
            sizes="(max-width: 1024px) 0px, 50vw"
          />
          <div
            className="absolute left-0 top-0 h-full w-full"
            style={{
              background: "linear-gradient(80deg, white 10%, transparent 70%)",
            }}
          />
        </div>
      )}

      {/* Foreground content */}
      <div className="relative z-10 py-5">
        {/* Top Row */}
        <Link href={`/product/${product.productId}`}>
          <div className="flex items-start justify-between mb-1 w-full md:w-2/3 lg:w-1/2 px-4">
            <div>
              <h2 className="text-xl font-semibold">{product.productName}</h2>
              <p className="text-sm text-gray-500">{product.brand || "Brand"}</p>
            </div>
            <div className="w-15" />
            <div className="flex items-center gap-15">
              <div className="flex items-center gap-2">
                {/* {hasDiscount ? (
                <>
                  <div className="text-green-600 text-lg font-semibold">
                    ₹{discountedPrice.toFixed(2)}
                  </div>
                  <span className="text-gray-500 line-through text-sm">
                    ₹{product.price}
                  </span>
                  <span className="text-green-600 text-sm">
                    {product.discount}% off
                  </span>
                </>
              ) : (
               
              )} */}

                <div className="text-green-600 text-lg font-semibold">
                  ₹{product.price}
                </div>
              </div>
              {/* <button 
              className="text-2xl px-2"
              aria-label="More options"
            >
              <b>⋮</b>
            </button> */}
            </div>
          </div>
        </Link>

        {/* Thumbnails */}
        {hasImages && (
          <div className="flex overflow-x-auto gap-4 mb-2" style={{ height: 320 }}>
            <div style={{ height: 300, width: 0 }} />
            {product.imageUrls.map((url, idx) => (
              <img
                key={`${product.productId}-${idx}`}
                src={url}
                alt={`${product.productName} - view ${idx + 1}`}
                width={300}
                height={300}
                onMouseEnter={() => setBgImage(url)}
                style={{ height: 300, width: "auto" }}
                className="object-cover rounded-xl cursor-pointer"
                onError={handleImageError}
                sizes="300px"
              />

            ))}
          </div>
        )}

        {/* Actions Row */}
        <div className="w-full md:w-2/3 lg:w-1/2 flex items-center gap-6 mb-2 px-4">
          <button
            onClick={handleLikeToggle}
            disabled={likeLoading}
            className="ml-2 flex items-center gap-4 disabled:opacity-50 hover:scale-105 transition-transform cursor-pointer"
            aria-label={isLiked ? 'Unlike product' : 'Like product'}
          >
            <img
              src={isLiked ? '/icons/like_filled.svg' : '/icons/like_outlined.svg'}
              alt={isLiked ? 'Liked' : 'Not liked'}
              width={20}
              height={20}
              className={`transition-all ${likeLoading ? 'opacity-50' : ''}`}
            />
            <span className="text-sm text-gray-600">{likeCount}</span>
          </button>
          <div className="flex-1" />
          <button 
            onClick={handleFavourite}
            disabled={favoriteLoading}
            className="flex items-center gap-1 text-gray-700 disabled:opacity-50 hover:scale-105 transition-transform cursor-pointer"
          >
            <img
              src={isFavorited ? "/icons/heart.svg" : "/icons/heart.svg"}
              alt="Add to favorites"
              width={24}
              height={24}
              className={`transition-all ${favoriteLoading ? 'opacity-50' : ''}`}
            />
            <span className='text-xs'>{'Add to Favourites'}</span>
          </button>
          <div className="flex-15" />
          <button
            className="flex items-center gap-1 text-gray-700"
            aria-label="Share product"
          >
            <img
              src="/icons/share.svg"
              alt="Share"
              width={24}
              height={24}
            />
          </button>
          <button className="bg-black text-white rounded px-4 py-1 text-sm">
            0 reviews
          </button>
          <div className="flex-1" />
        </div>

        {/* Description */}
        <div
          className={`text-base text-justify font-medium mb-2 w-full md:w-2/3 lg:w-1/2 px-4 cursor-pointer select-none`}
          style={
            descExpanded
              ? {}
              : {
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }
          }
          onClick={toggleDescription}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleDescription();
            }
          }}
          role="button"
          tabIndex={0}
          title={descExpanded ? "Show less" : "Show more"}
        >
          {product.productDescription ||
            `${product.productName} - ${product.gender} `}   {/*${product.size} ${product.color}*/}
          {!descExpanded && (
            <span className="text-blue-500 ml-2">See more</span>
          )}
          {descExpanded && (
            <span className="text-blue-500 ml-2">See less</span>
          )}
        </div>

        {/* Product Details */}
        <div className="w-full md:w-2/3 lg:w-1/2 px-4 mb-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {product.gender && <span>{product.gender}</span>}
            {/* {product.gender && product.size && <span>•</span>}
            {product.size && <span>{product.size}</span>}
            {product.size && product.color && <span>•</span>}
            {product.color && <span>{product.color}</span>} */}
          </div>
        </div>

        {/* Buy Row */}
        <div className="flex items-center gap-3 mt-2 w-full md:w-2/3 lg:w-1/2 px-4">
          <Link href={`/payment/${product.productId}`}>
            <button className="bg-gray-900 text-white rounded-full px-10 py-2 text-lg font-semibold hover:bg-gray-800 hover:cursor-pointer transition-colors">
              Make it yours
            </button>
          </Link>
          <button
            onClick={() => addToCart(product.productId)}
            disabled={cartLoading}
            className={`${cartLoading ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300 cursor-pointer'
              } text-white rounded-full px-3 py-3 text-lg font-semibold transition-colors`}
          >
            <img src="/icons/cart-bag.svg" alt="Add to Cart" className='pl-2 pr-2 h-5' />
          </button>
          <div className="flex-1" />
        </div>
      </div>
    </div>
  );
}