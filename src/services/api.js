import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || import.meta.env.API_DOMAIN,
  timeout: 300000,
    headers: {
    "Content-Type": "application/json",
  },
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

const ApiService = {

  // Manager
  registerManager: () => api.post('/auth/register'),
  loginManager: (data) => api.post('/auth/login', (data)),
  dashboardManager: () => api.get('/dashboard/manager'),

  // Tenants
  getTenantById: (id) => api.get(`/tenants/${id}`),
  createTenant: (data) => api.post('/tenants', data),
  updateTenant: (id, data) => api.put(`/tenants/${id}`, data),
  deleteTenant: (id) => api.delete(`/tenants/${id}`),

  // Property
  getPropertyById: (id) => api.get(`/properties/${id}`),
  createProperty: (data) => api.post('/properties', data),
  updateProperty: (id, data) => api.put(`/properties/${id}`, data),
  deleteProperty: (id) => api.delete(`/properties/${id}`),

  // Payments
  createPayment: (data) => api.post('/payments', data),
  updatePayment: (id, data) => api.put(`/payments/${id}`, data),
  getPaymentById: (id) => api.get(`/payments/${id}`),

  // History
  getPaymentHistory:  (data) => api.get('/payment-history', (data)),
  getPaymentHistoryById: (id) => api.get(`/payment-history/tenant/${id}`),

  // Fines
  getFineSettings:  () => api.get('/fine-settings'),
  updateFineSettings:  (data) => api.put('/fine-settings', (data)),

  // Notifications
  createNotification: (data) => api.post('/notifications', data),
  getNotification: (data) => api.get('/notifications', data),
  getNotificationById: (id) => api.get(`/notifications/tenant/${id}`)

}

export default ApiService;
