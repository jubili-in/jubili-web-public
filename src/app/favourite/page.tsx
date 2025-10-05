"use client";

import { useRouter } from "next/navigation";
import { Quicksand } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useLikedProducts } from "@/hooks/useLikedProducts";
import { useFavourite } from "@/hooks/useFavourite"; // 👈 new
import PageHeading from "@/components/shared/PageHeading";
import { Product } from "@/lib/types/product";

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
});

export default function FavouritePage() {
  const router = useRouter();
  const {
    likedProducts,
    loading: likedLoading,
    error: likedError,
    handleUnlike,
  } = useLikedProducts();

  const {
    favouritedProducts,
    loading: favLoading,
    error: favError,
    handleUnfavourite,
  } = useFavourite();

  const loading = likedLoading || favLoading;

  if (loading) {
    return (
      <>
        {/* <Navbar /> */}
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <img
            src="/icons/loading.svg"
            alt="Loading..."
            className="w-8 h-8 animate-spin"
          />
        </div>
      </>
    );
  }

  const renderProductCard = (
    item: Product,
    handleAction: (id: string) => void,
    actionLabel: string
  ) => (
    <div
      key={item.productId}
      className="flex flex-col md:grid md:grid-cols-12 items-start md:items-center ml-2 md:ml-6 mr-2 md:mr-6 py-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
    >
      {/* Product Info */}
      <Link
        href={`/product/${item.productId}`}
        className="flex items-center gap-4 col-span-6 w-full md:w-auto mb-2 md:mb-0"
      >
        <div className="relative w-16 h-16 flex-shrink-0">
          <Image
            src={item.imageUrls[0] || "images/FNF.svg"}
            alt={item.productName}
            fill
            className="object-cover rounded-lg"
            sizes="64px"
          />
        </div>
        <div>
          <div className="font-semibold text-base text-gray-900 break-words max-w-[150px] md:max-w-none hover:underline">
            {item.productName}
          </div>
          <div className="flex gap-2 mt-2">
            <button
              className="bg-gray-200 text-gray-700 rounded-full px-4 py-1 text-sm font-semibold hover:bg-gray-300 transition disabled:opacity-50"
              onClick={(e) => {
                e.preventDefault();
                handleAction(item.productId);
              }}
              disabled={loading}
            >
              {actionLabel}
            </button>
          </div>
        </div>
      </Link>

      {/* Description */}
      <div className="col-span-6 w-full md:justify-center mb-2 md:mb-0 text-gray-700 text-sm">
        {item.productDescription ? (
          <p className="line-clamp-3">{item.productDescription}</p>
        ) : (
          <span className="text-gray-400">No description</span>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* <Navbar /> */}
      <div className="max-w-6xl mx-auto p-4">
        <PageHeading title="My Favorites" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Liked + Favourited Products */}
          <div className="md:col-span-2 space-y-10">
            {/* Favourited Products */}
            <div className="bg-white rounded-2xl border border-gray-300 p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-300 font-semibold text-lg">
                Favourited Products
              </div>

              {favError && (
                <div className="p-6 text-red-500 text-center">
                  <p>{favError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 text-blue-500 underline"
                  >
                    Try again
                  </button>
                </div>
              )}

              {!favError && favouritedProducts && favouritedProducts.length > 0 ? (
                favouritedProducts.map((item: Product) =>
                  renderProductCard(item, handleUnfavourite, "Unfavourite")
                )
              ) : (
                !favError && (
                  <div className="p-6 text-gray-500 text-center">
                    <p className="mb-4">
                      You have not favourited any products yet.
                    </p>
                    <button
                      onClick={() => router.push("/search")}
                      className="text-blue-500 underline"
                    >
                      Start browsing products
                    </button>
                  </div>
                )
              )}
            </div>

            {/* Liked Products */}
            <div className="bg-white rounded-2xl border border-gray-300 p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-300 font-semibold text-lg">
                Liked Products
              </div>

              {likedError && (
                <div className="p-6 text-red-500 text-center">
                  <p>{likedError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 text-blue-500 underline"
                  >
                    Try again
                  </button>
                </div>
              )}

              {!likedError && likedProducts && likedProducts.length > 0 ? (
                likedProducts.map((item: Product) =>
                  renderProductCard(item, handleUnlike, "Unlike")
                )
              ) : (
                !likedError && (
                  <div className="p-6 text-gray-500 text-center">
                    <p className="mb-4">You have not liked any products yet.</p>
                    <button
                      onClick={() => router.push("/search")}
                      className="text-blue-500 underline"
                    >
                      Start browsing products
                    </button>
                  </div>
                )
              )}
            </div>

          </div>

          {/* Right: Info/Actions */}
<div className="md:col-span-1">
  <div className="bg-white rounded-2xl border border-gray-300 p-6 mb-6 flex flex-col items-center justify-center max-h-[600px]">
    <div className="font-semibold mb-4 text-center">
      Liked and favourited products are saved to your account. You can
      add them to your cart anytime!
    </div>
    <button
      className="w-full mt-2 bg-black text-white rounded-full py-3 font-semibold text-lg hover:bg-gray-900 transition"
      onClick={() => router.push("/cart")}
    >
      Go to Cart
    </button>
  </div>
</div>

        </div>
      </div>
    </>
  );
}
