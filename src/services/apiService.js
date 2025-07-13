import axios from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API || 'http://localhost:9000';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            window.location.href = '/login';
            toast.error('Session expired. Please login again.');
        } else if (error.response?.status === 403) {
            toast.error('Access denied. Insufficient permissions.');
        } else if (error.response?.status >= 500) {
            toast.error('Server error. Please try again later.');
        } else if (error.code === 'ECONNABORTED') {
            toast.error('Request timeout. Please check your connection.');
        }
        return Promise.reject(error);
    }
);

// API service methods
export const apiService = {
    // Analytics endpoints
    getDashboardStats: () => api.get('/analytics/dashboard'),
    getSalesAnalytics: (period = '7days') => api.get(`/analytics/sales?period=${period}`),
    getProductAnalytics: () => api.get('/analytics/products'),
    getUserAnalytics: () => api.get('/analytics/users'),
    getOrderAnalytics: () => api.get('/analytics/orders'),
    getRevenueAnalytics: (period = 'monthly') => api.get(`/analytics/revenue?period=${period}`),
    getTodaysOrdersTest: () => api.get('/analytics/today-orders'),

    // Admin management endpoints
    getAllAdmins: () => api.get('/admin/all'),
    getAdmin: (adminId) => api.get(`/admin/${adminId}`),
    getCurrentAdmin: () => api.get('/admin/profile/me'),
    createAdmin: (adminData) => api.post('/admin/create', adminData),
    updateAdmin: (adminId, adminData) => api.patch(`/admin/${adminId}`, adminData),
    deleteAdmin: (adminId) => api.delete(`/admin/${adminId}`),
    changeAdminPassword: (adminId, passwordData) => api.patch(`/admin/${adminId}/password`, passwordData),

    // Ads management endpoints
    getAllAds: () => api.get('/ads/all'),
    getSingleAd: (adId) => api.get(`/ads/${adId}`),
    getActiveAds: () => api.get('/ads/active'),
    createAd: (adData) => {
        const formData = new FormData();
        Object.keys(adData).forEach(key => {
            formData.append(key, adData[key]);
        });
        return api.post('/ads/create', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    updateAd: (adId, adData) => {
        const formData = new FormData();
        Object.keys(adData).forEach(key => {
            formData.append(key, adData[key]);
        });
        return api.patch(`/ads/${adId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    deleteAd: (adId) => api.delete(`/ads/${adId}`),

    // Promotions management endpoints
    getAllPromotions: () => api.get('/promotions/all'),
    createPromotion: (promoData) => api.post('/promotions/create', promoData),
    validatePromoCode: (promoCode, orderAmount) => api.post('/promotions/validate', { promo_code: promoCode, order_amount: orderAmount }),

    // Admin authentication
    logout: () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        // Clear any other admin-related data
        return Promise.resolve();
    },

    // Refunds management endpoints
    getAllRefunds: () => api.get('/refunds/all'),
    getUserRefunds: () => api.get('/refunds/user'),
    getSingleRefund: (refundId) => api.get(`/refunds/${refundId}`),
    getRefundStats: () => api.get('/refunds/stats'),
    updateRefundStatus: (refundId, statusData) => api.patch(`/refunds/${refundId}/status`, statusData),
    cancelRefundRequest: (refundId) => api.patch(`/refunds/${refundId}/cancel`),
    deleteRefund: (refundId) => api.delete(`/refunds/${refundId}`),

    // User management endpoints
    getAllUsers: () => api.get('/users/all'),
    getUser: (userId) => api.get(`/user/${userId}`),
    deleteUser: (userId) => api.delete(`/user/${userId}`),

    // Product management endpoints
    getAllProducts: () => api.get('/all/product'),
    getProduct: (productId) => api.get(`/product/${productId}`),
    createProduct: (productData, onUploadProgress = null) => {
        const formData = new FormData();
        Object.keys(productData).forEach(key => {
            if (key === 'images' && Array.isArray(productData[key])) {
                productData[key].forEach(file => {
                    formData.append('images', file);
                });
            } else if (key === 'product_image' && productData[key]) {
                formData.append('product_image', productData[key]);
            } else {
                formData.append(key, productData[key]);
            }
        });

        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        };

        if (onUploadProgress) {
            config.onUploadProgress = onUploadProgress;
        }

        return api.post('/new/product', formData, config);
    },
    updateProduct: (productId, productData) => {
        // For basic product updates (name, price, description, quantity), send as JSON
        return api.patch(`/update/product/${productId}`, productData, {
            headers: { 'Content-Type': 'application/json' }
        });
    },
    deleteProduct: (productId) => api.delete(`/product/${productId}`),

    // Order management endpoints
    getAllOrders: () => api.get('/orders/all'),
    getOrder: (orderId) => api.get(`/orders/${orderId}`),
    updateOrderStatus: (orderId, statusData) => api.patch(`/orders/${orderId}/status`, statusData),

    // Contact management endpoints
    getContactMessages: () => api.get('/contact/messages'),
    updateContactStatus: (contactId, statusData) => api.patch(`/contact/messages/${contactId}`, statusData),
};

export default api;
