export interface Address {
  addressId: string;
  name: string;
  phoneNumber: string;
  altPhoneNumber?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressType?: 'HOME' | 'WORK' | 'OTHER' | string;
  latitude?: number | null;
  longitude?: number | null;
  isDefault?: boolean;
  createdAt?: string;
  ownerId?: string;
  ownerType?: string;
}

export interface AddressListResponse {
  success: boolean;
  message: string;
  data: Address[];
}

