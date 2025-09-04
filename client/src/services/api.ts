const API_BASE_URL = 'https://my-restaurant-m8od.onrender.com/api';

// Auth token management
export const getAuthToken = () => localStorage.getItem('authToken');
export const setAuthToken = (token: string) => localStorage.setItem('authToken', token);
export const removeAuthToken = () => localStorage.removeItem('authToken');

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'API request failed');
  }
  
  return response.json();
};

// Auth APIs
export const authAPI = {
  register: async (userData: { name: string; email: string; password: string; phone?: string }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  logout: () => {
    removeAuthToken();
  },
};

// Menu APIs
export const menuAPI = {
  getMenu: async () => {
    return apiRequest('/menu');
  },

  addMenuItem: async (menuItem: any) => {
    return apiRequest('/admin/menu', {
      method: 'POST',
      body: JSON.stringify(menuItem),
    });
  },

  updateMenuItem: async (id: string, menuItem: any) => {
    return apiRequest(`/admin/menu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(menuItem),
    });
  },

  deleteMenuItem: async (id: string) => {
    return apiRequest(`/admin/menu/${id}`, {
      method: 'DELETE',
    });
  },
};

// Order APIs
export const orderAPI = {
  createOrder: async (orderData: any) => {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getMyOrders: async () => {
    return apiRequest('/orders/my');
  },

  cancelOrder: async (orderId: string) => {
    return apiRequest(`/orders/${orderId}/cancel`, {
      method: 'PUT',
    });
  },

  getAdminOrders: async () => {
    return apiRequest('/admin/orders');
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    return apiRequest(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// Payment APIs
export const paymentAPI = {
  initiateMpesaPayment: async (paymentData: { orderId: string; phoneNumber: string; amount: number }) => {
    return apiRequest('/payments/mpesa', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },
};

// Reservation APIs
export const reservationAPI = {
  createReservation: async (reservationData: any) => {
    return apiRequest('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    });
  },

  getMyReservations: async () => {
    return apiRequest('/reservations/my');
  },

  getAdminReservations: async () => {
    return apiRequest('/admin/reservations');
  },

  updateReservationStatus: async (reservationId: string, status: string) => {
    return apiRequest(`/admin/reservations/${reservationId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// Loyalty APIs
export const loyaltyAPI = {
  getMyLoyaltyPoints: async () => {
    return apiRequest('/loyalty/points');
  },

  redeemLoyaltyPoints: async (points: number) => {
    return apiRequest('/loyalty/redeem', {
      method: 'POST',
      body: JSON.stringify({ points }),
    });
  },
};

// Admin APIs
export const adminAPI = {
  getAdminUsers: async () => {
    return apiRequest('/admin/users');
  },
};