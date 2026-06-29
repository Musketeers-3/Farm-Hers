const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Helper to get auth token
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper for auth headers
const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ============ AUTH API ============
export const authAPI = {
  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return res.json();
  },

  login: async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return res.json();
  },

  getProfile: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: { ...authHeaders() },
    });
    return res.json();
  },
};

// ============ POOLS API ============
export const poolsAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/pools${query ? `?${query}` : ''}`);
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/pools/${id}`);
    return res.json();
  },

  create: async (poolData) => {
    const res = await fetch(`${API_BASE_URL}/pools`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(poolData),
    });
    return res.json();
  },

  update: async (id, updates) => {
    const res = await fetch(`${API_BASE_URL}/pools/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  join: async (poolId, data) => {
    const res = await fetch(`${API_BASE_URL}/pools/${poolId}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  close: async (id) => {
    const res = await fetch(`${API_BASE_URL}/pools/${id}/close`, {
      method: 'POST',
    });
    return res.json();
  },
};

// ============ DEMANDS API ============
export const demandsAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/demands${query ? `?${query}` : ''}`);
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/demands/${id}`);
    return res.json();
  },

  create: async (demandData) => {
    const res = await fetch(`${API_BASE_URL}/demands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(demandData),
    });
    return res.json();
  },

  join: async (demandId, data) => {
    const res = await fetch(`${API_BASE_URL}/demands/${demandId}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

// ============ NOTIFICATIONS API ============
export const notificationsAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/notifications${query ? `?${query}` : ''}`, {
      headers: { ...authHeaders() },
    });
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  markAsRead: async (id) => {
    const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'POST',
      headers: { ...authHeaders() },
    });
    return res.json();
  },
};

// ============ PAYMENTS API ============
export const paymentsAPI = {
  createOrder: async (orderData) => {
    const res = await fetch(`${API_BASE_URL}/payments/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    return res.json();
  },

  getOrder: async (orderId) => {
    const res = await fetch(`${API_BASE_URL}/payments/orders?orderId=${orderId}`);
    return res.json();
  },

  updateOrder: async (orderId, updates) => {
    const res = await fetch(`${API_BASE_URL}/payments/orders`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, updates }),
    });
    return res.json();
  },

  getFarmerOrders: async (farmerId) => {
    const res = await fetch(`${API_BASE_URL}/payments/farmer-orders/${farmerId}`);
    return res.json();
  },

  getBuyerOrders: async (buyerId) => {
    const res = await fetch(`${API_BASE_URL}/payments/buyer-orders/${buyerId}`);
    return res.json();
  },
};

// ============ AUCTIONS API ============
export const auctionsAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/auctions${query ? `?${query}` : ''}`);
    return res.json();
  },

  getLive: async () => {
    const res = await fetch(`${API_BASE_URL}/auctions/live`);
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/auctions/${id}`);
    return res.json();
  },

  getByFarmer: async (farmerId) => {
    const res = await fetch(`${API_BASE_URL}/auctions/farmer/${farmerId}`);
    return res.json();
  },

  create: async (auctionData) => {
    const res = await fetch(`${API_BASE_URL}/auctions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(auctionData),
    });
    return res.json();
  },

  placeBid: async (auctionId, bidData) => {
    const res = await fetch(`${API_BASE_URL}/auctions/${auctionId}/bid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bidData),
    });
    return res.json();
  },

  end: async (auctionId, status = 'ended') => {
    const res = await fetch(`${API_BASE_URL}/auctions/${auctionId}/end`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },
};