export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/users/login',
    REGISTER: '/api/users/signup',
    VERIFY: '/api/users/verify',
    LOGOUT: '/api/users/logout',
    GOOGLE_OAUTH: '/api/users/auth/google',
    GOOGLE_CALLBACK: '/api/users/auth/google/callback',
  },
  PRODUCTS: {
    SEARCH: '/api/products/search-products',
    LIKE: '/api/products/like',
    // Product details endpoint expects a query param: ?id={productId}
    DETAIL: '/api/products',
  },
  USER_ACTIONS: {
    BASE: '/api/user-actions',
    LIKED_PRODUCTS: '/api/user-actions/liked-products',
    CART: (userId: string) => `/api/user-actions/cart?userId=${userId}`,
    FAVOURITE: `/api/user-actions/get-fev`,
    // DY_CART_RTE: '/api/user-actions',
    // DELETE_CART: '/api/user-actions'
  },
  ADDRESS: {
    BASE: '/api/address',
    MY_ADDRESSES: '/api/address/my-addresses',
    CREATE: '/api/address/create',
    BY_ID: (addressId: string) => `/api/address/${addressId}`,
    UPDATE: (addressId: string) => `/api/address/update/${addressId}`,
    DELETE: (addressId: string) => `/api/address/delete/${addressId}`,
    SET_DEFAULT: (addressId: string) => `/api/address/set-default/${addressId}`,
  },
} as const;