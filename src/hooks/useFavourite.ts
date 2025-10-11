import { useState, useCallback, useEffect } from 'react';
import { userActionsService } from '@/services/userActions.service';
import { useAuth } from './useAuth';
import { useToastActions } from './useToastActions';
import { FavAction, FavouritesApiResponse, FavouriteItem } from '@/lib/types/userAction';
import { Product } from '@/lib/types/product';

interface useFavouriteReturn {
    favouritedProducts: Product[] | null;
    loading: boolean;
    error: string | null;
    addToFavorites: (productId: string) => Promise<void>;
    handleUnfavourite: (productId: string) => Promise<void>;
    refetch: () => Promise<void>;
}

export const useFavourite = (): useFavouriteReturn => {
    const [favouritedProducts, setFavouritedProducts] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const { showError, showSuccess, showToastWithAction } = useToastActions();


    const fetchFavourites = useCallback(async () => {
        if (!user?.userId) {
            setFavouritedProducts(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response: FavouritesApiResponse = await userActionsService.getFavourites(user.userId);
            if (!response || !response.items || response.items.length === 0) {
                setFavouritedProducts([]);
                return;
            }
            // Map FavouriteItem[] to Product[]
            const products: Product[] = response.items.map((item: FavouriteItem) => ({
                productId: item.productId,
                productName: item.productName,
                productDescription: item.description,
                imageUrls: [item.imageUrl],
                currentPrice: 0,
                price: 0,
                brand: '',
                gender: '',
                sizes: [],
                colors: [],
                category: '',
                stock: 0,
                likeCount: 0,
                dimensions: {
                    length: 0,
                    breadth: 0,
                    height: 0,
                    weight: 0,
                },
            }));
            setFavouritedProducts(products);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch favourites';
            setError(errorMessage);
            showError(errorMessage);
            setFavouritedProducts([]);
        } finally {
            setLoading(false);
        }
    }, [user?.userId, showError]);

    // Fetch favourites on component mount and when user changes
    useEffect(() => {
        fetchFavourites();
    }, [fetchFavourites]);

    const addToFavorites = useCallback(async (productId: string) => {
        if (!user) {
            showError('Please login to add to favorites');
            showToastWithAction(
                'info',
                'Login Required',
                'Please log in to add items to your favourites.',
                'Go to Login',
                () => window.location.href = '/login',
                5000
            );
            return;
        }

        if (!productId || productId.trim() === '') {
            showError('Invalid product ID');
            return;
        }

        // Check if already favourited
        if (favouritedProducts?.some(product => product.productId === productId)) {
            showError('This product is already in your favourites');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const favData: FavAction = {
                userId: user.userId,
                actionType: 'FAVOURITE',
                productId,
                quantity: '1' // Required by API but not meaningful for favorites
            };

            await userActionsService.addToFav(favData);

            showToastWithAction(
                'success',
                'Done',
                'Item added to favourite successfully',
                'Go to Favourite',
                () => window.location.href = '/favourite',
                5000
            );

            // Refetch favourites to update the list
            await fetchFavourites();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to add to favorites';
            setError(errorMessage);
            showError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [user, showError, showToastWithAction, fetchFavourites, favouritedProducts]);

    const handleUnfavourite = useCallback(async (productId: string) => {
        if (!user?.userId) {
            showError('Please login to remove from favorites');
            return;
        }

        if (!productId || productId.trim() === '') {
            showError('Invalid product ID');
            return;
        }

        // Optimistic update - remove from UI immediately
        const previousProducts = favouritedProducts;
        if (favouritedProducts) {
            const updatedProducts = favouritedProducts.filter(
                product => product.productId !== productId
            );
            setFavouritedProducts(updatedProducts);
        }

        setLoading(true);
        setError(null);

        try {
            const favData: FavAction = {
                userId: user.userId,
                actionType: 'FAVOURITE',
                productId,
                quantity: '1'
            };

            await userActionsService.deleteFav(favData);
            showSuccess('Item removed from favourites');

            // Refetch to ensure consistency with server
            await fetchFavourites();
        } catch (err) {
            // Revert optimistic update on error
            setFavouritedProducts(previousProducts);

            const errorMessage = err instanceof Error ? err.message : 'Failed to remove from favorites';
            setError(errorMessage);
            showError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [user, showError, showSuccess, fetchFavourites, favouritedProducts]);

    const refetch = useCallback(async () => {
        await fetchFavourites();
    }, [fetchFavourites]);

    return {
        favouritedProducts,
        loading,
        error,
        addToFavorites,
        handleUnfavourite,
        refetch
    };
};
