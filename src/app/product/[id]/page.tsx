//src/app/product/[id]/page.tsx
"use client";

import { Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProduct } from '@/hooks/useProduct';
import { useCart } from '@/hooks/useCart';
import CustomButton from '@/components/ui/CustomButton';
import Image from 'next/image';
import ProductDetailCarousel from '@/components/productDetail/ProductDetailCarousel';
import Description from '@/components/productDetail/Description';
import Reviews from '@/components/productDetail/Reviews';

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
  const { addToCart, loading: cartLoading } = useCart();
  const { isLoading, product, error, retry } = useProduct(id, token || undefined);
  const borderRadius = "rounded-2xl"

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
    <div className="w-full max-w-[1200px] mx-auto my-2 px-3 md:px-0">
      {/* Mobile Layout */}
      <div className="flex flex-col gap-3 md:hidden">
        {/* Images */}
        <div className="w-full">
          <ProductDetailCarousel borderRadius={borderRadius} product={product} />
        </div>

        {/* Price Section */}
        <div className={`bg-black p-4 ${borderRadius}`}>
          <div className="flex flex-col gap-3">
            <div className="text-white text-3xl font-bold">
              &#8377; {product.price}
            </div>
            <div className="flex gap-2">
              <CustomButton 
                label='Add to Cart'
                onClick={() => addToCart(product.productId)}
                loading={cartLoading}
                icon={<Image 
                  src='/icons/cart-bag.svg'
                  width={20} 
                  height={50} 
                  alt='cart'
                />}
                iconPosition='right'
                backgroundColor='#fff'
                textColor='black'
                horizontalPadding={20}
                verticalPadding={15}
              />
              <CustomButton 
                label='Buy Now'
                onClick={() => router.push(`/payment/${id}`)}
                loading={false}
                icon={<Image 
                  src='/icons/arrow.png'
                  width={20} 
                  height={50} 
                  alt='arrow'
                />}
                iconPosition='right'
                backgroundColor='#fff'
                textColor='black'
                horizontalPadding={20}
                verticalPadding={15}
              />
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className={`bg-gray-200/75 p-4 ${borderRadius}`}>
          <Description product={product}/>
        </div>

        {/* Reviews Section */}
        <div className={`bg-gray-200/75 p-4 ${borderRadius}`}>
          <Reviews />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-2 md:grid-rows-3 gap-3">
        <div className="col-span-2 row-span-1">
          <ProductDetailCarousel borderRadius={borderRadius} product={product} />
        </div>

        <div className={`col-start-1 row-start-2 row-span-1 bg-gray-200/75 p-4 ${borderRadius}`}>
          <Description product={product}/>
        </div>

        <div className="col-start-2 row-start-2 row-span-3 flex flex-col gap-3">
          <div className={`bg-black p-4 ${borderRadius}`}>
            <div className="flex justify-between items-center h-full">
              <div className="text-white text-4xl font-bold grow">
                &#8377; {product.price}
              </div>
              <CustomButton 
                label=''
                onClick={() => addToCart(product.productId)}
                loading={cartLoading}
                icon={<Image 
                  src='/icons/cart-bag.svg'
                  width={20} 
                  height={50} 
                  alt='cart'
                />}
                iconPosition='right'
                backgroundColor='#fff'
                textColor='black'
                horizontalPadding={25}
                verticalPadding={15}
              />
              <span className='w-2' />
              <CustomButton 
                label='Buy Now'
                onClick={() => router.push(`/payment/${id}`)}
                loading={false}
                icon={<Image 
                  src='/icons/arrow.png'
                  width={20} 
                  height={50} 
                  alt='arrow'
                />}
                iconPosition='right'
                backgroundColor='#fff'
                textColor='black'
                horizontalPadding={25}
                verticalPadding={15}
              />
            </div>
          </div>

          <div className={`bg-gray-200/75 p-4 ${borderRadius} overflow-y-auto`}>
            <Reviews />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailsPage() {
  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <ProductContent />
      </Suspense>
    </>
  );
}