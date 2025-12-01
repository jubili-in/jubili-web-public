import { useState, useEffect, useCallback } from "react";
import { useFavourite } from "@/hooks/useFavourite";
import { useParams } from 'next/navigation';
import { useProduct } from "@/hooks/useProduct";
import { toggleProductLike } from "@/services/product.service";
import { Product } from "@/lib/types/product";
import { useAuth } from "@/hooks/useAuth";

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

type Props = {
  product: Product | null;
};

const Description = ({ product } : Props) => {

  const params = useParams<{ id: string }>();
  const id = params?.id ?? null;
  const attributes = product?.attributes;
  //const attributes = "hjadh;adh ahf ;adh ah ah dlhalhd l'ah hd aihd hd piqhpiwh dpihwd pihqw dphpdh phd hd p'iqh p'iqwhd'ph qh dqh dpih q'pdioh piqhd \pqh d\phas dkn knq'pidnpin dnd piqw dpih qpwidh pqwdh qhd ioqh doiqh fdoiqhf ;qh ldh o;qhd oiqh do dqh."; 
  const { token } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const { isLoading, error, retry, handleLikeToggle } = useProduct(id, token || undefined);
  const { addToFavorites, loading: favoriteLoading } = useFavourite();

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

  const handleFavourite = useCallback(async () => {
    if (!token) {
      console.warn('User must be logged in to add to favorites');
      return;
    }

    if (!product) return;        // <-- FIX: ensure product exists
    if (favoriteLoading) return;

    try {
      setIsFavorited(prev => !prev);
      await addToFavorites(product.productId);
    } catch (error) {
      setIsFavorited(prev => !prev);
      console.error("Failed to toggle favorite:", error);
    }
}, [token, product, favoriteLoading, addToFavorites]);

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


  return (
    <div className="flex flex-col justify-between h-full gap-4">  
      <div className="flex justify-between items-center">
        <div className="text-4xl font-bold">{product.productName}</div>
      </div>

        {/* Actions Row */}
        <div className="w-full flex items-center gap-6 mb-2">
          <button
            onClick={handleLikeToggleClick}
            disabled={likeLoading}
            className="flex items-center gap-4 disabled:opacity-50 hover:scale-105 transition-transform cursor-pointer"
            aria-label={isLiked ? 'Unlike product' : 'Like product'}
          >
            <img
              src={isLiked ? '/icons/like_filled.svg' : '/icons/like_outlined.svg'}
              alt={isLiked ? 'Liked' : 'Not liked'}
              width={25}
              height={25}
              className={`transition-all ${likeLoading ? 'opacity-50' : ''}`}
            />
            {/* <span className="text-sm text-gray-600">{likeCount}</span> */}
            <span className="text-sm text-gray-600">{likeCount + (likeCount>1 ? " likes" : " like")}</span>
          </button>
          <div className="flex-1" />
          <button 
            onClick={handleFavourite}
            disabled={favoriteLoading}
            aria-label={isLiked ? 'Unlike product' : 'Like product'}
            className="flex items-center gap-1 text-gray-700 disabled:opacity-50 hover:scale-105 transition-transform cursor-pointer"
          >
            <img
              src="/icons/heart.svg"
              alt={isLiked ? 'Liked' : 'Not liked'}
              width={25}
              height={25}
              className={`transition-all ${favoriteLoading ? 'opacity-50' : ''}`}
            />
            <span className='text-sm'>{'Add to Favourites'}</span>
          </button>
          <div className="flex-15" />
          <button
            className="flex items-center gap-1 text-gray-700"
            aria-label="Share product"
          >
            <img
              src="/icons/share.svg"
              alt="Share"
              width={25}
              height={25}
            />
          </button>
          <div className="flex-1" />
        </div>
      <div className="flex flex-col">
        <div className="font-bold text-2xl mb-2">Description</div>
        <div>{product?.productDescription}</div>
      </div>

      <div className="flex flex-col grow">
        <div className="font-bold mb-2 text-2xl">Attributes</div>
        {attributes && Object.keys(attributes).length > 0 ? (
          <div className="space-y-2">
            {Object.entries(attributes)
              .filter(([_, value]) => value != null && value !== '') // Filter out null/undefined/empty
              .map(([key, value]) => (
                <p key={key} className="text-gray-700">
                  <strong className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> {value}
                </p>
              ))}
          </div>
        ) : (
          <p className="text-gray-500">No attributes available</p>
        )}
      </div>
    </div>
  )
}

export default Description