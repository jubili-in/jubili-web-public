export interface FavAction {
  userId: string;
  actionType: 'FAVOURITE';
  productId: string;
  quantity: string;
}

export interface FavActionResponse{
  userId: string;
  actionType: 'FAVOURITE';
  productId: string;
  quantity: string;
  createdAt: string;
}

export interface FavouritesApiResponse {
  items: FavouriteItem[];
  message: string;
}

export interface FavouriteItem {
  productId: string;
  productName: string;
  imageUrl: string;
  description: string;
}
