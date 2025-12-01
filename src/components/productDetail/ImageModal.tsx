import React, { useEffect } from "react";

interface ImageModalProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}) => {
  const image = images[currentIndex];

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext]);

  if (!image) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="relative max-w-4xl w-full px-4">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-white text-3xl font-bold bg-black/50 rounded-full px-3 py-1 hover:bg-black/70 transition"
          onClick={onClose}
        >

          &times;
        </button>

        {/* Prev button */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl font-bold bg-black/50 rounded-full px-3 py-2 hover:bg-black/70 transition"
          onClick={onPrev}
        >
          &#8249;
        </button>


        {/* Next button */}
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl font-bold bg-black/50 rounded-full px-3 py-2 hover:bg-black/70 transition"
          onClick={onNext}
        >
          &#8250;
        </button>

        {/* Image */}
        <img
          src={image}
          alt="Selected"
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default ImageModal;