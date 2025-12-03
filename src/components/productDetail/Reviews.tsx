//src/components/productDetail/Reviews.tsx
"use client"
import { useState } from "react";
import StarRating from "../ui/StarRating";

const Reviews = () => {
  const reviews = [
    { user: "Priya Sharma", review: "The service was excellent and the food was fresh. Highly recommend!", rating: 5 },
    { user: "Rohan Patel", review: "Decent place, but the wait time was far too long. The atmosphere was nice, though.", rating: 3 },
    { user: "Aisha Khan", review: "Absolutely amazing! Best coffee I've had in the city. Will be back tomorrow.", rating: 5 },
    { user: "Vikram Singh", review: "The product arrived damaged. Very disappointed with the packaging quality.", rating: 1 },
    { user: "Sneha Reddy", review: "Good value for money. The staff was friendly, and the room was clean.", rating: 4 },
    { user: "Arjun Menon", review: "It was okay. Nothing special to write home about. Average experience.", rating: 3 },
    { user: "Deepa Kumar", review: "Fantastic customer support! They resolved my issue within minutes. Five stars!", rating: 5 },
    { user: "Rajesh Joshi", review: "Overpriced for what you get. The quality was mediocre at best.", rating: 2 },
    { user: "Meera Das", review: "Great location and comfortable seating. A perfect spot for a quick lunch.", rating: 4 },
    { user: "Karan Verma", review: "Worst experience ever. The item was completely different from the description.", rating: 1 },
    { user: "Geeta Rao", review: "A hidden gem! Lovely ambiance and incredibly tasty desserts.", rating: 5 },
    { user: "Suresh Iyer", review: "Four stars because the main course was slightly under-seasoned, but everything else was excellent.", rating: 4 },
    { user: "Zoya Malik", review: "It met my expectations. Functional and reliable, but lacked any flair.", rating: 3 },
    { user: "Harsh Gupta", review: "Quick delivery and exactly what I ordered. Very satisfied!", rating: 5 },
    { user: "Anjali Bose", review: "The instructions were confusing, and setup took forever. Needs better documentation.", rating: 2 }
  ];

  const [visibleCount, setVisibleCount] = useState(10);

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  return (
    <div className="max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
      <div className="font-bold mb-2 text-xl md:text-2xl">Reviews</div>

      {reviews.slice(0, visibleCount).map((review, index) => (
        <div key={index} className="mb-4">
          <p className="font-semibold text-gray-800 text-sm md:text-base">{review.user}</p>
          <StarRating rating={review.rating} size={16} />
          <p className="text-gray-600 text-sm md:text-base">{review.review}</p>
        </div>
      ))}

      {visibleCount < reviews.length && (
        <button
          onClick={handleSeeMore}
          className="w-full bg-white py-2 mb-2 rounded-xl shadow text-blue-600 font-medium hover:bg-gray-50 text-sm md:text-base"
        >
          See more
        </button>
      )}
    </div>
  );
};

export default Reviews;