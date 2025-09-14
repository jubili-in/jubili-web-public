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