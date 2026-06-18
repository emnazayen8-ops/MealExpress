// Configuration centralisée des URLs API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_URL = API_BASE_URL;

export const endpoints = {
  auth: `${API_BASE_URL}/api/auth`,
  boxes: `${API_BASE_URL}/api/boxes`,
  products: `${API_BASE_URL}/api/products`,
  subscriptions: `${API_BASE_URL}/api/subscriptions`,
  orders: `${API_BASE_URL}/api/orders`,
  contact: `${API_BASE_URL}/api/contact`,
};

export default API_BASE_URL;