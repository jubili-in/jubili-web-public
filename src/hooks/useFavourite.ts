import { useState, useCallback } from 'react';
import { userActionsService } from '@/services/userActions.service';
import { useAuth } from './useAuth';
import { useToastActions } from './useToastActions';
import { FavAction } from '@/lib/types/userAction';

interface useFavouriteReturn {
    loading: boolean;
    addToFavorites: (productId: string) => Promise<void>;
    error: string | null;
}

export const useFavourite = (): useFavouriteReturn => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const { showError, showSuccess, showToastWithAction } = useToastActions();

    const addToFavorites = useCallback(async (productId: string) => {
        if (!user?.userId) {
            showError('Please login to add to favorites');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const favData: FavAction = {
                userId: user.userId,
                actionType: 'FAVOURITE',
                productId,
                quantity: '1'  // Required by API but not meaningful for favorites
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
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to add to favorites';
            setError(errorMessage);
            showError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [user, showError, showSuccess]);

    return {
        loading,
        addToFavorites,
        error
    };
}