import Image from "next/image";

interface StarRatingProps {
  rating: number; // 0–5
  size?: number;  // optional size (default 24px)
}

const StarRating: React.FC<StarRatingProps> = ({ rating, size = 24 }) => {
  const stars = Array.from({ length: 5 }, (_, index) => index < rating);

  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {stars.map((filled, i) => (
        <Image
          key={i}
          src={filled ? "/icons/star-filled.png" : "/icons/star-empty.png"}
          alt="star"
          width={size}
          height={size}
        />
      ))}
    </div>
  );
};

export default StarRating;