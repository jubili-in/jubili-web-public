//src/components/productDetail/ProductDetailCarousel.tsx
import { useRef, useState } from "react";
import ImageModal from "./ImageModal";
import { Product } from '@/lib/types/product';

type Props = {
  borderRadius?: string;  
  product: Product;
};

function getGridPlacementClasses(i: number): string {
  switch (i) {
    case 0: return "col-span-2 row-span-2 col-start-1 row-start-1";
    case 1: return "col-span-1 row-span-1 col-start-3 row-start-1";
    case 2: return "col-span-1 row-span-1 col-start-4 row-start-1";
    case 3: return "col-span-2 row-span-1 col-start-3 row-start-2";
    default: return "";
  }
}

const ProductDetailCarousel = ({ borderRadius, product } : Props) => {

  const imgURL = product.imageUrls;

  const imgRowRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const previousArrow = () => {
    imgRowRef.current?.scrollBy({ left: -imgRowRef.current.clientWidth, behavior: "smooth" });
  };

  const nextArrow = () => {
    imgRowRef.current?.scrollBy({ left: imgRowRef.current.clientWidth, behavior: "smooth" });
  };

  const chunkedImages: (string | null)[][] = [];
  for (let i = 0; i < imgURL.length; i += 4) {
    const chunk: (string | null)[] = imgURL.slice(i, i + 4);
    while (chunk.length < 4) chunk.push(null);
    chunkedImages.push(chunk);
  }

  return (
    <div className="relative w-full max-w-[1200px] mx-auto overflow-hidden aspect-[2/1] md:aspect-[2/1] aspect-square">
      {/* Carousel Row */}
      <div
        ref={imgRowRef}
        className="absolute inset-0 flex overflow-x-hidden w-full h-full scroll-smooth"
      >
        {/* Mobile: Single column layout */}
        <div className="md:hidden flex w-full h-full">
          {imgURL.map((img, index) => (
            <div key={index} className="min-w-full h-full flex-shrink-0">
              <img
                src={img}
                alt={`carousel-${index}`}
                className={`w-full h-full object-cover ${borderRadius} cursor-pointer`}
                onClick={() => setCurrentIndex(index)}
              />
            </div>
          ))}
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:flex w-full h-full">
          {chunkedImages.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="grid grid-cols-4 grid-rows-2 gap-3 min-w-full h-full"
            >
              {group.map((img, i) => {
                const globalIndex = groupIndex * 4 + i;
                const placementClasses = getGridPlacementClasses(i);

                return (
                  <div key={globalIndex} className={`relative ${placementClasses}`}>
                    {img ? (
                      <img
                        src={img}
                        alt={`carousel-${globalIndex}`}
                        className={`w-full h-full object-cover ${borderRadius} cursor-pointer`}
                        onClick={() => setCurrentIndex(globalIndex)}
                      />
                    ) : (
                      <div className={`w-full h-full bg-gray-100 ${borderRadius}`} />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Arrow Overlay */}
      {imgURL.length > 1 && (
        <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
          <button
            className="w-8 h-8 md:w-10 md:h-10 text-white text-xl font-bold bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition pointer-events-auto"
            onClick={previousArrow}
          >
            &#8249;
          </button>

          <button
            className="w-8 h-8 md:w-10 md:h-10 text-white text-xl font-bold bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition pointer-events-auto"
            onClick={nextArrow}
          >
            &#8250;
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      {currentIndex !== null && (
        <ImageModal
          images={imgURL}
          currentIndex={currentIndex}
          onClose={() => setCurrentIndex(null)}
          onPrev={() =>
            setCurrentIndex((prev) =>
              prev !== null ? (prev - 1 + imgURL.length) % imgURL.length : 0
            )
          }
          onNext={() =>
            setCurrentIndex((prev) =>
              prev !== null ? (prev + 1) % imgURL.length : 0
            )
          }
        />
      )}
    </div>
  );
};

export default ProductDetailCarousel;