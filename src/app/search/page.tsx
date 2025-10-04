'use client';

import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import ProductCard from '@/components/product/ProductCard';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useSearch } from '@/hooks/useSearch';
import { SearchBar } from '@/components/layout/SearchBar';

// Loading component
function LoadingSpinner() {
  return (
    <div className="flex h-full items-center justify-center py-12">
      <img src="/icons/loading.svg" alt="Loading..." className="w-8 h-8 animate-spin" />
    </div>
  );
}

// Error component
function ErrorMessage({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="text-center py-12">
      <p className="text-red-600 mb-4">{error}</p>
      <button 
        onClick={onRetry}
        className="text-blue-500 underline hover:text-blue-700"
      >
        Try again
      </button>
    </div>
  );
}

// Separate component that uses useSearchParams
function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const { token } = useAuth();
  
  const { 
    isLoading, 
    results, 
    error, 
    handleLikeToggle, 
    retry: handleRetry 
  } = useSearch(query, token || undefined);

  return (
    <div className=" py-6">
      {/* Search query display */}
      {query && (
        <div className="mb-6 px-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Search Results for &quot;{query}&quot;
          </h1>
          {!isLoading && !error && (
            <p className="text-sm text-gray-600 mt-1">
              {results.length} {results.length === 1 ? 'product' : 'products'} found
            </p>
          )}
        </div>
      )}

      {!query ? (
        // Initial state - no search query
        <div className="text-center py-12">
          <div className="mb-20 mt-20 flex justify-center items-center">
            <svg 
              className="h-12 w-12 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
            <p className="text-gray-600 text-lg ml-2"> 
              Enter a search term to see results
            </p>
          </div>
          <SearchBar />
        </div>
      ) : isLoading ? (
        // Loading state
        <LoadingSpinner />
      ) : error ? (
        // Error state
        <ErrorMessage error={error} onRetry={handleRetry} />
      ) : results.length > 0 ? (
        // Results found
        <div className="flex flex-col">
          {results.map((product) => (
            <ProductCard 
              key={product.productId} 
              product={product}
              onLikeToggle={handleLikeToggle}
            />
          ))}
        </div>
      ) : (
        // No results found
        <div className="text-center py-12">
          <div className="mb-4">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291.94-5.709 2.291M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          <p className="text-gray-600 text-lg mb-2">
            No results found for &quot;{query}&quot;
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Try searching with different keywords or check your spelling
          </p>
          <button 
            onClick={() => window.history.back()}
            className="text-blue-500 underline hover:text-blue-700"
          >
            Go back
          </button>
        </div>
      )}
    </div>
  );
}

// Main component with Suspense boundary
export default function SearchPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<LoadingSpinner />}>
        <SearchContent />
      </Suspense>
    </>
  );
}