export interface Product {
  attributes: Record<string, string | undefined>;
  currentPrice: number;
  productId: string;
  productName: string;
  productDescription: string;
  price: number;
  brand: string;
  gender: string;
  stock: number;
  likeCount: number;
  isLiked?: boolean;
  imageUrls: string[];
  sellerId?: string;
  sellerName?: string;
  dimensions: {
    length?: number;
    breadth?: number;
    height?: number;
    weight?: number;
  };
  addressId?: string, // Added addressId field
  categoryId?: string;
  createdAt?: string;
  linkedItems?: Array<{
    id: string;
    name: string;
  }>;
}

export interface SearchProductsResponse {
  products: Product[];
  total?: number;
  page?: number;
  limit?: number;
}

// For liked products API response (simplified structure)
export interface LikedProduct {
  productId: string;
  productName: string;
  productDescription: string;
  imageUrl: string; // Note: single imageUrl for liked products
}

// Transform function to convert LikedProduct to Product
export const transformLikedProductToProduct = (likedProduct: LikedProduct): Product => ({
  ...likedProduct,
  attributes : {},
  imageUrls: [likedProduct.imageUrl], // Convert single URL to array
  price: 0, // Default values for missing fields
  currentPrice: 0,
  // discount: 0,
  brand: '',
  dimensions : {},
  gender: '',
  stock: 0,
  likeCount: 0,
  isLiked: true,
});