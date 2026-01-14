/**
 * Admin Authentication Helpers
 * Shared utilities for admin panel authentication
 */

import { toast } from 'sonner';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Get authentication headers for API calls
export const getAuthHeaders = () => {
    const token = localStorage.getItem('dani_admin_token');
    if (!token) {
        return null;
    }
    return { Authorization: `Bearer ${token}` };
};

// Check if token is valid (not expired)
export const isTokenValid = () => {
    const token = localStorage.getItem('dani_admin_token');
    if (!token) return false;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        return payload.exp > now;
    } catch (e) {
        return false;
    }
};

// Handle 401 errors and redirect to login
export const handleAuthError = (error, navigate) => {
    if (error.response?.status === 401) {
        localStorage.removeItem('dani_admin_token');
        toast.error('Sessão expirada. Por favor faça login novamente.');
        if (navigate) {
            navigate('/admin');
        } else {
            window.location.href = '/admin';
        }
        return true;
    }
    return false;
};

// Clear token and redirect to login
export const logout = () => {
    localStorage.removeItem('dani_admin_token');
    window.location.href = '/admin';
};

// Check authentication and redirect if needed
export const requireAuth = (navigate) => {
    if (!isTokenValid()) {
        localStorage.removeItem('dani_admin_token');
        toast.error('Por favor faça login para continuar.');
        navigate('/admin');
        return false;
    }
    return true;
};

export { API_URL };
