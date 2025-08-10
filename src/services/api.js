import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://rentix-api.onrender.com',
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido/expirado - redireciona para login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Manager
export const registerManager = () => api.post('/auth/register');
export const loginManager = () => api.post('/auth/login');
export const dashboardManager = () => api.get('/dashboard/manager');

// Tenants
// export const getTenants = () => api.get('/inquilinos');
export const getTenantById = (id) => api.get(`/tenants/${id}`);
export const createTenant = (data) => api.post('/tenants', data);
export const updateTenant = (id, data) => api.put(`/tenants/${id}`, data);
export const deleteTenant = (id) => api.delete(`/tenants/${id}`);

// Property
export const getPropertyById = (id) => api.get(`/properties/${id}`);
export const createProperty = (data) => api.post('/properties', data);
export const updateProperty = (id, data) => api.put(`/properties/${id}`, data);
export const deleteProperty = (id) => api.delete(`/properties/${id}`);

// Payments
export const createPayment = (data) => api.post('/payments', data);
export const updatePayment = (id, data) => api.put(`/payments/${id}`, data);
export const getPaymentById = (id) => api.get(`/payments/${id}`);

// History
export const getPaymentHistory =  (data) => api.get('/payment-history');
export const getPaymentHistoryById = (id) => api.get(`/payment-history/tenant/${id}`);

// Fines
export const getFineSettings =  (data) => api.get('/fine-settings');
export const updateFineSettings =  (data) => api.put('/fine-settings');

// Notifications
export const createNotification = (data) => api.post('/notifications', data);
export const getNotification = (data) => api.get('/notifications', data);
export const getNotificationById = (id) => api.get(`/notifications/tenant/${id}`);

export default api;
