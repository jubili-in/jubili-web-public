"use client";

import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProduct } from '@/hooks/useProduct';

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
  const params = useSearchParams();
  const id = params.get('id');
  const { token } = useAuth();
  const { isLoading, product, error, retry } = useProduct(id, token || undefined);

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
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">{product.productName}</h1>
      <div className="flex gap-4 overflow-x-auto">
        {product.imageUrls.map((src, idx) => (
          <img key={`${product.productId}-${idx}`} src={src} alt={`${product.productName}-${idx}`} className="h-48 w-auto object-cover rounded" />
        ))}
      </div>
      <p className="text-gray-700">{product.productDescription}</p>
      <div className="text-sm text-gray-600">₹{product.price} </div>  {/*{product.discount ? `(−${product.discount}%)` : ''} */}
      <div className="text-sm text-gray-600">Brand: {product.brand}</div>
      {/* <div className="text-sm text-gray-600">Color: {product.color}</div>
      <div className="text-sm text-gray-600">Size: {product.size}</div> */}
      <div className="text-sm text-gray-600">Stock: {product.stock}</div>
    </div>
  );
}

export default function ProductPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<LoadingSpinner />}>
        <ProductContent />
      </Suspense>
    </>
  );
}
