import { API_BASE_URL, API_ENDPOINTS } from '@/lib/constants/api';
import { CartAction, CartActionResponse, CartDelete, CartResponse } from '@/lib/types/cart';
import { FavAction, FavActionResponse } from '@/lib/types/userAction';

class UserActionsService {

  async addToCart(data: CartAction): Promise<CartActionResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USER_ACTIONS.BASE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      return response.json();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  async getCart(userId: string): Promise<CartResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.USER_ACTIONS.CART(userId)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      return response.json();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error fetching cart';
      throw new Error(errorMessage);
    }
  }

  async deleteCart(data: CartDelete): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USER_ACTIONS.BASE}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      console.log('Delete cart response:', response);

      if (!response.ok) {
        throw new Error('Failed to delete from cart');
      }
    } catch (error) {
      console.error('Error deleting from cart:', error);
      throw error;
    }
  }

  async addToFav (data: FavAction): Promise<FavActionResponse>{
    try { 
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.USER_ACTIONS.BASE}`, 
        { method: 'POST',
            headers: { 'Content-Type': 'application/json', }, 
            body: JSON.stringify(data), 
      }
    );

    if (!response.ok) { 
      throw new Error('Failed to add to favourites'); 
    } 
    
    return response.json(); 
  } catch (error) {
     console.error('Error adding to favourites:', error); 
     throw error; 
  } }

  async getFavourites(userId: string) {
    const baseUrl = `${API_BASE_URL}${API_ENDPOINTS.USER_ACTIONS.FAVOURITE}?userId=${userId}`;
    console.log("base url bellow \n", baseUrl);
    try {
      const response = await fetch(
        baseUrl,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to fetch favourites");
      }
      // Return the full API response (with items and message)
      return response.json();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error fetching favourites";
      throw new Error(errorMessage);
    }
  }

  async deleteFav(data: FavAction): Promise<void> {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.USER_ACTIONS.BASE}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove from favourites");
      }
    } catch (error) {
      console.error("Error deleting favourite:", error);
      throw error;
    }
  }

}

export const userActionsService = new UserActionsService();
