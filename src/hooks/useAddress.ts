import { useState, useCallback } from 'react';
import { addressService } from '@/services/address.service';
import { Address } from '@/lib/types/address';
import { useAuth } from './useAuth';
import { useToastActions } from './useToastActions';

interface UseAddressReturn {
  addresses: Address[];
  loading: boolean;
  error: string | null;
  fetchAddresses: () => Promise<Address[]>;
  updateAddress: (addressId: string, payload: Partial<Address>) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  refetch: () => Promise<void>;
  getDefaultAddress: () => Address | null;
}

export const useAddress = (): UseAddressReturn => {
  const { token } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useToastActions();

  const fetchAddresses = useCallback(async (): Promise<Address[]> => {
    if (!token) {
      setError('Authentication required');
      setLoading(false);
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const data = await addressService.getMyAddresses(token);
      setAddresses(data);
      return data;
    } catch (err) {
      console.error('Error fetching addresses:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch addresses';
      setError(errorMessage);
      showError('Address Error', errorMessage, 5000);
      return [];
    } finally {
      setLoading(false);
    }
  }, [token, showError]);

  const updateAddress = useCallback(async (addressId: string, payload: Partial<Address>) => {
    if (!token) {
      setError('Authentication required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await addressService.updateAddress(addressId, payload, token);
      await fetchAddresses(); // Refresh addresses after updating
      showSuccess('Updated!', 'Address updated successfully', 3000);
    } catch (err) {
      console.error('Failed to update address:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update address';
      setError(errorMessage);
      showError('Error', errorMessage, 5000);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, fetchAddresses, showSuccess, showError]);

  const deleteAddress = useCallback(async (addressId: string) => {
    if (!token) {
      setError('Authentication required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await addressService.deleteAddress(addressId, token);
      await fetchAddresses(); // Refresh addresses after deleting
      showSuccess('Deleted!', 'Address deleted successfully', 3000);
    } catch (err) {
      console.error('Failed to delete address:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete address';
      setError(errorMessage);
      showError('Error', errorMessage, 5000);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token, fetchAddresses, showSuccess, showError]);

  const refetch = useCallback(async () => {
    await fetchAddresses();
  }, [fetchAddresses]);

  const getDefaultAddress = useCallback((): Address | null => {
    return addresses.find(addr => addr.isDefault) || addresses[0] || null;
  }, [addresses]);

  return {
    addresses,
    loading,
    error,
    fetchAddresses,
    updateAddress,
    deleteAddress,
    refetch,
    getDefaultAddress,
  };
};
