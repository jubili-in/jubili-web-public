import { API_BASE_URL, API_ENDPOINTS } from '@/lib/constants/api';
import { Address, AddressListResponse } from '@/lib/types/address';

export class AddressService {
  async getMyAddresses(token: string): Promise<Address[]> {
    if (!token) {
      throw new Error('Authentication token is required');
    }

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADDRESS.MY_ADDRESSES}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error((errorData as { message?: string }).message || `Failed to fetch addresses: ${response.status}`);
    }

    const data: AddressListResponse = await response.json();
    return data.data || [];
  }

  async updateAddress(addressId: string, payload: Partial<Address>, token: string): Promise<void> {
    if (!addressId) throw new Error('Address ID is required');
    if (!token) throw new Error('Authentication token is required');

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADDRESS.UPDATE(addressId)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error((errorData as { message?: string }).message || `Failed to update address: ${response.status}`);
    }
  }

  async deleteAddress(addressId: string, token: string): Promise<void> {
    if (!addressId) throw new Error('Address ID is required');
    if (!token) throw new Error('Authentication token is required');

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ADDRESS.DELETE(addressId)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error((errorData as { message?: string }).message || `Failed to delete address: ${response.status}`);
    }
  }
}

export const addressService = new AddressService();


